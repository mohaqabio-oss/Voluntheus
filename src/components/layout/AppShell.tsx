"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const isInbox = pathname?.startsWith("/inbox");

  // Close sidebar on escape key press
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sidebarOpen]);

  // Prevent background scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  return (
    <div className={`flex bg-slate-50/50 ${isInbox ? "h-screen overflow-hidden" : "min-h-screen"}`}>
      {/* Sidebar (Desktop static sticky, Mobile slide-over drawer) */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className={`flex flex-1 flex-col min-w-0 ${isInbox ? "h-screen overflow-hidden" : "overflow-hidden"}`}>
        {/* Topbar */}
        <Topbar onOpenSidebar={() => setSidebarOpen(true)} />

        {/* Page Content */}
        {isInbox ? (
          <main className="flex-1 min-h-0 overflow-hidden flex flex-col p-0">
            {children}
          </main>
        ) : (
          <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        )}
      </div>
    </div>
  );
}
