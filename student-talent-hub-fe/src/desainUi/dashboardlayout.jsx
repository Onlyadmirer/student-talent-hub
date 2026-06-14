import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function DashboardLayout() {
  return (
    <div className='min-h-screen bg-[#f8fafc] font-sans flex flex-col'>
      <Header />
      <div className='flex flex-1 relative'>
        <Sidebar />
        {/* Main Content Area - digeser margin-left 64 (w-64 dari sidebar) */}
        <main className='flex-1 ml-64 p-8'>
          <Outlet />{" "}
          {/* Halaman seperti Dashboard.jsx akan di-render di sini */}
        </main>
      </div>
    </div>
  );
}
