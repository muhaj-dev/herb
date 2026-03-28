export default function RemediesLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="bg-surface-container-lowest border-b border-outline-variant/10 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="h-4 w-32 bg-surface-container-high rounded-full mx-auto animate-pulse" />
          <div className="h-10 w-72 bg-surface-container-high rounded-lg mx-auto animate-pulse" />
          <div className="h-5 w-96 max-w-full bg-surface-container-high rounded-lg mx-auto animate-pulse" />
        </div>
      </section>

      {/* Cards skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface-container-low rounded-xl overflow-hidden animate-pulse"
            >
              <div className="h-48 bg-surface-container-high" />
              <div className="p-5 space-y-3">
                <div className="h-5 w-3/4 bg-surface-container-high rounded" />
                <div className="h-3 w-1/2 bg-surface-container-high rounded" />
                <div className="h-4 w-full bg-surface-container-high rounded" />
                <div className="h-4 w-2/3 bg-surface-container-high rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
