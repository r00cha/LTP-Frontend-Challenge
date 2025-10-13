import { motion } from "motion/react";
import { getVisiblePages } from "~/utils/pagination";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const visiblePages = getVisiblePages(currentPage, totalPages);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  // Don't render pagination if there's only one page or no pages
  if (totalPages <= 1) {
    return null;
  }

  return (
    <motion.nav
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="flex items-center justify-center gap-2 pb-3 w-full flex-wrap"
      role="navigation"
      aria-label="Pagination"
    >
      {/* Previous Button */}
      <motion.button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="group flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-slate-300 bg-white hover:border-brand hover:bg-brand/5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-300 disabled:hover:bg-white"
        whileHover={currentPage !== 1 ? { scale: 1.05 } : undefined}
        whileTap={currentPage !== 1 ? { scale: 0.95 } : undefined}
        aria-label="Previous page"
      >
        <svg
          className="h-5 w-5 text-slate-600 group-hover:text-brand transition-colors duration-200 group-disabled:text-slate-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </motion.button>

      {/* Page Numbers - Fixed width layout */}
      <div className="flex items-center gap-2">
        {visiblePages.map((page, index) => {
          const isActive = page === currentPage;

          return (
            <motion.button
              key={`${page}-${index}`}
              onClick={() => handlePageClick(page)}
              className={`
                relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg font-semibold text-sm transition-all duration-200
                ${
                  isActive
                    ? "bg-brand text-white shadow-md"
                    : "bg-white text-slate-700 border border-slate-300 hover:border-brand hover:bg-brand/5 hover:text-brand"
                }
              `}
              whileHover={!isActive ? { scale: 1.05 } : undefined}
              whileTap={!isActive ? { scale: 0.95 } : undefined}
              initial={false}
              animate={{
                scale: isActive ? [1, 1.1, 1] : 1,
              }}
              transition={
                isActive
                  ? { duration: 0.3, ease: "easeInOut" }
                  : { duration: 0.2 }
              }
              aria-label={`Page ${page}`}
              aria-current={isActive ? "page" : undefined}
            >
              {page}
              {isActive && (
                <motion.div
                  layoutId="activePage"
                  className="absolute inset-0 bg-brand rounded-lg -z-10"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Next Button */}
      <motion.button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="group flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-slate-300 bg-white hover:border-brand hover:bg-brand/5 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-slate-300 disabled:hover:bg-white"
        whileHover={currentPage !== totalPages ? { scale: 1.05 } : undefined}
        whileTap={currentPage !== totalPages ? { scale: 0.95 } : undefined}
        aria-label="Next page"
      >
        <svg
          className="h-5 w-5 text-slate-600 group-hover:text-brand transition-colors duration-200 group-disabled:text-slate-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </motion.button>
    </motion.nav>
  );
}
