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
      if (result?.error) {
        setError(Object.values(result.error).flat()[0]);
      } else {
        const form = document.getElementById('add-form') as HTMLFormElement;
        form.reset();
      }
    });
  }

  return (
    <div className="mb-16">
      <form
        id="add-form"
        action={clientAction}
        className="relative group bg-slate-900/40 backdrop-blur-xl border border-white/5 p-2 rounded-2xl flex flex-col md:flex-row gap-2 shadow-2xl transition-all hover:border-blue-500/30"
      >
        <div className="relative flex-1">
          <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            name="title"
            placeholder="Website Name"
            required
            className="w-full bg-transparent pl-11 pr-4 py-3 rounded-xl outline-none focus:bg-white/5 transition-all text-sm placeholder:text-slate-600"
          />
        </div>

        <div className="hidden md:block w-px h-6 self-center bg-white/10" />

        <div className="relative flex-[2]">
          <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            name="url"
            type="url"
            placeholder="https://example.com"
            required
            className="w-full bg-transparent pl-11 pr-4 py-3 rounded-xl outline-none focus:bg-white/5 transition-all text-sm placeholder:text-slate-600"
          />
        </div>

        <button
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-500 active:scale-95 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <span>Save Link</span>
        </button>
      </form>
      {error && (
        <p className="mt-3 text-xs text-rose-400 ml-4 font-medium animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
}
