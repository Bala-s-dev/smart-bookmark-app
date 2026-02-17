'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-full mb-4">
        <AlertCircle className="w-10 h-10 text-red-600" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Something went wrong!</h2>
      <p className="text-slate-500 max-w-md mb-8">
        We encountered an error while loading your bookmarks. Please try
        refreshing or check your connection.
      </p>
      <button
        onClick={() => reset()}
        className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity"
      >
        <RefreshCcw className="w-4 h-4" />
        Try again
      </button>
    </div>
  );
}
