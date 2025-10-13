export const PAGE_SIZE = 9;


export type PaginationResult = {
  currentPage: number;
  totalPages: number;
  firstProductNumber: number;
  lastProductNumber: number;
};

export function calculatePagination(
  total: number,
  page: number,
  pageSize: number = PAGE_SIZE
): PaginationResult {

  const currentPage = Math.max(page, 1);
  const skip = (currentPage - 1) * pageSize;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const firstProductNumber = total === 0 ? 0 : skip + 1;
  const lastProductNumber = total === 0 ? 0 : Math.min(currentPage * pageSize, total);

  return {
    currentPage,
    totalPages,
    firstProductNumber,
    lastProductNumber,
  };
}

export function getVisiblePages(
  currentPage: number,
  totalPages: number
): number[] {
  // If 5 or fewer pages, show all
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: number[] = [];

  // Pattern: [First] [Before] [Current] [Next] [Last]
  // Always show first page
  pages.push(1);

  // On first or second page: 1, 2, 3, 4, total
  if (currentPage === 1 || currentPage === 2)  {
    pages.push(2);
    pages.push(3);
    pages.push(4);

  // On last page: 1, total-3, total-2, total-1, total
  } else if (currentPage === totalPages || currentPage === totalPages - 1) {
    pages.push(totalPages - 3);
    pages.push(totalPages - 2);
    pages.push(totalPages - 1);
 
  // Middle pages: 1, current-1, current, current+1, total
  } else {
    pages.push(currentPage - 1);
    pages.push(currentPage);
    pages.push(currentPage + 1);
  }

  // Always show last page
  pages.push(totalPages);

  return pages;
}
