export default function ConditionsLoading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="bg-surface-container-lowest border-b border-outline-variant/10 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-4">
          <div className="h-4 w-32 bg-surface-container-high rounded-full mx-auto animate-pulse" />
          <div className="h-10 w-80 bg-surface-container-high rounded-lg mx-auto animate-pulse" />
          <div className="h-5 w-96 max-w-full bg-surface-container-high rounded-lg mx-auto animate-pulse" />
        </div>
      </section>

      {/* Cards skeleton */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface-container-low rounded-xl p-6 space-y-4 animate-pulse"
            >
              <div className="h-40 bg-surface-container-high rounded-lg" />
              <div className="h-5 w-3/4 bg-surface-container-high rounded" />
              <div className="h-4 w-full bg-surface-container-high rounded" />
              <div className="h-4 w-2/3 bg-surface-container-high rounded" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
