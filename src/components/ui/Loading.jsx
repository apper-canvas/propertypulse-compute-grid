import React from "react";

const Loading = () => {
  return (
    <div className="flex-1 p-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-20 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="w-32 h-4 bg-gray-200 rounded animate-pulse" />
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
          <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Image Skeleton */}
            <div className="aspect-[4/3] bg-gray-200 shimmer" />
            
            {/* Content Skeleton */}
            <div className="p-6 space-y-4">
              {/* Price */}
              <div className="w-32 h-8 bg-gray-200 rounded animate-pulse" />
              
              {/* Address */}
              <div className="space-y-2">
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-3/4 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
              
              {/* Features */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-16 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-20 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
              
              {/* Description */}
              <div className="space-y-2">
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse" />
                <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse" />
              </div>
              
              {/* Tags */}
              <div className="flex gap-2">
                <div className="w-16 h-6 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse" />
                <div className="w-12 h-6 bg-gray-200 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;