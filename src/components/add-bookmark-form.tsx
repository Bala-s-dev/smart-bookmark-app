'use client';

import { useState, useTransition } from 'react';
import { addBookmark } from '@/app/actions/bookmarks';
import { Plus, Loader2, Link as LinkIcon, Type } from 'lucide-react';

export default function AddBookmarkForm() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function clientAction(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await addBookmark(formData);
      if (result?.error) setError(Object.values(result.error).flat()[0]);
      else (document.getElementById('add-form') as HTMLFormElement).reset();
    });
  }

  return (
    <section className="mb-12">
      <form
        id="add-form"
        action={clientAction}
        className="bg-slate-900/50 border border-slate-800 p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-2xl"
      >
        <div className="relative flex-1">
          <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            name="title"
            placeholder="Site Name"
            required
            className="w-full bg-transparent pl-11 pr-4 py-3 rounded-xl outline-none focus:bg-slate-800/50 transition-all text-sm"
          />
        </div>
        <div className="hidden md:block w-px h-6 self-center bg-slate-800" />
        <div className="relative flex-[2]">
          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            name="url"
            type="url"
            placeholder="https://..."
            required
            className="w-full bg-transparent pl-11 pr-4 py-3 rounded-xl outline-none focus:bg-slate-800/50 transition-all text-sm"
          />
        </div>
        <button
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Add Bookmark
        </button>
      </form>
      {error && (
        <p className="mt-3 text-xs text-red-400 ml-4 font-medium">{error}</p>
      )}
    </section>
  );
}
