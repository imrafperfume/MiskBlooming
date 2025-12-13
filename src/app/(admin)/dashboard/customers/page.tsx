"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Mail,
  Phone,
  MapPin,
  Star,
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Calendar,
  MoreHorizontal,
  MessageSquare,
  Gift,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { gql, useMutation, useQuery } from "@apollo/client";
import Loading from "@/src/components/layout/Loading";
import { toast } from "sonner";
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
  // location: string;
  createdAt: string;
  stats: { totalOrders: number; totalSpent: number };
  status: string;
}

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
export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(
    null
  );
  // Fetch users
  const { data, loading, error } = useQuery(GET_USERS, {
    fetchPolicy: "cache-and-network",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const users = data?.users || [];
  // Filtered customers
  const filteredCustomers = useMemo(() => {
    return users?.filter((customer: Customer) => {
      const matchesSearch =
        customer?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer?.email?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || customer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [users, searchTerm, statusFilter]);
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const paginatedCustomers = useMemo(() => {
    return filteredCustomers.slice(
      (currentPage - 1) * pageSize,
      currentPage * pageSize
    );
  }, [filteredCustomers, currentPage]);
  const [updateUserRole] = useMutation(UPDATE_ROLE_MUTATION);
  const [deleteUser] = useMutation(DELETE_USER, {
    refetchQueries: [{ query: GET_USERS }],
    awaitRefetchQueries: true,
  });
  // Stats calculation
  const stats = useMemo(() => {
    const totalSpent = users.reduce(
      (sum: number, c: any) => sum + c.stats.totalSpent,
      0
    );

    const totalOrders = users.reduce(
      (sum: number, c: any) => sum + c.stats.totalOrders,
      0
    );
    const totalRevenue = users?.reduce(
      (sum: number, c: any) => sum + (Number(c.stats.totalSpent) || 0),
      0
    );

    return {
      total: users?.length,
      vip: users?.filter((c: any) => c.status === "VIP").length,
      regular: users?.filter((c: any) => c.status === "REGULAR").length,
      new: users?.filter((c: any) => c.status === "NEW").length,
      totalSpent,
      totalOrders,
      averageOrderValue:
        totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0,
      totalRevenue,
    };
  }, [users]);
  console.log("🚀 ~ CustomersPage ~ stats:", stats);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "VIP":
        return "bg-purple-100 text-purple-800";
      case "REGULAR":
        return "bg-blue-100 text-blue-800";
      case "NEW":
        return "bg-green-100 text-green-800";
      default:
        return "bg-background  text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "VIP":
        return <Star className="w-4 h-4" />;
      case "REGULAR":
        return <ShoppingBag className="w-4 h-4" />;
      case "NEW":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };
  if (loading) return <Loading />;
  if (error) return <p className="mt-5">{error.message}</p>;

  const handleMakeAdmin = async (customerId: string) => {
    try {
      if (!customerId) return;
      setSelectedCustomerId(null);

      await updateUserRole({
        variables: { id: customerId, role: "ADMIN" },
      });
      console.log("Make admin for user ID:", customerId);
      toast.success("User promoted to admin successfully!");
    } catch (error) {
      toast.error("Failed to promote user to admin.");
      console.error("Error promoting user to admin:", error);
    }
  };
  const handleDelete = async (customerId: string) => {
    try {
      await deleteUser({ variables: { id: customerId } });
      toast.success("User deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete user.");
      console.error("Error deleting user:", error);
    }
  };
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col flex-wrap lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-cormorant font-bold text-foreground ">
            Customer Management
          </h1>
          <p className="text-foreground  mt-2">
            Manage customer relationships and insights
          </p>
        </div>
        <div
          className="flex flex-wrap
         items-center sm:space-x-4 gap-4 mt-4 lg:mt-0"
        >
          <Button variant="outline">
            <MessageSquare className="w-4 h-4 mr-2" />
            Send Newsletter
          </Button>
          <Button variant="luxury">
            <Gift className="w-4 h-4 mr-2" />
            Create Campaign
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
              <p className="text-sm text-foreground ">Total Customers</p>
              <p className="text-xl font-bold text-foreground ">
                {users?.length}
              </p>
            </div>
            <Users className="w-6 h-6 text-blue-500" />
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
              <p className="text-sm text-foreground ">VIP Customers</p>
              <p className="text-xl font-bold text-purple-600">{stats?.vip}</p>
            </div>
            <Star className="w-6 h-6 text-purple-500" />
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
              <p className="text-sm text-foreground ">Regular</p>
              <p className="text-xl font-bold text-blue-600">
                {stats?.regular}
              </p>
            </div>
            <ShoppingBag className="w-6 h-6 text-blue-500" />
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
              <p className="text-sm text-foreground ">New This Month</p>
              <p className="text-xl font-bold text-green-600">{stats.new}</p>
            </div>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-background rounded-xl p-4 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-foreground ">Avg Order Value</p>
              <div className="text-xl  font-bold text-primary ">
                <p>AED {stats.averageOrderValue}</p>
              </div>
            </div>
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
              <p className="text-sm text-foreground ">Total Revenue</p>
              <p className="text-xl font-bold text-green-600">
                AED {stats?.totalRevenue}
              </p>
            </div>
            <TrendingUp className="w-6 h-6 text-green-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        className="bg-background rounded-xl sm:p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-border  rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="all">All Customers</option>
            <option value="VIP">VIP Customers</option>
            <option value="REGULAR">Regular Customers</option>
            <option value="NEW">New Customers</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-3 border border-border  rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
          >
            <option value="name">Sort by Name</option>
            <option value="totalSpent">Sort by Total Spent</option>
            <option value="totalOrders">Sort by Orders</option>
            <option value="joinDate">Sort by Join Date</option>
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </motion.div>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {paginatedCustomers.map((customer: Customer, index: any) => (
          <motion.div
            key={customer.id}
            className="bg-background rounded-xl relative overflow-hidden p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-backgroundfrom-luxury-400 to-primary rounded-full flex items-center justify-center">
                  <span className="text-white font-medium">
                    {(customer?.firstName?.[0] || "M") +
                      (customer?.lastName?.[0] || "B")}
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground ">
                    {(customer?.firstName || "Random") +
                      " " +
                      (customer?.lastName || "")}
                  </h3>
                  <p className="text-sm text-foreground ">{customer.email}</p>
                </div>
              </div>
              <span
                className={`flex gap-1 absolute right-2 top-2 items-center px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                  customer?.status
                )}`}
              >
                {getStatusIcon(customer.status)}
                <span className="mr-1 capitalize">{customer.status}</span>
              </span>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center text-sm text-foreground ">
                <Phone className="w-4 h-4 mr-2" />
                {customer.phoneNumber}
              </div>
              <div className="flex items-center text-sm text-foreground ">
                <MapPin className="w-4 h-4 mr-2" />
                {/* {customer?.location | "Not available"} */} Not Availabe
              </div>
              <div className="flex items-center text-sm text-foreground ">
                <Calendar className="w-4 h-4 mr-2" />
                Joined{" "}
                {customer.createdAt
                  ? new Date(Number(customer.createdAt)).toLocaleDateString()
                  : "N/A"}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center p-3 bg-background rounded-lg">
                <p className="text-lg font-bold text-foreground ">
                  {customer.stats.totalOrders}
                </p>
                <p className="text-xs text-foreground ">Total Orders</p>
              </div>
              <div className="text-center p-3 bg-background rounded-lg">
                <p className="text-lg font-bold text-primary ">
                  AED {customer.stats.totalSpent.toLocaleString()}
                  {/* AED {customer.stats.totalSpent.toLocaleString()} */}
                </p>
                <p className="text-xs text-foreground ">Total Spent</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-foreground ">Avg Order Value:</span>
                <span className="font-medium">
                  AED{" "}
                  {customer.stats.totalOrders
                    ? Math.round(
                        customer.stats.totalSpent / customer.stats.totalOrders
                      )
                    : 0}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-foreground ">Loyalty Points:</span>
                <span className="font-medium text-primary ">
                  {/* {customer.loyaltyPoints} 0 pts */} 0 pts
                </span>
              </div>
              {/* <div className="flex justify-between text-sm">
                <span className="text-foreground ">Preferred Category:</span>
                <span className="font-medium">
                  {customer.preferredCategory}
                </span>
              </div> */}
              <div className="flex justify-between text-sm">
                <span className="text-foreground ">Last Order:</span>
                <span className="font-medium">
                  {customer.lastOrder
                    ? new Date(
                        Number(customer.lastOrder.createdAt)
                      ).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center space-x-2">
              {/* <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-transparent"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Profile
              </Button> */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  window.location.href = `mailto:${customer.email}`;
                }}
              >
                <Mail className="w-4 h-4" />
              </Button>

              <Button
                onClick={() => {
                  selectedCustomerId === customer.id
                    ? setSelectedCustomerId(null) // Close the menu if it's already open
                    : setSelectedCustomerId(customer.id); // Open the menu for the selected user
                }}
                variant="ghost"
                size="sm"
              >
                <MoreHorizontal className="w-4 h-4" />
              </Button>
              {selectedCustomerId === customer.id && ( // Only show the menu for the selected user
                <div className="absolute flex flex-col gap-1 p-4 shadow right-6 bottom-14 bg-background border border-border  rounded-lg z-10">
                  <span
                    onClick={() => handleMakeAdmin(customer.id)}
                    className="text-sm text-foreground  mb-2 cursor-pointer hover:scale-105 transition-transform"
                  >
                    Make Admin
                  </span>
                  <span
                    onClick={() => handleDelete(customer?.id)}
                    className="text-sm text-red-600 cursor-pointer hover:scale-105 transition-transform"
                  >
                    Delete User
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground  mb-2">
            No customers found
          </h3>
          <p className="text-foreground ">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Pagination */}
      {filteredCustomers.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-foreground ">
            Showing {(currentPage - 1) * pageSize + 1}–
            {Math.min(currentPage * pageSize, filteredCustomers.length)} of{" "}
            {filteredCustomers.length} customers
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            >
              Previous
            </Button>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant="outline"
                size="sm"
                className={
                  page === currentPage ? "bg-foreground 0 text-white" : ""
                }
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
