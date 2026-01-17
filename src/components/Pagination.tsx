interface PaginationProps {
  currentPage: number;
  totalPages: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  total, 
  limit, 
  onPageChange, 
  isLoading = false 
}: PaginationProps) {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;
    const halfVisible = Math.floor(maxVisible / 2);
    
    let startPage = Math.max(1, currentPage - halfVisible);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage && !isLoading) {
      onPageChange(page);
    }
  };

  const getStartIndex = () => (currentPage - 1) * limit + 1;
  const getEndIndex = () => Math.min(currentPage * limit, total);

  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center gap-6 py-8">
      {/* Results Summary */}
      <div className="text-sm text-gray-600 dark:text-neutral-400">
        Showing <span className="font-semibold text-gray-900 dark:text-white">{getStartIndex()}</span> to{' '}
        <span className="font-semibold text-gray-900 dark:text-white">{getEndIndex()}</span> of{' '}
        <span className="font-semibold text-gray-900 dark:text-white">{total.toLocaleString()}</span> companies
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center gap-2">
        {/* Previous Button */}
        <button
          onClick={() => handlePageClick(currentPage - 1)}
          disabled={currentPage === 1 || isLoading}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
            currentPage === 1 || isLoading
              ? 'bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-neutral-600 cursor-not-allowed border border-gray-200 dark:border-neutral-700'
              : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 shadow-sm hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Previous</span>
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {/* First page if not visible */}
          {getVisiblePages()[0] > 1 && (
            <button
              onClick={() => handlePageClick(1)}
              disabled={isLoading}
              className="flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all duration-200 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              1
            </button>
          )}

          {/* Ellipsis before first visible page */}
          {getVisiblePages()[0] > 2 && (
            <span className="flex items-center justify-center w-10 h-10 text-gray-400 dark:text-neutral-600">
              ...
            </span>
          )}

          {/* Visible pages */}
          {getVisiblePages().map((pageNum) => (
            <button
              key={pageNum}
              onClick={() => handlePageClick(pageNum)}
              disabled={isLoading}
              className={`flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all duration-200 ${
                pageNum === currentPage
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md border-0 transform scale-105'
                  : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 shadow-sm hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              {pageNum}
            </button>
          ))}

          {/* Ellipsis after last visible page */}
          {getVisiblePages()[getVisiblePages().length - 1] < totalPages - 1 && (
            <span className="flex items-center justify-center w-10 h-10 text-gray-400 dark:text-neutral-600">
              ...
            </span>
          )}

          {/* Last page if not visible */}
          {getVisiblePages()[getVisiblePages().length - 1] < totalPages && (
            <button
              onClick={() => handlePageClick(totalPages)}
              disabled={isLoading}
              className="flex items-center justify-center w-10 h-10 rounded-lg font-medium transition-all duration-200 bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 shadow-sm hover:shadow-md hover:-translate-y-0.5"
            >
              {totalPages}
            </button>
          )}
        </div>

        {/* Next Button */}
        <button
          onClick={() => handlePageClick(currentPage + 1)}
          disabled={currentPage === totalPages || isLoading}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 ${
            currentPage === totalPages || isLoading
              ? 'bg-gray-100 dark:bg-neutral-800 text-gray-400 dark:text-neutral-600 cursor-not-allowed border border-gray-200 dark:border-neutral-700'
              : 'bg-white dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 border border-gray-200 dark:border-neutral-700 hover:border-gray-300 dark:hover:border-neutral-600 shadow-sm hover:shadow-md hover:-translate-y-0.5'
          }`}
        >
          <span>Next</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Jump to Page */}
      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-gray-600 dark:text-neutral-400">
          Jump to page:
        </label>
        <input
          type="number"
          min={1}
          max={totalPages}
          value={currentPage}
          onChange={(e) => {
            const page = parseInt(e.target.value);
            if (page >= 1 && page <= totalPages) {
              handlePageClick(page);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              const page = parseInt(e.currentTarget.value);
              if (page >= 1 && page <= totalPages) {
                handlePageClick(page);
                e.currentTarget.blur();
              }
            }
          }}
          className="w-20 px-3 py-2 text-sm rounded-lg bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
          placeholder="Page"
        />
        <button
          onClick={() => {
            const input = document.querySelector('input[placeholder="Page"]') as HTMLInputElement;
            const page = parseInt(input?.value || '0');
            if (page >= 1 && page <= totalPages) {
              handlePageClick(page);
              input.blur();
            }
          }}
          className="px-3 py-2 text-sm font-medium bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5"
        >
          Go
        </button>
      </div>
    </div>
  );
}