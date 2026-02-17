import { createClient } from '@/utils/supabase/server';
import AddBookmarkForm from '@/components/add-bookmark-form';
import BookmarkList from '@/components/bookmark-list';

export default async function Dashboard() {
  const supabase = await createClient();

  // Fetch initial bookmarks from server
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Your Bookmarks
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Save and organize your favorite links in real-time.
        </p>
      </header>

      <AddBookmarkForm />

      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-200">
          Live Feed
        </h2>
        <BookmarkList initialBookmarks={bookmarks || []} />
      </div>
    </div>
  );
}
