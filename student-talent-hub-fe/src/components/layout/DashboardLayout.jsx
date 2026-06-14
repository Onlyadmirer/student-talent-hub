import { useState } from "react";
import { Outlet, useNavigate } from "react-router";
import Header from "./Header";
import Sidebar from "./Sidebar";

const DUMMY_USER = {
  name: "John Doe",
  role: "student",
  email: "john@example.com",
};

export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user] = useState(DUMMY_USER);
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/login");
  };

  return (
    <div className='min-h-screen bg-[#f8fafc] font-sans flex flex-col'>
      <Header
        user={user}
        onLogout={handleLogout}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
      />
      <div className='flex flex-1 relative'>
        <Sidebar
          user={user}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className='flex-1 lg:ml-64 p-8'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
