"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, Loader2, X } from "lucide-react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

// --- GraphQL Operations ---
const GET_NOTIFICATIONS = gql`
  query GetNotifications($limit: Int) {
    getNotifications(limit: $limit) {
      items {
        id
        type
        message
        read
        createdAt
        orderId
      }
      unreadCount
    }
  }
`;

const MARK_READ = gql`
  mutation MarkNotificationAsRead($id: ID!) {
    markNotificationAsRead(id: $id) {
      id
      read
    }
  }
`;

const MARK_ALL_READ = gql`
  mutation MarkAllNotificationsAsRead {
    markAllNotificationsAsRead
  }
`;

export default function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [lastCheck, setLastCheck] = useState(Date.now());

  // Polling every 30 seconds
  const { data, loading, refetch } = useQuery(GET_NOTIFICATIONS, {
    variables: { limit: 10 },
    pollInterval: 30000,
    fetchPolicy: "network-only",
  });

  const [markRead] = useMutation(MARK_READ);
  const [markAllRead, { loading: markingAll }] = useMutation(MARK_ALL_READ, {
    refetchQueries: [GET_NOTIFICATIONS],
  });

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
          dropdownRef.current && 
          !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = data?.getNotifications?.items || [];
  const unreadCount = data?.getNotifications?.unreadCount || 0;

  const handleMarkRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await markRead({ variables: { id } });
      // Optimistic update handled by Apollo cache usually, but refetch guarantees sync
      refetch(); 
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllRead();
      // refetch(); // Handled by refetchQueries
    } catch (err) {
      console.error("Failed to mark all read", err);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-muted-foreground hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-muted/30">
              <h3 className="font-semibold text-sm">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={markingAll}
                  className="text-xs text-primary hover:text-primary/80 font-medium flex items-center gap-1"
                >
                  {markingAll ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Check className="w-3 h-3" />
                  )}
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-[60vh] overflow-y-auto">
              {loading && notifications.length === 0 ? (
                <div className="p-8 flex justify-center text-muted-foreground">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">
                  No notifications yet.
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {notifications.map((item: any) => (
                    <div
                      key={item.id}
                      className={`p-4 hover:bg-muted/40 transition-colors flex gap-3 ${
                        !item.read ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className="mt-1 flex-shrink-0">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            !item.read ? "bg-primary" : "bg-transparent"
                          }`}
                        />
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className={`text-sm ${!item.read ? "font-medium text-foreground" : "text-muted-foreground"}`}>
                          {item.message}
                        </p>
                        <p className="text-xs text-muted-foreground/70">
                          {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                      {!item.read && (
                        <button
                          onClick={(e) => handleMarkRead(item.id, e)}
                          className="self-start text-muted-foreground hover:text-primary transition-colors p-1"
                          title="Mark as read"
                        >
                           <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
             {/* Footer */}
             {notifications.length > 0 && (
                <div className="p-2 border-t border-border bg-muted/30 text-center">
                    <p className="text-xs text-muted-foreground">Real-time updates active</p>
                </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
