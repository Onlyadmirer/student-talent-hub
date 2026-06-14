import type { ReactNode } from "react";
import TopNav from "./TopNav.tsx";
import Sidebar from "./Sidebar.tsx";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-[240px_1fr] grid-rows-[70px_1fr] h-screen overflow-hidden bg-bg-page max-md:grid-cols-1 max-md:grid-rows-[70px_1fr]">
      <div className="col-span-2 max-md:col-span-1">
        <TopNav />
      </div>
      <Sidebar />
      <main className="col-start-2 row-start-2 p-10 overflow-y-auto max-md:col-start-1 max-md:p-5">
        {children}
      </main>
    </div>
  );
}
