"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateTaskStatus(taskId: string, filterStatus: string) {
  try {
    // We update the 'filter' field to move tasks between tabs for now.
    await prisma.task.update({
      where: { id: taskId },
      data: {
        filter: filterStatus,
      },
    });
    
    // Revalidate the inbox page to show updated data
    revalidatePath("/inbox");
    
    return { success: true };
  } catch (error) {
    console.error("Failed to update task status:", error);
    return { success: false, error: "Failed to update task status" };
  }
}

export async function toggleChecklistItem(taskId: string, checkId: string, completed: boolean) {
  try {
    await prisma.checklist.update({
      where: { id: checkId },
      data: { completed },
    });
    revalidatePath("/inbox");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle checklist:", error);
    return { success: false, error: "Failed to toggle checklist item" };
  }
}

export async function addComment(taskId: string, content: string) {
  try {
    await prisma.comment.create({
      data: {
        content,
        author: "Sarah Jenkins",
        role: "Administrator",
        initials: "SJ",
        timestamp: "Just now",
        taskId: taskId,
      },
    });
    revalidatePath("/inbox");
    return { success: true };
  } catch (error) {
    console.error("Failed to add comment:", error);
    return { success: false, error: "Failed to add comment" };
  }
}
