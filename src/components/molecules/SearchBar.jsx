import React, { useState } from "react";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const SearchBar = ({ onSearch, placeholder = "Search by location, address, or property features..." }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    // Real-time search as user types
    onSearch(value);
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-2xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <ApperIcon name="Search" className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className="pl-10 pr-24 h-12 text-base border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 rounded-xl shadow-sm"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-2">
          <Button
            type="submit"
            size="sm"
            className="rounded-lg px-4 py-2 h-8"
          >
            Search
          </Button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;