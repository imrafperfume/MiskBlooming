"use client";

import { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertTriangle,
  Package,
  Calendar,
  Phone,
  Navigation,
  MoreHorizontal,
  RefreshCw,
  Download,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";

// Mock delivery data
const mockDeliveries = [
  {
    id: "DEL-001",
    orderId: "ORD-001234",
    customer: {
      name: "Sarah Al-Mansouri",
      phone: "+971 50 123 4567",
      address: "Downtown Dubai, Burj Khalifa District, Floor 45",
    },
    driver: {
      name: "Ahmed Hassan",
      phone: "+971 55 987 6543",
      vehicle: "Van - DXB 12345",
    },
    status: "in_transit",
    priority: "high",
    scheduledTime: "2024-01-15T14:00:00Z",
    estimatedTime: "2024-01-15T14:30:00Z",
    actualTime: null,
    items: ["Premium Red Rose Bouquet", "Luxury Chocolate Box"],
    value: 499,
    distance: 12.5,
    zone: "Dubai Marina",
  },
  {
    id: "DEL-002",
    orderId: "ORD-001235",
    customer: {
      name: "Emma Johnson",
      phone: "+971 52 456 7890",
      address: "Business Bay, Executive Tower, Office 2301",
    },
    driver: {
      name: "Omar Khalil",
      phone: "+971 56 234 5678",
      vehicle: "Bike - DXB 67890",
    },
    status: "delivered",
    priority: "medium",
    scheduledTime: "2024-01-15T11:00:00Z",
    estimatedTime: "2024-01-15T11:15:00Z",
    actualTime: "2024-01-15T11:10:00Z",
    items: ["Birthday Celebration Package"],
    value: 599,
    distance: 8.2,
    zone: "Business Bay",
  },
  {
    id: "DEL-003",
    orderId: "ORD-001236",
    customer: {
      name: "Fatima Al-Zahra",
      phone: "+971 56 234 5678",
      address: "JBR, Rimal Tower, Apartment 1205",
    },
    driver: {
      name: "Mohammed Ali",
      phone: "+971 58 345 6789",
      vehicle: "Car - DXB 11111",
    },
    status: "pending",
    priority: "low",
    scheduledTime: "2024-01-15T16:00:00Z",
    estimatedTime: "2024-01-15T16:30:00Z",
    actualTime: null,
    items: ["Mixed Seasonal Arrangement"],
    value: 320,
    distance: 15.8,
    zone: "JBR",
  },
  {
    id: "DEL-004",
    orderId: "ORD-001237",
    customer: {
      name: "Khalid Ahmed",
      phone: "+971 50 111 2222",
      address: "Palm Jumeirah, Atlantis Resort, Villa 45",
    },
    driver: {
      name: "Hassan Mohammed",
      phone: "+971 55 333 4444",
      vehicle: "Van - DXB 22222",
    },
    status: "delayed",
    priority: "high",
    scheduledTime: "2024-01-15T13:00:00Z",
    estimatedTime: "2024-01-15T13:45:00Z",
    actualTime: null,
    items: ["Sympathy Wreath", "Condolence Card"],
    value: 424,
    distance: 22.3,
    zone: "Palm Jumeirah",
  },
];

export default function DeliveryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [zoneFilter, setZoneFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  const filteredDeliveries = useMemo(() => {
    return mockDeliveries.filter((delivery) => {
      const matchesSearch =
        delivery.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        delivery.customer.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        delivery.driver.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || delivery.status === statusFilter;
      const matchesZone = zoneFilter === "all" || delivery.zone === zoneFilter;
      const matchesPriority =
        priorityFilter === "all" || delivery.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesZone && matchesPriority;
    });
  }, [searchTerm, statusFilter, zoneFilter, priorityFilter]);

  const stats = useMemo(() => {
    return {
      total: mockDeliveries.length,
      pending: mockDeliveries.filter((d) => d.status === "pending").length,
      inTransit: mockDeliveries.filter((d) => d.status === "in_transit").length,
      delivered: mockDeliveries.filter((d) => d.status === "delivered").length,
      delayed: mockDeliveries.filter((d) => d.status === "delayed").length,
      avgDistance:
        mockDeliveries.reduce((sum, d) => sum + d.distance, 0) /
        mockDeliveries.length,
    };
  }, []);

  const zones = Array.from(new Set(mockDeliveries.map((d) => d.zone)));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_transit":
        return "bg-blue-100 text-blue-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "delayed":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-background  text-gray-800";
      default:
        return "bg-background  text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "in_transit":
        return <Truck className="w-4 h-4" />;
      case "delivered":
        return <CheckCircle className="w-4 h-4" />;
      case "delayed":
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-background  text-gray-800";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-cormorant font-bold text-foreground ">
            Delivery Management
          </h1>
          <p className="text-foreground  mt-2">
            Track and manage delivery operations
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="luxury">
            <Navigation className="w-4 h-4 mr-2" />
            Route Optimizer
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        <motion.div
          className="bg-background rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground ">Total Deliveries</p>
              <p className="text-xl font-bold text-foreground ">
                {stats.total}
              </p>
            </div>
            <Package className="w-6 h-6 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-background rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground ">Pending</p>
              <p className="text-xl font-bold text-yellow-600">
                {stats.pending}
              </p>
            </div>
            <Clock className="w-6 h-6 text-yellow-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-background rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground ">In Transit</p>
              <p className="text-xl font-bold text-blue-600">
                {stats.inTransit}
              </p>
            </div>
            <Truck className="w-6 h-6 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-background rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground ">Delivered</p>
              <p className="text-xl font-bold text-green-600">
                {stats.delivered}
              </p>
            </div>
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-background rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground ">Delayed</p>
              <p className="text-xl font-bold text-red-600">{stats.delayed}</p>
            </div>
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-background rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-foreground ">Avg Distance</p>
              <p className="text-xl font-bold text-purple-600">
                {stats.avgDistance.toFixed(1)} km
              </p>
            </div>
            <Navigation className="w-6 h-6 text-purple-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        className="bg-background rounded-xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search deliveries, orders, customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_transit">In Transit</option>
            <option value="delivered">Delivered</option>
            <option value="delayed">Delayed</option>
          </select>
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
          >
            <option value="all">All Zones</option>
            {zones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
          >
            <option value="all">All Priority</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </motion.div>

      {/* Deliveries List */}
      <div className="space-y-4">
        {filteredDeliveries.map((delivery, index) => (
          <motion.div
            key={delivery.id}
            className="bg-background rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-backgroundfrom-luxury-400 to-primary rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground ">
                    #{delivery.id}
                  </h3>
                  <p className="text-sm text-foreground ">
                    Order: {delivery.orderId}
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(
                      delivery.status
                    )}`}
                  >
                    {getStatusIcon(delivery.status)}
                    <span className="ml-1 capitalize">
                      {delivery.status.replace("_", " ")}
                    </span>
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(
                      delivery.priority
                    )}`}
                  >
                    {delivery.priority} priority
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Navigation className="w-4 h-4 mr-2" />
                  Track
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer Info */}
              <div>
                <h4 className="font-medium text-foreground  mb-3">
                  Customer Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-foreground ">
                    <span className="font-medium">
                      {delivery.customer.name}
                    </span>
                  </div>
                  <div className="flex items-center text-foreground ">
                    <Phone className="w-4 h-4 mr-2" />
                    {delivery.customer.phone}
                  </div>
                  <div className="flex items-start text-foreground ">
                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{delivery.customer.address}</span>
                  </div>
                </div>
              </div>

              {/* Driver Info */}
              <div>
                <h4 className="font-medium text-foreground  mb-3">
                  Driver Details
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-foreground ">
                    <span className="font-medium">{delivery.driver.name}</span>
                  </div>
                  <div className="flex items-center text-foreground ">
                    <Phone className="w-4 h-4 mr-2" />
                    {delivery.driver.phone}
                  </div>
                  <div className="flex items-center text-foreground ">
                    <Truck className="w-4 h-4 mr-2" />
                    {delivery.driver.vehicle}
                  </div>
                  <div className="flex items-center text-foreground ">
                    <Navigation className="w-4 h-4 mr-2" />
                    {delivery.distance} km • {delivery.zone}
                  </div>
                </div>
              </div>

              {/* Delivery Timeline */}
              <div>
                <h4 className="font-medium text-foreground  mb-3">
                  Delivery Timeline
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-foreground ">
                    <Calendar className="w-4 h-4 mr-2" />
                    <div>
                      <p className="font-medium">Scheduled</p>
                      <p>{new Date(delivery.scheduledTime).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-foreground ">
                    <Clock className="w-4 h-4 mr-2" />
                    <div>
                      <p className="font-medium">Estimated</p>
                      <p>{new Date(delivery.estimatedTime).toLocaleString()}</p>
                    </div>
                  </div>
                  {delivery.actualTime && (
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      <div>
                        <p className="font-medium">Delivered</p>
                        <p>{new Date(delivery.actualTime).toLocaleString()}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-foreground ">
                    Items: {delivery.items.join(", ")}
                  </p>
                  <p className="text-sm font-medium text-primary ">
                    Order Value: AED {delivery.value}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDeliveries.length === 0 && (
        <div className="text-center py-12">
          <Truck className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground  mb-2">
            No deliveries found
          </h3>
          <p className="text-foreground ">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
