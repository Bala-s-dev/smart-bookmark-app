'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ExternalLink, Trash2, Globe, ArrowUpRight, Clock } from 'lucide-react';
import { deleteBookmark } from '@/app/actions/bookmarks';

export default function BookmarkList({
  initialBookmarks,
}: {
  initialBookmarks: any[];
}) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const supabase = createClient();

  useEffect(() => {
    // 1. Initialize the Realtime channel
    const channel = supabase
      .channel('realtime-bookmarks') // Unique channel name
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for INSERT, UPDATE, and DELETE
          schema: 'public',
          table: 'bookmarks',
        },
        (payload) => {
          console.log('Realtime Change Detected:', payload);

          if (payload.eventType === 'INSERT') {
            const newRecord = payload.new;
            setBookmarks((prev) => [newRecord, ...prev]);
          }

          if (payload.eventType === 'DELETE') {
            const oldId = payload.old.id;
            setBookmarks((prev) => prev.filter((b) => b.id !== oldId));
          }
        },
      )
      .subscribe((status) => {
        console.log('Subscription Status:', status);
      });

    // 2. Cleanup: Important to prevent duplicate listeners on re-renders
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Empty State UI
  if (bookmarks.length === 0) {
    return (
      <div className="py-24 text-center bg-slate-900/20 border border-dashed border-white/5 rounded-3xl">
        <Globe className="w-12 h-12 text-slate-800 mx-auto mb-4 opacity-50" />
        <p className="text-slate-500 font-medium tracking-wide">
          Your collection is empty. Add a link above!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="group relative bg-slate-900/40 backdrop-blur-md border border-white/5 hover:border-blue-500/40 rounded-2xl p-6 transition-all duration-300 shadow-lg"
        >
          {/* Top Row: Icon and Delete Action */}
          <div className="flex justify-between items-start mb-6">
            <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
              <Globe className="w-5 h-5" />
            </div>
            <button
              onClick={async () => {
                if (confirm('Delete this bookmark?')) {
                  await deleteBookmark(bookmark.id);
                }
              }}
              className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
              title="Delete Bookmark"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Content: Title and Hostname */}
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white leading-tight group-hover:text-blue-400 transition-colors truncate">
              {bookmark.title}
            </h3>
            <p className="text-xs font-mono text-slate-500 truncate uppercase tracking-tighter">
              {new URL(bookmark.url).hostname}
            </p>
          </div>

          {/* Bottom Row: Visit Link Action */}
          <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-4">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
              <Clock className="w-3 h-3" />
              Live
            </div>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group/btn inline-flex items-center gap-2 text-xs font-black text-blue-500 hover:text-blue-400 tracking-widest transition-all"
            >
              VISIT PORTAL
              <ArrowUpRight className="w-3 h-3 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
