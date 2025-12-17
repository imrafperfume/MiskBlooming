"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Star,
  TrendingUp,
  Users,
  ShoppingBag,
  Calendar,
  MoreHorizontal,
  MessageSquare,
  Gift,
  Shield,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";

// --- Types ---
interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  lastOrder: {
    id: string;
    createdAt: string;
    totalAmount: number;
    status: string;
  };
  email: string;
  phoneNumber: string;
  createdAt: string;
  stats: { totalOrders: number; totalSpent: number };
  status: string;
}

// --- GraphQL ---
const GET_USERS = gql`
  query getUsers {
    users {
      id
      firstName
      lastName
      phoneNumber
      createdAt
      email
      role
      status
      stats {
        totalSpent
        totalOrders
      }
      lastOrder {
        id
        totalAmount
        createdAt
        status
      }
    }
  }
`;

const UPDATE_ROLE_MUTATION = gql`
  mutation UpdateUserRole($id: ID!, $role: Role!) {
    updateUserRole(id: $id, role: $role) {
      id
      role
    }
  }
`;

const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id)
  }
`;

// --- Components ---

// Status Badge Component
const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    VIP: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    REGULAR: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    NEW: "bg-green-500/10 text-green-600 border-green-500/20",
    DEFAULT: "bg-muted text-muted-foreground border-border",
  };

  const icons = {
    VIP: Star,
    REGULAR: ShoppingBag,
    NEW: TrendingUp,
    DEFAULT: Users,
  };

  const style = styles[status as keyof typeof styles] || styles.DEFAULT;
  const Icon = icons[status as keyof typeof icons] || icons.DEFAULT;

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${style}`}
    >
      <Icon className="w-3 h-3" />
      <span className="capitalize">{status.toLowerCase()}</span>
    </span>
  );
};

