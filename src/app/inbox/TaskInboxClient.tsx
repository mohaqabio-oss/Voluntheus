"use client";

import React, { useState, useMemo, useTransition } from "react";
import {
  Inbox,
  PlayCircle,
  Clock4,
  CheckCircle2,
  AlertTriangle,
  Search,
  Calendar,
  Clock,
  Building2,
  CheckSquare,
  Square,
  Send,
  Paperclip,
  Share2,
  ArrowLeft,
  Shield,
  UploadCloud,
  FileText,
} from "lucide-react";
import { updateTaskStatus, toggleChecklistItem, addComment } from "@/actions/tasks";

type FilterType = "inbox" | "active" | "review" | "completed" | "late";
type PriorityType = "High" | "Med" | "Low";

interface CommentItem {
  id: string;
  author: string;
  role: string;
  initials: string;
  timestamp: string;
  content: string;
  isSystem?: boolean;
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

interface TaskItem {
  id: string;
  title: string;
  organization: string;
  category: string;
  priority: string;
  filter: string;
  dueDate: string;
  dueTime: string;
  isOverdue: boolean;
  assignedHours: number;
  location: string;
  coordinator: {
    name: string;
    role: string;
    email: string;
    initials: string;
  };
  description: string;
  requirements: string[];
  checklist: ChecklistItem[];
  comments: CommentItem[];
  actionLabel: string;
}

const filterConfig: {
  id: FilterType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badgeColor: string;
}[] = [
  { id: "inbox", label: "Inbox", icon: Inbox, badgeColor: "bg-slate-100 text-slate-700" },
  { id: "active", label: "Active", icon: PlayCircle, badgeColor: "bg-blue-100 text-blue-700" },
  { id: "review", label: "In Review", icon: Clock4, badgeColor: "bg-amber-100 text-amber-700" },
  { id: "completed", label: "Completed", icon: CheckCircle2, badgeColor: "bg-emerald-100 text-emerald-700" },
  { id: "late", label: "Late", icon: AlertTriangle, badgeColor: "bg-rose-100 text-rose-700" },
];

export default function TaskInboxClient({ initialTasks }: { initialTasks: TaskItem[] }) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(initialTasks[0]?.id || null);
  const [mobileDetailOpen, setMobileDetailOpen] = useState(false);
  const [commentInput, setCommentInput] = useState("");
  const [isPending, startTransition] = useTransition();

  // Tasks come from server via props (they might be updated by Server Actions which triggers a re-render)
  const tasksState = initialTasks;

  // Counts for each filter
  const filterCounts = useMemo(() => {
    const counts: Record<FilterType, number> = {
      inbox: 0,
      active: 0,
      review: 0,
      completed: 0,
      late: 0,
    };
    tasksState.forEach((task) => {
      if (counts[task.filter as FilterType] !== undefined) {
        counts[task.filter as FilterType]++;
      }
    });
    return counts;
  }, [tasksState]);

  // Filtered tasks for middle pane
  const filteredTasks = useMemo(() => {
    return tasksState.filter((task) => {
      const matchesFilter = task.filter === activeFilter;
      const matchesSearch =
        searchQuery === "" ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.organization.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesPriority =
        priorityFilter === "all" || task.priority.toLowerCase() === priorityFilter.toLowerCase();
      return matchesFilter && matchesSearch && matchesPriority;
    });
  }, [tasksState, activeFilter, searchQuery, priorityFilter]);

  // Selected task object
  const selectedTask = useMemo(() => {
    const found = tasksState.find((t) => t.id === selectedTaskId);
    if (found) return found;
    return filteredTasks[0] || tasksState[0];
  }, [tasksState, selectedTaskId, filteredTasks]);

  // Handle Action Button
  const handleActionClick = () => {
    if (!selectedTask) return;
    
    startTransition(async () => {
      let newStatus = selectedTask.filter;
      if (selectedTask.filter === "inbox") newStatus = "active";
      else if (selectedTask.filter === "active") newStatus = "review";
      else if (selectedTask.filter === "review") newStatus = "completed";
      
      if (newStatus !== selectedTask.filter) {
        await updateTaskStatus(selectedTask.id, newStatus);
      }
    });
  };

