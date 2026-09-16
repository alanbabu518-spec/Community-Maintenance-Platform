function AnnouncementSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start gap-3">
        <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-slate-200" />

        <div className="flex-1">
          <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200" />

          <div className="mt-3 flex gap-2">
            <div className="h-6 w-20 animate-pulse rounded-full bg-slate-200" />
            <div className="h-6 w-24 animate-pulse rounded-full bg-slate-200" />
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-slate-200" />
      </div>

      <div className="mt-5 flex gap-5 border-t border-slate-100 pt-4">
        <div className="h-3 w-28 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  );
}

export default AnnouncementSkeleton;