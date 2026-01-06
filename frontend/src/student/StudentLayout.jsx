// import { Outlet } from "react-router-dom";
// import { useState } from "react";
// import Sidebar from "./components/layout/Sidebar.jsx";
// import Header from "./components/layout/Header.jsx";

// const StudentLayout = () => {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="min-h-screen bg-gray-100 flex overflow-hidden">
      
//       {/* Mobile Overlay */}
//       {sidebarOpen && (
//         <div
//           onClick={() => setSidebarOpen(false)}
//           className="fixed inset-0 bg-black/40 z-30 md:hidden"
//         />
//       )}

//       {/* Sidebar */}
//       <aside
//         className={`
//           fixed md:static z-40
//           transform transition-transform duration-300 ease-in-out
//           ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
//           md:translate-x-0
//         `}
//       >
//         <Sidebar
//           sidebarOpen={sidebarOpen}
//           setSidebarOpen={setSidebarOpen}
//         />
//       </aside>

//       {/* Main Content */}
//       <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
//         <Header setSidebarOpen={setSidebarOpen} />

//         <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-5 md:p-6">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default StudentLayout;



import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex overflow-hidden">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static z-40
          w-64 h-screen
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <Sidebar setSidebarOpen={setSidebarOpen} />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-64 min-h-screen">
        <Header setSidebarOpen={setSidebarOpen} />

        <main className="flex-1 w-full max-w-[1600px] mx-auto p-4 sm:p-5 md:p-6">
          <Outlet />
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default StudentLayout;