  // Toggle checklist item
  const handleToggleChecklist = (taskId: string, checkId: string, currentStatus: boolean) => {
    startTransition(async () => {
      await toggleChecklistItem(taskId, checkId, !currentStatus);
    });
  };

  // Add comment to task
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim() || !selectedTask) return;
    
    const content = commentInput.trim();
    setCommentInput(""); // optimistic clear
    
    startTransition(async () => {
      await addComment(selectedTask.id, content);
    });
  };

  return (
    <div className="flex h-full w-full min-h-0 flex-1 overflow-hidden bg-white">
      {/* =========================================================================
          LEFT PANE: FILTERS (Narrow navigation)
          ========================================================================= */}
      <aside className="hidden md:flex w-56 lg:w-60 shrink-0 flex-col border-r border-slate-200 bg-slate-50/60 p-3">
        {/* Header */}
        <div className="px-2 pt-1 pb-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Task Queues
            </h2>
            <span className="text-[11px] font-semibold text-slate-400">
              {tasksState.length} Total
            </span>
          </div>
        </div>

        {/* Primary Filter Tabs */}
        <nav className="space-y-1">
          {filterConfig.map((item) => {
            const Icon = item.icon;
            const isActive = activeFilter === item.id;
            const count = filterCounts[item.id] || 0;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveFilter(item.id);
                  const firstOfFilter = tasksState.find((t) => t.filter === item.id);
                  if (firstOfFilter) setSelectedTaskId(firstOfFilter.id);
                }}
                className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                  isActive
                    ? "bg-white text-blue-700 shadow-2xs font-semibold border border-slate-200/80"
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? "text-blue-600" : "text-slate-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                <span
                  className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                    isActive ? "bg-blue-50 text-blue-700" : item.badgeColor
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Priority Filter Section */}
        <div className="mt-6 border-t border-slate-200/80 pt-4 px-2">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Priority Filter
          </h3>
          <div className="mt-2 space-y-1">
            {[
              { id: "all", label: "All Priorities" },
              { id: "high", label: "High Priority" },
              { id: "med", label: "Medium Priority" },
              { id: "low", label: "Low Priority" },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPriorityFilter(p.id)}
                className={`flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-xs transition-colors ${
                  priorityFilter === p.id
                    ? "bg-blue-50/80 text-blue-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span>{p.label}</span>
                {priorityFilter === p.id && (
                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Impact Hours Indicator Card */}
        <div className="mt-auto pt-4 border-t border-slate-200/80">
          <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Committed Work</span>
              <span className="font-bold text-blue-600">33.5 hrs</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Verified volunteer service allocation
            </p>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MIDDLE PANE: TASK LIST (Scrollable, subtle borders)
          ========================================================================= */}
      <section
        className={`w-full md:w-80 lg:w-[380px] shrink-0 border-r border-slate-200 bg-white flex flex-col min-h-0 ${
          mobileDetailOpen ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Header & Search */}
        <div className="border-b border-slate-200 bg-white p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-900 capitalize">
                {activeFilter}
              </h1>
              <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600">
                {filteredTasks.length}
              </span>
            </div>

            {/* Mobile Filter Pill Dropdown */}
            <div className="md:hidden flex items-center gap-1">
              {filterConfig.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveFilter(item.id)}
                  className={`px-2 py-1 text-[11px] font-semibold rounded ${
                    activeFilter === item.id
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Search Box */}
          <div className="relative w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
              <Search className="h-3.5 w-3.5" />
            </div>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, NGOs, topics..."
              className="w-full rounded-lg border border-slate-200 bg-slate-50/80 py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-blue-600 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-blue-600/20 transition-all"
            />
          </div>
        </div>

        {/* Scrollable Task List Cards */}
        <div className="custom-scrollbar flex-1 overflow-y-auto divide-y divide-slate-100">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 p-6 text-center text-slate-400">
              <CheckSquare className="h-8 w-8 text-slate-300 stroke-[1.5]" />
              <p className="mt-2 text-xs font-semibold text-slate-700">
                No tasks match filter
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Try switching queue views or clearing search criteria.
              </p>
            </div>
          ) : (
            filteredTasks.map((task) => {
              const isSelected = selectedTask?.id === task.id;

              return (
                <article
                  key={task.id}
                  onClick={() => {
                    setSelectedTaskId(task.id);
                    setMobileDetailOpen(true);
                  }}
                  className={`group relative cursor-pointer p-4 transition-all text-left ${
                    isSelected
                      ? "bg-blue-50/50 border-l-3 border-l-blue-600"
                      : "hover:bg-slate-50/80 border-l-3 border-l-transparent"
                  }`}
                >
                  {/* Top Row: Organization & Priority */}
                  <div className="flex items-center justify-between gap-2">
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 truncate">
                      <Building2 className="h-3 w-3 shrink-0 text-slate-400" />
                      <span className="truncate">{task.organization}</span>
                    </span>

                    <span
                      className={`inline-flex shrink-0 items-center rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                        task.priority === "High"
                          ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                          : task.priority === "Med"
                          ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                          : "bg-slate-100 text-slate-700 border border-slate-200/60"
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className={`mt-2 text-xs font-semibold tracking-tight line-clamp-2 ${
                      isSelected
                        ? "text-blue-950 font-bold"
                        : "text-slate-900 group-hover:text-blue-600"
                    }`}
                  >
                    {task.title}
                  </h3>

                  {/* Description snippet */}
                  <p className="mt-1 text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>

                  {/* Bottom Meta Row */}
                  <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                    <span
                      className={`flex items-center gap-1 font-medium ${
                        task.isOverdue
                          ? "text-rose-600 font-semibold"
                          : "text-slate-500"
                      }`}
                    >
                      <Calendar className="h-3 w-3" />
                      <span>{task.dueDate}</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="h-3 w-3 text-slate-400" />
                        <span>{task.assignedHours} hrs</span>
                      </span>

                      {task.comments.length > 0 && (
                        <span className="text-[10px] font-medium text-slate-400">
                          {task.comments.length} updates
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      {/* =========================================================================
          RIGHT PANE: DETAIL VIEW (Large pane, scrollable, action buttons)
          ========================================================================= */}
      <main
        className={`flex-1 min-w-0 bg-slate-50/40 flex flex-col min-h-0 overflow-y-auto custom-scrollbar ${
          mobileDetailOpen ? "flex" : "hidden md:flex"
        }`}
      >
        {selectedTask ? (
          <div className="mx-auto w-full max-w-4xl p-4 sm:p-6 lg:p-8 space-y-6">
            {/* Top Action Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-2">
                {/* Back button on mobile */}
                <button
                  type="button"
                  onClick={() => setMobileDetailOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 md:hidden"
                  aria-label="Back to task list"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>

                <span className="text-xs font-mono font-semibold text-slate-500">
                  {selectedTask.id}
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
                  {selectedTask.category}
                </span>
                <span
                  className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-bold ${
                    selectedTask.priority === "High"
                      ? "bg-rose-50 text-rose-700 border border-rose-200/60"
                      : selectedTask.priority === "Med"
                      ? "bg-amber-50 text-amber-700 border border-amber-200/60"
                      : "bg-slate-100 text-slate-700 border border-slate-200/60"
                  }`}
                >
                  {selectedTask.priority} Priority
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
                >
                  <Share2 className="h-3.5 w-3.5 text-slate-400" />
                  <span>Share Brief</span>
                </button>
                <button
                  onClick={handleActionClick}
                  disabled={isPending}
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 focus:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 transition-colors disabled:opacity-70"
                >
                  <UploadCloud className="h-3.5 w-3.5" />
                  <span>{isPending ? "Updating..." : selectedTask.actionLabel}</span>
                </button>
              </div>
            </div>

            {/* Task Title & Primary Overview */}
            <div className="space-y-2">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
                {selectedTask.title}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-slate-800">
                  {selectedTask.organization}
                </span>
                <span>•</span>
                <span>Initiative ID: INIT-2026-V</span>
              </div>
            </div>

            {/* 4-Item Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Assigned Hours
                </span>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {selectedTask.assignedHours} Verified Hours
                </p>
                <p className="text-[10px] text-emerald-600 font-medium">Eligible for Impact Badge</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Due Date
                </span>
                <p className="mt-1 text-sm font-bold text-slate-900">
                  {selectedTask.dueDate}
                </p>
                <p className="text-[10px] text-slate-500 font-medium">By {selectedTask.dueTime}</p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Location Format
                </span>
                <p className="mt-1 text-sm font-bold text-slate-900 truncate">
                  {selectedTask.location.split("-")[0]?.trim() || selectedTask.location}
                </p>
                <p className="text-[10px] text-slate-500 font-medium truncate">
                  {selectedTask.location}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                  Coordinator
                </span>
                <p className="mt-1 text-sm font-bold text-slate-900 truncate">
                  {selectedTask.coordinator.name}
                </p>
                <p className="text-[10px] text-slate-500 font-medium truncate">
                  {selectedTask.coordinator.role}
                </p>
              </div>
            </div>

            {/* Full Task Description */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Detailed Scope of Work
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {selectedTask.description}
              </p>

              {/* Requirements List */}
              <div className="pt-2">
                <h4 className="text-xs font-semibold text-slate-900 mb-2">
                  Prerequisites & Field Safety Requirements
                </h4>
                <ul className="space-y-1.5">
                  {selectedTask.requirements.map((req, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 text-xs text-slate-600"
                    >
                      <Shield className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Subtasks / Checklist */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Deliverables Checklist
                </h3>
                <span className="text-xs font-semibold text-blue-600">
                  {selectedTask.checklist.filter((c) => c.completed).length} of{" "}
                  {selectedTask.checklist.length} Complete
                </span>
              </div>

              <div className="space-y-2">
                {selectedTask.checklist.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleToggleChecklist(selectedTask.id, item.id, item.completed)}
                    className="flex w-full items-center gap-3 rounded-lg border border-slate-100 bg-slate-50/50 p-2.5 text-left transition-colors hover:bg-slate-100/70"
                  >
                    {item.completed ? (
                      <CheckSquare className="h-4 w-4 text-blue-600 shrink-0" />
                    ) : (
                      <Square className="h-4 w-4 text-slate-400 shrink-0" />
                    )}
                    <span
                      className={`text-xs font-medium ${
                        item.completed
                          ? "line-through text-slate-400"
                          : "text-slate-700"
                      }`}
                    >
                      {item.text}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Comments & Activity Timeline */}
            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Activity & Coordinator Timeline
                </h3>
                <span className="text-xs text-slate-400">
                  {selectedTask.comments.length} Messages
                </span>
              </div>

              {/* Timeline Items */}
              <div className="space-y-4">
                {selectedTask.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className={`flex items-start gap-3 rounded-lg p-3 text-xs ${
                      comment.isSystem
                        ? "bg-slate-50 border border-slate-200/60 text-slate-600"
                        : "bg-white border border-slate-100"
                    }`}
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-800 text-[10px] font-bold text-white">
                      {comment.initials}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-900">
                          {comment.author}{" "}
                          <span className="text-[10px] font-normal text-slate-500">
                            • {comment.role}
                          </span>
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {comment.timestamp}
                        </span>
                      </div>
                      <p className="text-slate-700 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* New Comment Input Box */}
              <form onSubmit={handleAddComment} className="pt-2 border-t border-slate-100">
                <div className="rounded-lg border border-slate-200 bg-slate-50/70 p-2.5 focus-within:border-blue-600 focus-within:bg-white transition-all">
                  <textarea
                    rows={2}
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    placeholder="Post an update, status report, or message to the coordinator..."
                    className="w-full resize-none border-none bg-transparent p-0 text-xs text-slate-900 placeholder-slate-400 focus:outline-hidden focus:ring-0"
                  />
                  <div className="mt-2 flex items-center justify-between border-t border-slate-200/70 pt-2">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <button
                        type="button"
                        className="rounded p-1 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                        title="Attach proof file"
                      >
                        <Paperclip className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        className="rounded p-1 hover:bg-slate-200 hover:text-slate-700 transition-colors"
                        title="Reference initiative document"
                      >
                        <FileText className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <button
                      type="submit"
                      disabled={!commentInput.trim() || isPending}
                      className="inline-flex items-center gap-1.5 rounded-md bg-blue-600 px-3 py-1 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                      <Send className="h-3 w-3" />
                      <span>{isPending ? "Sending..." : "Send Update"}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center text-slate-400">
            <CheckSquare className="h-10 w-10 text-slate-300 stroke-[1.5]" />
            <p className="mt-3 text-sm font-semibold text-slate-700">
              Select a task from the inbox
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Detailed descriptions, hours verification, and team communication will appear here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
