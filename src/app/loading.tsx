export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      <div className="space-y-3">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded-md" />
        <div className="h-4 w-64 bg-slate-200 dark:bg-slate-800 rounded-md" />
      </div>

      <div className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded-xl" />

      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 bg-slate-100 dark:bg-slate-800/50 rounded-xl"
          />
        ))}
      </div>
    </div>
  );
}
