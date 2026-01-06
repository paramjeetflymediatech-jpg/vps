import { Outlet } from "react-router-dom";
import { useState } from "react";
import Header from "./components/layout/Header";
import Sidebar from "./components/layout/Sidebar";
import Footer from "./components/layout/Footer";

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      
      {/* MOBILE OVERLAY: Sidebar ke piche ka dhundla parda */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR: Passes states for mobile toggling */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* MAIN CONTENT AREA */}
      <div className="flex flex-col flex-1 md:ml-72 transition-all duration-300">
        
        {/* HEADER: Passing setSidebarOpen to the menu button */}
        <Header setSidebarOpen={setSidebarOpen} />
        
        {/* SCROLLABLE CONTENT */}
        <main className="flex-1 p-4 md:p-8 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </main>

        {/* FOOTER: Layout ke bottom mein hamesha rahega */}
        <Footer />
      </div>
    </div>
  );
};

export default StudentLayout;