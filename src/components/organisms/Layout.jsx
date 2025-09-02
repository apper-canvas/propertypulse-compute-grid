import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";

const Layout = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();

  const handleSearch = (query) => {
    setSearchQuery(query);
    // This will be passed down to the pages that need it
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={handleSearch} searchQuery={searchQuery} />
      <main className="flex-1">
        {React.cloneElement(children, { searchQuery, onSearch: handleSearch })}
      </main>
    </div>
  );
};

export default Layout;