export default function RemedyDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-12">
        {/* Main content skeleton */}
        <div className="flex-1 space-y-8 animate-pulse">
          <div className="h-8 w-48 bg-surface-container-high rounded" />
          <div className="h-5 w-32 bg-surface-container-high rounded" />
          <div className="h-64 bg-surface-container-high rounded-xl" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-surface-container-high rounded" />
            <div className="h-4 w-full bg-surface-container-high rounded" />
            <div className="h-4 w-3/4 bg-surface-container-high rounded" />
          </div>
          <div className="h-6 w-40 bg-surface-container-high rounded" />
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <div className="h-8 w-8 bg-surface-container-high rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 bg-surface-container-high rounded" />
                  <div className="h-3 w-full bg-surface-container-high rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar skeleton */}
        <aside className="w-full lg:w-80 space-y-6 animate-pulse">
          <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
            <div className="h-5 w-32 bg-surface-container-high rounded" />
            <div className="h-4 w-full bg-surface-container-high rounded" />
            <div className="h-4 w-2/3 bg-surface-container-high rounded" />
          </div>
          <div className="bg-surface-container-low rounded-xl p-6 space-y-4">
            <div className="h-5 w-40 bg-surface-container-high rounded" />
            <div className="h-20 bg-surface-container-high rounded-lg" />
            <div className="h-20 bg-surface-container-high rounded-lg" />
          </div>
        </aside>
      </div>
    </div>
  );
}
