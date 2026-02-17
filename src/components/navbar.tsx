import { createClient } from '@/utils/supabase/server';
import { Bookmark, LogOut } from 'lucide-react';
import { signOut } from '@/app/auth/actions';

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-600 rounded-lg">
            <Bookmark className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg hidden sm:block">
            Smart Bookmark
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 pr-4 border-r border-slate-200 dark:border-slate-800">
            {user.user_metadata.avatar_url && (
              <img
                src={user.user_metadata.avatar_url}
                alt="Profile"
                className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700"
              />
            )}
            <span className="text-sm font-medium hidden md:block">
              {user.user_metadata.full_name || user.email}
            </span>
          </div>

          <form action={signOut}>
            <button
              type="submit"
              className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}
