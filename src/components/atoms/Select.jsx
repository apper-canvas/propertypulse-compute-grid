import React from "react";
import { cn } from "@/utils/cn";

const Select = React.forwardRef(({ 
  className, 
  children, 
  error,
  ...props 
}, ref) => {
  const baseStyles = "block w-full rounded-md border-gray-300 shadow-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 focus:ring-1 transition-colors duration-200 bg-white";
  const errorStyles = error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "";

  return (
    <select
      className={cn(baseStyles, errorStyles, className)}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  );
});

Select.displayName = "Select";

export default Select;