// Skeleton Loader
const CustomerSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div
        key={i}
        className="h-64 bg-card rounded-xl border border-border animate-pulse"
      />
    ))}
  </div>
);

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;

  // Click outside to close menu
  const menuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Queries & Mutations
  const { data, loading, error } = useQuery(GET_USERS, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const [updateUserRole] = useMutation(UPDATE_ROLE_MUTATION);
  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS }],
    awaitRefetchQueries: true,
  });

  const users = data?.users || [];

  // Filter Logic
  const filteredCustomers = useMemo(() => {
    return users
      .filter((customer: Customer) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          customer?.firstName?.toLowerCase().includes(searchLower) ||
          customer?.lastName?.toLowerCase().includes(searchLower) ||
          customer?.email?.toLowerCase().includes(searchLower);

        const matchesStatus =
          statusFilter === "all" || customer.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a: Customer, b: Customer) => {
        if (sortBy === "name")
          return (a.firstName || "").localeCompare(b.firstName || "");
        if (sortBy === "totalSpent")
          return b.stats.totalSpent - a.stats.totalSpent;
        if (sortBy === "totalOrders")
          return b.stats.totalOrders - a.stats.totalOrders;
        return Number(b.createdAt) - Number(a.createdAt);
      });
  }, [users, searchTerm, statusFilter, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const paginatedCustomers = useMemo(() => {
    return filteredCustomers.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filteredCustomers, currentPage]);

  // Stats Logic
  const stats = useMemo(() => {
    const totalSpent = users.reduce(
      (sum: number, c: any) => sum + (c.stats?.totalSpent || 0),
      0
    );
    const totalOrders = users.reduce(
      (sum: number, c: any) => sum + (c.stats?.totalOrders || 0),
      0
    );

    return {
      total: users.length,
      vip: users.filter((c: any) => c.status === "VIP").length,
      regular: users.filter((c: any) => c.status === "REGULAR").length,
      new: users.filter((c: any) => c.status === "NEW").length,
      avgOrderValue: totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0,
      totalRevenue: totalSpent,
    };
  }, [users]);

  // Handlers
  const handleMakeAdmin = async (customerId: string) => {
    setActiveMenuId(null);
    try {
      await updateUserRole({ variables: { id: customerId, role: "ADMIN" } });
      toast.success("User promoted to admin successfully");
    } catch (err) {
      toast.error("Failed to update user role");
    }
  };

  const handleDelete = async (customerId: string) => {
    setActiveMenuId(null);
    if (!confirm("Are you sure? This action cannot be undone.")) return;
    try {
      await deleteUser({ variables: { id: customerId } });
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6">
        <p className="text-destructive font-medium">Error loading customers</p>
        <p className="text-muted-foreground text-sm">{error.message}</p>
      </div>
    );

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-cormorant text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Customer Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage relationships, track spending, and view insights.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="bg-background">
            <MessageSquare className="w-4 h-4 mr-2" />
            Newsletter
          </Button>
          <Button variant="luxury">
            <Gift className="w-4 h-4 mr-2" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          {
            label: "Total Customers",
            value: stats.total,
            icon: Users,
            color: "text-primary",
          },
          {
            label: "VIP Members",
            value: stats.vip,
            icon: Star,
            color: "text-purple-600",
          },
          {
            label: "Regular",
            value: stats.regular,
            icon: ShoppingBag,
            color: "text-blue-600",
          },
          {
            label: "New Users",
            value: stats.new,
            icon: TrendingUp,
            color: "text-green-600",
          },
          {
            label: "Avg. Order",
            value: `AED ${stats.avgOrderValue}`,
            icon: ShoppingBag,
            color: "text-orange-600",
          },
          {
            label: "Revenue",
            value: `AED ${stats.totalRevenue.toLocaleString()}`,
            icon: TrendingUp,
            color: "text-primary",
          },
        ].map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-card p-4 rounded-xl border border-border shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <span
              className="text-lg font-bold text-foreground truncate"
              title={String(stat.value)}
            >
              {stat.value}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Controls Bar */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-3 bg-background border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="VIP">VIP</option>
            <option value="REGULAR">Regular</option>
            <option value="NEW">New</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-10 px-3 bg-background border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer"
          >
            <option value="name">Sort by Name</option>
            <option value="totalSpent">Highest Spenders</option>
            <option value="totalOrders">Most Orders</option>
            <option value="joinDate">Newest Members</option>
          </select>

          <Button variant="outline" size="sm" className="h-10 bg-background">
            <Filter className="w-4 h-4 mr-2" /> More
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      {loading ? (
        <CustomerSkeleton />
      ) : filteredCustomers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border border-dashed border-border">
          <Users className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground">
            No customers found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or search terms.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCustomers.map((customer: any) => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group bg-card border border-border rounded-xl p-6 shadow-sm hover:border-primary/30 hover:shadow-md transition-all relative"
            >
              {/* Card Header */}
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold border border-primary/20">
                    {customer.firstName?.[0] || "U"}
                    {customer.lastName?.[0] || ""}
                  </div>
                  <div>
                    <h3
                      className="font-bold text-foreground truncate max-w-[150px]"
                      title={`${customer.firstName} ${customer.lastName}`}
                    >
                      {customer.firstName} {customer.lastName}
                    </h3>
                    <p
                      className="text-xs text-muted-foreground truncate max-w-[150px]"
                      title={customer.email}
                    >
                      {customer.email}
                    </p>
                  </div>
                </div>
                <StatusBadge status={customer.status} />
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-muted/40 p-3 rounded-lg text-center">
                  <p className="text-xl font-bold text-foreground">
                    {customer.stats.totalOrders}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Orders
                  </p>
                </div>
                <div className="bg-muted/40 p-3 rounded-lg text-center">
                  <p className="text-xl font-bold text-primary">
                    {/* Compact currency formatter */}
                    {new Intl.NumberFormat("en-AE", {
                      style: "currency",
                      currency: "AED",
                      maximumFractionDigits: 0,
                    }).format(customer.stats.totalSpent)}
                  </p>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Spent
                  </p>
                </div>
              </div>

              {/* Details List */}
              <div className="space-y-3 text-sm text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{customer.phoneNumber || "No phone provided"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Not Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    Joined{" "}
                    {new Date(Number(customer.createdAt)).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="pt-4 border-t border-border flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2 hover:text-primary hover:bg-primary/10"
                    onClick={() =>
                      (window.location.href = `mailto:${customer.email}`)
                    }
                  >
                    <Mail className="w-4 h-4" />
                  </Button>
                </div>

                <div
                  className="relative"
                  ref={activeMenuId === customer.id ? menuRef : null}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 w-8 p-0 ${
                      activeMenuId === customer.id ? "bg-muted" : ""
                    }`}
                    onClick={() =>
                      setActiveMenuId(
                        activeMenuId === customer.id ? null : customer.id
                      )
                    }
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>

                  <AnimatePresence>
                    {activeMenuId === customer.id && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        className="absolute right-0 bottom-full mb-2 w-48 bg-popover border border-border rounded-lg shadow-xl z-50 overflow-hidden"
                      >
                        <button
                          onClick={() => handleMakeAdmin(customer.id)}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-muted flex items-center gap-2 text-foreground transition-colors"
                        >
                          <Shield className="w-4 h-4" /> Make Admin
                        </button>
                        <button
                          onClick={() => handleDelete(customer.id)}
                          className="w-full text-left px-4 py-2.5 text-sm hover:bg-destructive/10 text-destructive flex items-center gap-2 transition-colors border-t border-border"
                        >
                          <Trash2 className="w-4 h-4" /> Delete User
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {filteredCustomers.length > 0 && (
        <div className="flex items-center justify-between border-t border-border pt-4">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {(currentPage - 1) * pageSize + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {Math.min(currentPage * pageSize, filteredCustomers.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {filteredCustomers.length}
            </span>{" "}
            results
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              className="bg-background hover:bg-muted"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Logic to show a sliding window of pages could be added here
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "luxury" : "ghost"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="w-8 h-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              className="bg-background hover:bg-muted"
            >
              Next <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
