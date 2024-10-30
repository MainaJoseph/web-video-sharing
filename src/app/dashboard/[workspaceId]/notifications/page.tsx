"use client";

import { getNotifications } from "@/actions/user";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQueryData } from "@/hooks/useQueryData";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, User, XCircle } from "lucide-react";
import { format } from "date-fns";

const Notifications = () => {
  const { data: notifications } = useQueryData(
    ["user-notifications"],
    getNotifications
  );

  const { data: notification, status } = notifications as {
    status: number;
    data: {
      notification: {
        id: string;
        userId: string | null;
        content: string;
        createdAt: Date;
      }[];
    };
  };

  if (status !== 200) {
    return (
      <div className="flex flex-col items-center justify-center h-[300px] text-zinc-500 dark:text-zinc-400">
        <XCircle className="h-8 w-8 mb-2 opacity-50" />
        <p className="text-center">No notifications yet</p>
      </div>
    );
  }

  return (
    <Card
      className="bg-gradient-to-br from-white to-zinc-50/50 dark:from-zinc-900 dark:to-black 
      border-zinc-200 dark:border-zinc-800 p-4"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-white">
            Notifications
          </h2>
        </div>
        <span className="text-xs text-zinc-500 dark:text-zinc-400">
          {notification.notification.length} new
        </span>
      </div>
      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {notification.notification.map((n) => (
            <div
              key={n.id}
              className="group relative flex gap-x-3 items-start rounded-lg p-4 
                bg-zinc-50 dark:bg-zinc-800/50 
                hover:bg-zinc-100 dark:hover:bg-zinc-800/80 
                border border-zinc-200 dark:border-zinc-700/50
                transition-colors"
            >
              <div className="flex-shrink-0">
                <Avatar className="h-8 w-8 border border-zinc-200 dark:border-zinc-700">
                  <AvatarFallback className="bg-zinc-100 dark:bg-zinc-900">
                    <User className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-zinc-800 dark:text-zinc-100 leading-6">
                  {n.content}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                  {format(new Date(n.createdAt), "MMM d, h:mm a")}
                </p>
              </div>
              <div className="flex-shrink-0 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  className="text-zinc-500 dark:text-zinc-400 
                  hover:text-zinc-600 dark:hover:text-zinc-300 
                  p-1 rounded-full 
                  hover:bg-zinc-200 dark:hover:bg-zinc-700/50 
                  transition-colors"
                >
                  <XCircle className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      {notification.notification.length > 0 && (
        <div className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <button className="text-sm text-primary hover:text-primary/80 transition-colors w-full text-center">
            Mark all as read
          </button>
        </div>
      )}
    </Card>
  );
};

export default Notifications;
