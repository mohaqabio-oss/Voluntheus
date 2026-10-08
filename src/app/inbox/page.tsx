import prisma from "@/lib/prisma";
import TaskInboxClient from "./TaskInboxClient";

const mockTasks = [
  {
    id: "TSK-1092",
    title: "Coordinate Emergency Food Logistics & Distribution",
    organization: "Regional Food Coalition",
    category: "Food Security",
    priority: "High",
    filter: "active",
    dueDate: "Oct 12, 2026",
    dueTime: "17:00",
    assignedHours: 6.0,
    location: "Metro Logistics Depot - Sector 4",
    coordinator: {
      name: "Marcus Sterling",
      role: "Operations Director",
      email: "marcus.s@regionalfood.org",
      initials: "MS",
    },
    description:
      "Supervise intake, dry-goods sorting, and emergency dispatch of 350 family nutrition packages for high-need zones. Ensure temperature integrity logs are validated and lead the briefing for 14 incoming morning shift volunteers.",
    requirements: [
      "Valid Food Safety Handling Certification",
      "Steel-toe footwear required on loading dock",
      "Completed digital orientation module",
    ],
    checklist: [
      { text: "Conduct 08:30 morning safety briefing with team", completed: true },
      { text: "Audit inbound delivery manifest against depot inventory", completed: true },
      { text: "Validate cold-chain temp logs for dairy and produce", completed: false },
      { text: "Collect digital signatures on handover receipts", completed: false },
    ],
    comments: [
      {
        author: "Marcus Sterling",
        role: "Operations Director",
        initials: "MS",
        timestamp: "Yesterday at 16:45",
        content:
          "Inbound truck ETA is locked for 08:00 sharp. Pallet jacks 3 and 4 were serviced yesterday and are ready at Dock Bay 2.",
      },
      {
        author: "System Audit",
        role: "Automated Dispatch",
        initials: "SA",
        timestamp: "Today at 08:15",
        content: "Shift started. 12 of 14 volunteers checked in via QR scan at entrance.",
        isSystem: true,
      },
      {
        author: "Elena Rostova",
        role: "Shift Lead",
        initials: "ER",
        timestamp: "Today at 10:20",
        content:
          "Sorting line is ahead of schedule. Completed 180 of 350 crates. We need additional barcode tape at Station 1.",
      },
    ],
    actionLabel: "Submit Work Proof",
  },
  {
    id: "TSK-1093",
    title: "Senior Tech Literacy Coaching: Online Safety & Banking",
    organization: "Digital Inclusion Initiative",
    category: "Education",
    priority: "Med",
    filter: "inbox",
    dueDate: "Oct 15, 2026",
    dueTime: "14:00",
    assignedHours: 3.5,
    location: "Civic Library East - Digital Lab B",
    coordinator: {
      name: "Sophia Zhang",
      role: "Community Education Lead",
      email: "s.zhang@digitalinclusion.org",
      initials: "SZ",
    },
    description:
      "Provide one-on-one technology coaching for senior residents. Topics include recognizing phishing attempts, securely navigating online healthcare portals, and setting up two-factor authentication on mobile devices.",
    requirements: [
      "Patience and strong instructional communication",
      "Familiarity with iOS, Android, and Windows basics",
      "Background verification cleared",
    ],
    checklist: [
      { text: "Review syllabus on cybersecurity basics", completed: false },
      { text: "Configure 12 demo tablets with practice environments", completed: false },
      { text: "Distribute printed cheat-sheets to participants", completed: false },
    ],
    comments: [
      {
        author: "Sophia Zhang",
        role: "Community Education Lead",
        initials: "SZ",
        timestamp: "Oct 06 at 11:15",
        content:
          "We have 18 seniors registered for this cohort. Printed course booklets will be waiting in Digital Lab B.",
      },
    ],
    actionLabel: "Accept Task",
  },
];

async function ensureSeedData() {
  const count = await prisma.task.count();
  if (count === 0) {
    for (const t of mockTasks) {
      const coordinator = await prisma.coordinator.create({
        data: t.coordinator,
      });

      await prisma.task.create({
        data: {
          id: t.id,
          title: t.title,
          organization: t.organization,
          category: t.category,
          priority: t.priority,
          filter: t.filter,
          dueDate: t.dueDate,
          dueTime: t.dueTime,
          assignedHours: t.assignedHours,
          location: t.location,
          description: t.description,
          requirements: t.requirements,
          actionLabel: t.actionLabel,
          coordinatorId: coordinator.id,
          checklist: {
            create: t.checklist,
          },
          comments: {
            create: t.comments,
          },
        },
      });
    }
  }
}

export default async function TaskInboxPage() {
  // Ensure we have some data
  await ensureSeedData();

  // Fetch from database
  const tasks = await prisma.task.findMany({
    include: {
      coordinator: true,
      checklist: true,
      comments: true,
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  return <TaskInboxClient initialTasks={tasks} />;
}
