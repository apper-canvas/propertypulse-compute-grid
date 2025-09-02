import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import BrowsePage from "@/components/pages/BrowsePage";
import PropertyDetailPage from "@/components/pages/PropertyDetailPage";
import MapViewPage from "@/components/pages/MapViewPage";
import SavedPage from "@/components/pages/SavedPage";
import ContactPage from "@/components/pages/ContactPage";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Layout>
          <Routes>
            <Route path="/" element={<BrowsePage />} />
            <Route path="/browse" element={<BrowsePage />} />
            <Route path="/property/:id" element={<PropertyDetailPage />} />
            <Route path="/map" element={<MapViewPage />} />
            <Route path="/saved" element={<SavedPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Layout>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          style={{ zIndex: 9999 }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;