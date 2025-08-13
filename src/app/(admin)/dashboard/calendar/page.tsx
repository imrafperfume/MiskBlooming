"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  Calendar,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  Users,
  Package,
  Truck,
  Bell,
  Filter,
  Search,
} from "lucide-react"
import { Button } from "../../../../components/ui/Button"
import { Input } from "../../../../components/ui/Input"

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"month" | "week" | "day">("month")

  const events = [
    {
      id: "1",
      title: "Valentine's Day Campaign Launch",
      type: "marketing",
      date: "2024-02-01",
      time: "09:00",
      duration: 60,
      description: "Launch Valentine's Day promotional campaign",
      attendees: ["Marketing Team"],
    },
    {
      id: "2",
      title: "Delivery Schedule - Dubai Marina",
      type: "delivery",
      date: "2024-01-15",
      time: "14:00",
      duration: 120,
      description: "Scheduled deliveries for Dubai Marina area",
      attendees: ["Delivery Team"],
    },
    {
      id: "3",
      title: "Inventory Review Meeting",
      type: "meeting",
      date: "2024-01-16",
      time: "10:00",
      duration: 90,
      description: "Weekly inventory and stock review",
      attendees: ["Operations Team", "Management"],
    },
    {
      id: "4",
      title: "Customer Service Training",
      type: "training",
      date: "2024-01-17",
      time: "15:00",
      duration: 180,
      description: "Customer service excellence training session",
      attendees: ["Customer Service Team"],
    },
  ]

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "marketing":
        return "bg-purple-100 text-purple-800 border-purple-200"
      case "delivery":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "meeting":
        return "bg-green-100 text-green-800 border-green-200"
      case "training":
        return "bg-orange-100 text-orange-800 border-orange-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case "marketing":
        return <Bell className="w-4 h-4" />
      case "delivery":
        return <Truck className="w-4 h-4" />
      case "meeting":
        return <Users className="w-4 h-4" />
      case "training":
        return <Package className="w-4 h-4" />
      default:
        return <Calendar className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-cormorant font-bold text-charcoal-900">Calendar & Events</h1>
          <p className="text-gray-600 mt-2">Manage schedules, deliveries, and business events</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === "month" ? "luxury" : "outline"}
              size="sm"
              onClick={() => setViewMode("month")}
            >
              Month
            </Button>
            <Button variant={viewMode === "week" ? "luxury" : "outline"} size="sm" onClick={() => setViewMode("week")}>
              Week
            </Button>
            <Button variant={viewMode === "day" ? "luxury" : "outline"} size="sm" onClick={() => setViewMode("day")}>
              Day
            </Button>
          </div>
          <Button variant="luxury">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Calendar */}
        <div className="lg:col-span-3">
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-xl font-semibold text-charcoal-900">
                  {currentDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                </h2>
                <Button variant="ghost" size="sm">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
              <Button variant="outline" size="sm">
                Today
              </Button>
            </div>

            {/* Calendar Grid */}
            <div className="h-96 flex items-center justify-center bg-gray-50 rounded-lg">
              <div className="text-center">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Calendar View</h3>
                <p className="text-gray-600">Interactive calendar component would be integrated here</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-semibold text-charcoal-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Plus className="w-4 h-4 mr-2" />
                Schedule Delivery
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Users className="w-4 h-4 mr-2" />
                Team Meeting
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Bell className="w-4 h-4 mr-2" />
                Marketing Event
              </Button>
            </div>
          </motion.div>

          {/* Event Filters */}
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-semibold text-charcoal-900 mb-4">Event Types</h3>
            <div className="space-y-2">
              {["marketing", "delivery", "meeting", "training"].map((type) => (
                <label key={type} className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 mr-2" defaultChecked />
                  <span className="text-sm capitalize">{type}</span>
                </label>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Upcoming Events */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-charcoal-900">Upcoming Events</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input placeholder="Search events..." className="pl-10 w-64" />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg border ${getEventTypeColor(event.type)}`}>
                  {getEventTypeIcon(event.type)}
                </div>
                <div>
                  <h3 className="font-medium text-charcoal-900">{event.title}</h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {event.time} ({event.duration}min)
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {event.attendees.join(", ")}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm">
                  Edit
                </Button>
                <Button variant="ghost" size="sm">
                  Delete
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
