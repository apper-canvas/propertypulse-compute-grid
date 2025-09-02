import React from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  hasNextPage, 
  hasPreviousPage 
}) => {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 7;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 4) {
        for (let i = 1; i <= 5; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center space-x-2 py-8">
      {/* Previous Button */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className="flex items-center gap-2"
      >
        <ApperIcon name="ChevronLeft" className="h-4 w-4" />
        Previous
      </Button>

      {/* Page Numbers */}
      <div className="flex items-center space-x-1">
        {getVisiblePages().map((page, index) => (
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
              ...
            </span>
          ) : (
            <Button
              key={page}
              variant={currentPage === page ? "primary" : "ghost"}
              size="sm"
              onClick={() => onPageChange(page)}
              className={`min-w-[40px] h-10 ${
                currentPage === page 
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white" 
                  : "text-gray-700 hover:text-gray-900"
              }`}
            >
              {page}
            </Button>
          )
        ))}
      </div>

      {/* Next Button */}
      <Button
        variant="secondary"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="flex items-center gap-2"
      >
        Next
        <ApperIcon name="ChevronRight" className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default Pagination;