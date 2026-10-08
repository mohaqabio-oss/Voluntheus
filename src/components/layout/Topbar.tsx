"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  Plus,
  ChevronRight,
  Sparkles,
  Command,
  CheckCircle2,
} from "lucide-react";

interface TopbarProps {
  onOpenSidebar: () => void;
}

export function Topbar({ onOpenSidebar }: TopbarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur-xs sm:px-6 lg:px-8">
      {/* Left: Mobile Toggle & Breadcrumbs */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={onOpenSidebar}
          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 lg:hidden focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
          aria-label="Open sidebar menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-slate-900 transition-colors">
            Voluntheus
          </Link>
          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-slate-900 font-semibold">Overview</span>
          <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 border border-emerald-200/60">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live Sync
          </span>
        </nav>
      </div>

      {/* Center: Global Search Bar */}
      <div className="flex flex-1 max-w-md mx-4 lg:mx-8">
        <div className="relative w-full">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search volunteers, initiatives, skills..."
            className="w-full rounded-lg border border-slate-200 bg-slate-50/70 py-1.5 pl-9 pr-12 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 transition-all"
          />
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden sm:flex items-center pr-2.5">
            <kbd className="inline-flex items-center gap-0.5 rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 shadow-2xs">
              <Command className="h-2.5 w-2.5" />
              <span>K</span>
            </kbd>
          </div>
        </div>
      </div>

      {/* Right: Actions, Notifications & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Quick Action Button */}
        <button
          type="button"
          className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 transition-colors"
        >
          <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
          <span>New Initiative</span>
        </button>

        {/* Notifications Button */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-slate-900 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 transition-colors"
          aria-label="View notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-orange-600 ring-2 ring-white" />
        </button>

        {/* Vertical Divider */}
        <div className="h-6 w-px bg-slate-200 hidden sm:block" />

        {/* Quick User Avatar */}
        <div className="flex items-center gap-2.5 pl-1">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-xs font-semibold text-white shadow-xs">
            SJ
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-semibold text-slate-900 leading-none">Sarah Jenkins</p>
            <p className="text-[10px] text-slate-500 mt-1 leading-none">Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
