'use client';

import { useState, useTransition } from 'react';
import { addBookmark } from '@/app/actions/bookmarks';
import { Plus, Loader2 } from 'lucide-react';

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
        // Reset form on success
        const form = document.getElementById(
          'add-bookmark-form',
        ) as HTMLFormElement;
        form.reset();
      }
    });
  }

  return (
    <form
      id="add-bookmark-form"
      action={clientAction}
      className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm"
    >
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 space-y-1">
          <input
            name="title"
            placeholder="Website Title (e.g. GitHub)"
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <div className="flex-[2] space-y-1">
          <input
            name="url"
            type="url"
            placeholder="https://github.com"
            required
            className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-transparent outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 min-w-[140px]"
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Add Link
        </button>
      </div>
      {error && (
        <p className="mt-3 text-sm text-red-500 font-medium">{error}</p>
      )}
    </form>
  );
}
