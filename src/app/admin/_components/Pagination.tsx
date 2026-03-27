import Link from "next/link";

const PER_PAGE = 10;

export { PER_PAGE };

export default function Pagination({
  totalItems,
  currentPage,
  basePath,
  perPage = PER_PAGE,
}: {
  totalItems: number;
  currentPage: number;
  basePath: string;
  perPage?: number;
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / perPage));

  if (totalPages <= 1) {
    return (
      <div className="border-t border-white/10 bg-white/5 px-6 py-4">
        <p className="text-sm text-slate-400">
          Showing <span className="font-bold text-white">{totalItems}</span>{" "}
          item{totalItems !== 1 ? "s" : ""}
        </p>
      </div>
    );
  }

  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);

  const buildHref = (page: number) =>
    page <= 1 ? basePath : `${basePath}?page=${page}`;

  // Build page numbers to show
  const pages: (number | "ellipsis")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");
    const rangeStart = Math.max(2, currentPage - 1);
    const rangeEnd = Math.min(totalPages - 1, currentPage + 1);
    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
  }

  const btnBase =
    "flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors";
  const btnInactive =
    "border border-white/10 bg-transparent text-slate-400 hover:bg-white/10 hover:text-white";
  const btnActive = "bg-[#13ec37] text-[#102213] font-bold";
  const btnDisabled = "border border-white/10 bg-transparent text-slate-600 cursor-not-allowed";

  return (
    <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 bg-white/5 px-6 py-4 gap-3">
      <p className="text-sm text-slate-400">
        Showing{" "}
        <span className="font-bold text-white">
          {start}-{end}
        </span>{" "}
        of <span className="font-bold text-white">{totalItems}</span>
      </p>
      <div className="flex items-center gap-1.5">
        {/* Previous */}
        {currentPage > 1 ? (
          <Link href={buildHref(currentPage - 1)} className={`${btnBase} ${btnInactive}`}>
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </Link>
        ) : (
          <span className={`${btnBase} ${btnDisabled}`}>
            <span className="material-symbols-outlined text-[18px]">chevron_left</span>
          </span>
        )}

        {/* Page numbers */}
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span key={`e-${i}`} className="text-slate-500 px-1">...</span>
          ) : p === currentPage ? (
            <span key={p} className={`${btnBase} ${btnActive}`}>{p}</span>
          ) : (
            <Link key={p} href={buildHref(p)} className={`${btnBase} ${btnInactive}`}>
              {p}
            </Link>
          )
        )}

        {/* Next */}
        {currentPage < totalPages ? (
          <Link href={buildHref(currentPage + 1)} className={`${btnBase} ${btnInactive}`}>
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </Link>
        ) : (
          <span className={`${btnBase} ${btnDisabled}`}>
            <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </span>
        )}
      </div>
    </div>
  );
}
