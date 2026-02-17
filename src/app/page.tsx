import { createClient } from '@/utils/supabase/server'
import AddBookmarkForm from "@/components/add-bookmark-form";
import BookmarkList from "@/components/bookmark-list";
import Link from 'next/link';
import { LogIn } from 'lucide-react';

export default async function Dashboard() {
  const supabase = await createClient()
  
  // Check if user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  // Fetch initial bookmarks from server
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white mb-2">
            Your Bookmarks
          </h1>
          <p className="text-slate-500 font-medium">
            Secure, real-time link management.
          </p>
        </div>

        {/* Show Login Button ONLY if user is not logged in */}
        {!user && (
          <Link 
            href="/login"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-500/20 active:scale-95 w-fit"
          >
            <LogIn className="w-5 h-5" />
            Sign In to Start
          </Link>
        )}
      </header>
      
      {user ? (
        <>
          <AddBookmarkForm />
          
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="h-px flex-1 bg-white/5" />
              <h2 className="text-xs font-black text-slate-600 uppercase tracking-[0.2em]">
                Live Feed
              </h2>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <BookmarkList initialBookmarks={bookmarks || []} />
          </div>
        </>
      ) : (
        <div className="py-20 text-center bg-slate-900/20 border border-dashed border-white/5 rounded-3xl">
          <p className="text-slate-500 font-medium">Please log in to view and manage your bookmarks.</p>
        </div>
      )}
    </div>
  )
}