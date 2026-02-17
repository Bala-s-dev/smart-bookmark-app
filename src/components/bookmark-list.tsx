'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ExternalLink, Trash2, Globe, Clock } from 'lucide-react';
import { deleteBookmark } from '@/app/actions/bookmarks';

export default function BookmarkList({
  initialBookmarks,
}: {
  initialBookmarks: any[];
}) {
  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('realtime-bookmarks')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookmarks' },
        (payload) => {
          if (payload.eventType === 'INSERT')
            setBookmarks((prev) => [payload.new, ...prev]);
          if (payload.eventType === 'DELETE')
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (bookmarks.length === 0)
    return (
      <div className="py-24 text-center bg-slate-900/20 border-2 border-dashed border-slate-800 rounded-3xl">
        <Globe className="w-12 h-12 text-slate-700 mx-auto mb-4" />
        <p className="text-slate-500 font-medium">
          Your collection is empty. Let's add something!
        </p>
      </div>
    );

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="group bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-900/60 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between shadow-sm"
        >
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="p-2.5 bg-blue-500/10 rounded-xl text-blue-400 group-hover:scale-110 transition-transform">
                <Globe className="w-5 h-5" />
              </div>
              <button
                onClick={() => deleteBookmark(bookmark.id)}
                className="p-2 text-slate-600 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <h3 className="text-lg font-bold text-slate-100 mb-1 truncate">
              {bookmark.title}
            </h3>
            <p className="text-sm text-slate-500 font-mono truncate">
              {new URL(bookmark.url).hostname}
            </p>
          </div>

          <div className="mt-8 pt-4 border-t border-slate-800/50 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] text-slate-600 uppercase tracking-wider font-bold">
              <Clock className="w-3 h-3" />
              Recent
            </div>
            <a
              href={bookmark.url}
              target="_blank"
              className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1.5"
            >
              OPEN LINK <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
