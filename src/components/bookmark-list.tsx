'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ExternalLink, Trash2, Globe } from 'lucide-react';
import { deleteBookmark } from '@/app/actions/bookmarks';

type Bookmark = {
  id: string;
  url: string;
  title: string;
  created_at: string;
};

export default function BookmarkList({
  initialBookmarks,
}: {
  initialBookmarks: Bookmark[];
}) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks);
  const supabase = createClient();

  useEffect(() => {
    // 1. Subscribe to realtime changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for ALL changes (INSERT, DELETE, etc.)
          schema: 'public',
          table: 'bookmarks',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newBookmark = payload.new as Bookmark;
            setBookmarks((prev) => [newBookmark, ...prev]);
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((prev) => prev.filter((b) => b.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    // 2. Cleanup subscription on unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800">
        <Globe className="w-12 h-12 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-500">
          No bookmarks yet. Add your first link above!
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="group p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-md transition-all flex justify-between items-start"
        >
          <div className="space-y-1 overflow-hidden">
            <h3 className="font-semibold truncate text-slate-800 dark:text-slate-100">
              {bookmark.title}
            </h3>
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span className="truncate">{new URL(bookmark.url).hostname}</span>
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
            </a>
          </div>

          <button
            onClick={() => deleteBookmark(bookmark.id)}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
