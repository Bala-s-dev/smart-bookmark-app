'use client';

import { createClient } from '@/utils/supabase/client';
import { Bookmark } from 'lucide-react';

export default function LoginPage() {
  const supabase = createClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="p-8 bg-white dark:bg-slate-900 shadow-xl rounded-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-blue-600 rounded-xl">
            <Bookmark className="w-8 h-8 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold mb-2">Smart Bookmark App</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8">
          Sign in to manage your private bookmarks in real-time.
        </p>
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium py-3 px-4 rounded-lg transition-all"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            className="w-5 h-5"
            alt="Google"
          />
          Continue with Google
        </button>
      </div>
    </div>
  );
}
