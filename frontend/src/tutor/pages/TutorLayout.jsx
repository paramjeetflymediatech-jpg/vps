import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { LayoutDashboard, BookOpen, Settings, LogOut, Menu, GraduationCap, X } from "lucide-react";
import { useState } from "react";

const TutorLayout = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("tutorToken");
    localStorage.removeItem("user");
    navigate("/tutor/login");
  };

  // Active Link Styling
  const activeLink = "flex items-center gap-3 px-4 py-3 rounded bg-white text-[#0852A1] font-semibold transition-all shadow-sm";
  const normalLink = "flex items-center gap-3 px-4 py-3 rounded text-white hover:bg-white/10 transition-all";

  return (
    <div className="flex min-h-screen bg-gray-50">
      
      {/* MOBILE OVERLAY - Jab sidebar khulega to piche ka screen dark ho jayega */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-50 w-64 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white 
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 flex flex-col
      `}>
        {/* Logo & Close Button (Mobile) */}
        <div className="p-6 flex justify-between items-center border-b border-white/10">
          <img src="/logo.png" alt="Logo" className="w-32" />
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 space-y-2 mt-4">
          <NavLink to="/tutor/dashboard" onClick={() => setSidebarOpen(false)} className={({ isActive }) => isActive ? activeLink : normalLink}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          
          <NavLink to="/tutor/courses" onClick={() => setSidebarOpen(false)} className={({ isActive }) => isActive ? activeLink : normalLink}>
            <GraduationCap size={20} /> Courses
          </NavLink>
          
          <NavLink to="/tutor/classes" onClick={() => setSidebarOpen(false)} className={({ isActive }) => isActive ? activeLink : normalLink}>
            <BookOpen size={20} /> Classes
          </NavLink>
          
          <NavLink to="/tutor/settings" onClick={() => setSidebarOpen(false)} className={({ isActive }) => isActive ? activeLink : normalLink}>
            <Settings size={20} /> Settings
          </NavLink>
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* TOPBAR */}
        <header className="bg-white shadow-sm border-b px-4 md:px-6 py-3 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-lg md:text-xl font-bold text-gray-800 truncate">Tutor Panel</h1>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden sm:flex flex-col items-end">
              <span className="text-sm font-semibold text-gray-700 leading-none">John Doe</span>
              <span className="text-xs text-gray-500">Tutor</span>
            </div>
            <img
              src="https://i.pravatar.cc/40"
              alt="Profile"
              className="w-9 h-9 md:w-10 md:h-10 rounded-full border-2 border-[#0852A1]/20"
            />

            <div className="h-6 w-[1px] bg-gray-300 mx-1 hidden sm:block"></div>

            <button
              onClick={handleLogout}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-1"
              title="Logout"
            >
              <LogOut size={20} />
              <span className="hidden lg:block text-sm font-medium">Logout</span>
            </button>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
             <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default TutorLayout;