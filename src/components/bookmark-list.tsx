'use client';

import { useEffect, useState, useOptimistic, useTransition } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Trash2, Globe, ArrowUpRight, Clock } from 'lucide-react';
import { deleteBookmark } from '@/app/actions/bookmarks';
// Import the payload type from Supabase
import { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export default function BookmarkList({
  initialBookmarks,
}: {
  initialBookmarks: any[];
}) {
  
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [isPending, startTransition] = useTransition();
  const supabase = createClient();

  const [optimisticBookmarks, addOptimisticDelete] = useOptimistic(
    bookmarks,
    (state, deletedId) => state.filter((b) => b.id !== deletedId),
  );

  useEffect(() => {
    const channel = supabase
      .channel('realtime-bookmarks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookmarks' },
        // Explicitly type the payload parameter
        (payload: RealtimePostgresChangesPayload<any>) => {
          if (payload.eventType === 'INSERT') {
            setBookmarks((prev) => [payload.new as any, ...prev]);
          }
          if (payload.eventType === 'DELETE') {
            // payload.old might be empty depending on Replica Identity settings
            const deletedId = (payload.old as any)?.id;
            if (deletedId) {
              setBookmarks((prev) => prev.filter((b) => b.id !== deletedId));
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (bookmarks.length === 0)
    return (
      <div className="py-32 text-center bg-slate-900/20 border border-dashed border-white/5 rounded-[2.5rem]">
        <Globe className="w-12 h-12 text-slate-800 mx-auto mb-6 opacity-30" />
        <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">
          No entries found in your vault.
        </p>
      </div>
    );

  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => {
        const domain = new URL(bookmark.url).hostname;
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

        return (
          <div
            key={bookmark.id}
            className="group relative bg-[#0b1120]/40 backdrop-blur-sm border border-white/5 hover:border-blue-500/40 rounded-[2rem] p-8 transition-all duration-500 shadow-2xl hover:-translate-y-1"
          >
            <div className="flex justify-between items-start mb-8">
              <div className="relative h-14 w-14 flex items-center justify-center bg-white/5 rounded-2xl border border-white/10 group-hover:border-blue-500/30 transition-all duration-500 overflow-hidden shadow-inner">
                <img
                  src={faviconUrl}
                  alt={bookmark.title}
                  className="w-8 h-8 object-contain z-10 relative"
                  onError={(e) => {
                    e.currentTarget.style.opacity = '0';
                  }}
                />
                <Globe className="absolute w-6 h-6 text-slate-800" />
              </div>

              <button
                onClick={() => deleteBookmark(bookmark.id)}
                className="p-3 text-slate-700 hover:text-rose-500 hover:bg-rose-500/10 rounded-2xl transition-all active:scale-90"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors line-clamp-1">
                {bookmark.title}
              </h3>
              <p className="text-[10px] font-black text-slate-600 truncate uppercase tracking-[0.2em] font-mono">
                {domain}
              </p>
            </div>

            <div className="mt-10 flex items-center justify-between">
              <a
                href={bookmark.url}
                target="_blank"
                className="group/btn inline-flex items-center gap-2 text-[10px] font-black text-blue-500 hover:text-white bg-blue-500/5 hover:bg-blue-600 px-4 py-2 rounded-lg tracking-[0.2em] transition-all"
              >
                LAUNCH
                <ArrowUpRight className="w-3 h-3 transition-transform group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5" />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
