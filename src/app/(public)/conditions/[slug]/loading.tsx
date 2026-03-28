export default function ConditionDetailLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-8 animate-pulse">
        {/* Hero area */}
        <div className="space-y-4">
          <div className="h-4 w-24 bg-surface-container-high rounded" />
          <div className="h-10 w-64 bg-surface-container-high rounded-lg" />
          <div className="h-5 w-96 max-w-full bg-surface-container-high rounded" />
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <div className="h-4 w-full bg-surface-container-high rounded" />
            <div className="h-4 w-full bg-surface-container-high rounded" />
            <div className="h-4 w-3/4 bg-surface-container-high rounded" />
            <div className="h-64 bg-surface-container-high rounded-xl mt-6" />
          </div>
          <div className="space-y-4">
            <div className="bg-surface-container-low rounded-xl p-6 space-y-3">
              <div className="h-5 w-32 bg-surface-container-high rounded" />
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-4 w-full bg-surface-container-high rounded" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
