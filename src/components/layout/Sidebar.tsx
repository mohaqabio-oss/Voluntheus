"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Award,
  Clock,
  BarChart3,
  Building2,
  Megaphone,
  ShieldCheck,
  Settings,
  HelpCircle,
  ChevronDown,
  X,
  ExternalLink,
  Layers,
  Inbox,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: "Core Platform",
    items: [
      { name: "Overview", href: "/", icon: LayoutDashboard },
      { name: "Task Inbox", href: "/inbox", icon: Inbox, badge: "14" },
      { name: "Initiatives", href: "/initiatives", icon: CalendarDays, badge: "8 Live" },
      { name: "Volunteers", href: "/volunteers", icon: Users, badge: "1.4k" },
      { name: "Skills & Matching", href: "/matching", icon: Layers },
      { name: "Hours & Attendance", href: "/hours", icon: Clock },
    ],
  },
  {
    title: "Analytics & Partners",
    items: [
      { name: "Impact Reports", href: "/reports", icon: BarChart3 },
      { name: "Partner NGOs", href: "/partners", icon: Building2 },
      { name: "Communications", href: "/communications", icon: Megaphone },
      { name: "Compliance & Waivers", href: "/compliance", icon: ShieldCheck },
    ],
  },
  {
    title: "System & Settings",
    items: [
      { name: "Certificates & Badges", href: "/awards", icon: Award },
      { name: "Organization Settings", href: "/settings", icon: Settings },
    ],
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close sidebar backdrop"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onClose();
            }
          }}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-0 lg:translate-x-0 max-lg:-translate-x-full"
        }`}
      >
        {/* Brand Header with Prominent Logo */}
        <div className="flex h-20 items-center justify-between border-b border-slate-100 px-6">
          <Link
            href="/"
            onClick={onClose}
            className="group flex items-center gap-3.5 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 rounded-lg p-1 -m-1 transition-colors"
          >
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-slate-200/70 p-1.5 shadow-xs transition-transform group-hover:scale-105">
              <Image
                src="/logo.png"
                alt="Voluntheus Logo"
                width={48}
                height={48}
                priority
                className="h-full w-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 transition-colors group-hover:text-blue-600">
                Voluntheus
              </span>
              <span className="text-xs font-medium text-slate-500 tracking-wide">
                Enterprise SaaS
              </span>
            </div>
          </Link>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900 lg:hidden focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
            aria-label="Close sidebar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Workspace Selector */}
        <div className="px-4 pt-4 pb-2">
          <button
            type="button"
            className="flex w-full items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50/70 px-3.5 py-2.5 text-left text-xs font-medium text-slate-700 hover:bg-slate-100/80 hover:border-slate-300 transition-all focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <div className="flex items-center gap-2.5 truncate">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-600 text-[10px] font-bold text-white uppercase">
                VH
              </div>
              <div className="truncate">
                <p className="font-semibold text-slate-900 truncate">Voluntheus Global</p>
                <p className="text-[10px] text-slate-500">Tier: Enterprise Multi-Region</p>
              </div>
            </div>
            <ChevronDown className="h-4 w-4 shrink-0 text-slate-400" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="custom-scrollbar flex-1 overflow-y-auto px-4 py-3">
          <nav className="space-y-6">
            {navSections.map((section) => (
              <div key={section.title}>
                <h3 className="px-3 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  {section.title}
                </h3>
                <ul className="mt-2 space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    const IconComponent = item.icon;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className={`group flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-all ${
                            isActive
                              ? "bg-blue-50 text-blue-700 shadow-xs"
                              : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent
                              className={`h-4.5 w-4.5 transition-colors ${
                                isActive
                                  ? "text-blue-600"
                                  : "text-slate-400 group-hover:text-slate-700"
                              }`}
                            />
                            <span>{item.name}</span>
                          </div>
                          {item.badge && (
                            <span
                              className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold tracking-wide ${
                                isActive
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-slate-100 text-slate-600 group-hover:bg-slate-200"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* Quota & Impact Progress Card */}
        <div className="p-4 border-t border-slate-100">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-900">
                Quarterly Target
              </span>
              <span className="text-xs font-semibold text-blue-600">74%</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              14,820 of 20,000 verified service hours logged
            </p>
            <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                style={{ width: "74%" }}
              />
            </div>
          </div>
        </div>

        {/* User Account / Footer */}
        <div className="border-t border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-xs font-semibold text-white">
                SJ
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-900">
                  Sarah Jenkins
                </p>
                <p className="truncate text-[11px] text-slate-500">
                  sarah.j@voluntheus.org
                </p>
              </div>
            </div>
            <Link
              href="/help"
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              title="Documentation & Support"
            >
              <HelpCircle className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
