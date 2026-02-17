import AddBookmarkForm from '@/components/add-bookmark-form';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Your Bookmarks</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Save and organize your favorite links.
        </p>
      </header>

      <AddBookmarkForm />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Live Feed</h2>
        {/* Phase 7 will inject the Real-time List here */}
      </div>
    </div>
  );
}
