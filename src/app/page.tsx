import React from "react";
import Link from "next/link";
import {
  Users,
  Clock,
  Target,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock4,
  AlertCircle,
  ChevronRight,
  Filter,
  Download,
  Building,
  Sparkles,
} from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  timeframe: string;
  icon: React.ComponentType<{ className?: string }>;
}

function MetricCard({
  title,
  value,
  change,
  isPositive,
  timeframe,
  icon: Icon,
}: MetricCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs transition-shadow hover:shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-50 border border-slate-100 text-slate-700">
          <Icon className="h-4.5 w-4.5 text-blue-600" />
        </div>
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-xs">
          <span
            className={`inline-flex items-center font-semibold ${
              isPositive ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="mr-0.5 h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="mr-0.5 h-3.5 w-3.5" />
            )}
            {change}
          </span>
          <span className="text-slate-400">{timeframe}</span>
        </div>
      </div>
    </div>
  );
}

const recentDeployments = [
  {
    id: "DEP-8021",
    volunteer: "Marcus Sterling",
    email: "marcus.s@voluntheus.net",
    role: "Lead Field Coordinator",
    initiative: "Emergency Food Relief Network",
    location: "Metro District 4",
    hours: "6.5 hrs",
    status: "Verified",
    date: "Today, 14:20",
  },
  {
    id: "DEP-8020",
    volunteer: "Elena Rostova",
    email: "elena.r@voluntheus.net",
    role: "Medical Logistics Aid",
    initiative: "Mobile Health Clinic Outreach",
    location: "North Bay Center",
    hours: "4.0 hrs",
    status: "Verified",
    date: "Today, 11:45",
  },
  {
    id: "DEP-8019",
    volunteer: "David Kim",
    email: "d.kim@voluntheus.net",
    role: "Digital Literacy Tutor",
    initiative: "Senior Tech Empowerment",
    location: "Civic Library East",
    hours: "3.5 hrs",
    status: "Pending Review",
    date: "Yesterday",
  },
  {
    id: "DEP-8018",
    volunteer: "Amara Okonjo",
    email: "amara.o@voluntheus.net",
    role: "Youth Mentor",
    initiative: "STEM Career Pathways",
    location: "Community Hub 2",
    hours: "5.0 hrs",
    status: "Verified",
    date: "Yesterday",
  },
  {
    id: "DEP-8017",
    volunteer: "Julian Vance",
    email: "j.vance@voluntheus.net",
    role: "Shelter Support Staff",
    initiative: "Winter Haven Relief",
    location: "Downtown Annex",
    hours: "8.0 hrs",
    status: "In Progress",
    date: "Oct 6, 2026",
  },
];

const activeInitiatives = [
  {
    title: "Metro Clean Water & Environmental Defense",
    category: "Ecological Action",
    volunteersCount: 142,
    targetCount: 160,
    progress: 88,
    leadPartner: "Alliance for Urban Cleanliness",
    status: "High Priority",
  },
  {
    title: "Youth STEM & Coding Apprenticeship",
    category: "Education & Skills",
    volunteersCount: 78,
    targetCount: 80,
    progress: 97,
    leadPartner: "NextGen Digital Labs",
    status: "Active",
  },
  {
    title: "Community Crisis Nutrition Logistics",
    category: "Hunger Relief",
    volunteersCount: 215,
    targetCount: 300,
    progress: 71,
    leadPartner: "Regional Food Coalition",
    status: "Active",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Operations & Impact Hub
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Real-time telemetry, volunteer orchestration, and community performance metrics.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <Filter className="h-3.5 w-3.5 text-slate-500" />
            <span>Filter</span>
          </button>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>Export Report</span>
          </button>
          <Link
            href="/initiatives"
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 transition-colors"
          >
            <span>Launch Initiative</span>
          </Link>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Volunteers"
          value="1,428"
          change="+14.2%"
          isPositive={true}
          timeframe="vs. last month"
          icon={Users}
        />
        <MetricCard
          title="Verified Hours"
          value="18,940"
          change="+22.8%"
          isPositive={true}
          timeframe="vs. last month"
          icon={Clock}
        />
        <MetricCard
          title="Active Initiatives"
          value="34"
          change="+6 new"
          isPositive={true}
          timeframe="this quarter"
          icon={Target}
        />
        <MetricCard
          title="Retention Rate"
          value="91.4%"
          change="+2.1%"
          isPositive={true}
          timeframe="annual rolling"
          icon={TrendingUp}
        />
      </div>

      {/* Main Grid: Initiatives & Deployments */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Active Initiatives Showcase (1 col on desktop) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs lg:col-span-1">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Key Initiatives
              </h2>
              <p className="text-xs text-slate-500">Live operational targets</p>
            </div>
            <Link
              href="/initiatives"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View all</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 space-y-4">
            {activeInitiatives.map((item) => (
              <div
                key={item.title}
                className="rounded-lg border border-slate-100 bg-slate-50/60 p-3.5 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-xs font-semibold text-slate-900 line-clamp-1">
                    {item.title}
                  </h3>
                  <span className="inline-flex shrink-0 items-center rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">
                    {item.category}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {item.volunteersCount} / {item.targetCount} volunteers
                  </span>
                  <span className="font-semibold text-slate-700">
                    {item.progress}%
                  </span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
                <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="truncate">{item.leadPartner}</span>
                  <span className="font-medium text-slate-600">
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Deployments Table (2 cols on desktop) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs lg:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Recent Volunteer Activity
              </h2>
              <p className="text-xs text-slate-500">
                Logged attendance and verification audit logs
              </p>
            </div>
            <Link
              href="/hours"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>Audit logs</span>
              <ChevronRight className="h-3 w-3" />
            </Link>
          </div>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  <th className="py-2.5 pr-4">Volunteer</th>
                  <th className="py-2.5 px-4">Initiative</th>
                  <th className="py-2.5 px-4">Hours</th>
                  <th className="py-2.5 px-4">Status</th>
                  <th className="py-2.5 pl-4 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {recentDeployments.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 pr-4">
                      <div className="font-semibold text-slate-900">
                        {row.volunteer}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {row.role}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800 line-clamp-1">
                        {row.initiative}
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span>{row.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {row.hours}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                          row.status === "Verified"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/50"
                            : row.status === "Pending Review"
                            ? "bg-amber-50 text-amber-700 border border-amber-200/50"
                            : "bg-blue-50 text-blue-700 border border-blue-200/50"
                        }`}
                      >
                        {row.status === "Verified" && (
                          <CheckCircle2 className="h-3 w-3" />
                        )}
                        {row.status === "Pending Review" && (
                          <Clock4 className="h-3 w-3" />
                        )}
                        {row.status === "In Progress" && (
                          <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />
                        )}
                        {row.status}
                      </span>
                    </td>
                    <td className="py-3 pl-4 text-right text-slate-400">
                      {row.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
