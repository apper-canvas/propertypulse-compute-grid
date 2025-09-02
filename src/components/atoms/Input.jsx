import React from "react";
import { cn } from "@/utils/cn";

const Input = React.forwardRef(({ 
  className, 
  type = "text", 
  error,
  ...props 
}, ref) => {
  const baseStyles = "block w-full rounded-md border-gray-300 shadow-sm text-gray-900 placeholder-gray-500 focus:border-primary-500 focus:ring-primary-500 focus:ring-1 transition-colors duration-200";
  const errorStyles = error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "";

  return (
    <input
      type={type}
      className={cn(baseStyles, errorStyles, className)}
      ref={ref}
      {...props}
    />
  );
});

Input.displayName = "Input";

export default Input;