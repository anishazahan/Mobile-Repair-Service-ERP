import { db } from "@/mocks/db";
import { simulateRequest } from "@/mocks/server";
import type { AppNotification } from "@/types";

export async function getNotifications(): Promise<AppNotification[]> {
  return simulateRequest(() =>
    [...db.notifications].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1)),
  );
}

export async function markNotificationRead(id: string): Promise<void> {
  return simulateRequest(() => {
    const notif = db.notifications.find((n) => n.id === id);
    if (notif) notif.read = true;
  });
}

export async function markAllNotificationsRead(): Promise<void> {
  return simulateRequest(() => {
    db.notifications.forEach((n) => {
      n.read = true;
    });
  });
}
