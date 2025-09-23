"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  User,
  Bell,
  Shield,
  CreditCard,
  Truck,
  Mail,
  Palette,
  Database,
  Key,
  Save,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";

const ADMIN_USERS = gql`
  query AdminUsers {
    adminUsers {
      id
      firstName
      lastName
      email
      phoneNumber
      role
      emailVerified
      createdAt
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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);
  const [roles, setRoles] = useState<{ [key: string]: string }>({});
  const [loadingIds, setLoadingIds] = useState<{ [key: string]: boolean }>({});
  const { data: adminUsers, refetch } = useQuery(ADMIN_USERS, {
    fetchPolicy: "cache-and-network",
  });

  const [updateUserRole, { loading: updateLoading, error: updateError }] =
    useMutation(UPDATE_ROLE_MUTATION, {
      refetchQueries: [{ query: ADMIN_USERS }],
      awaitRefetchQueries: true,
    });

  // Usage example:
  // updateRoleMutation({ variables: { id: userId, role: newRole } });
  const adminUsersList = adminUsers?.adminUsers || [];
  useEffect(() => {
    if (adminUsersList) {
      const initialRoles: Record<string, string> = {};
      adminUsersList.forEach((u: any) => {
        initialRoles[u.id] = u.role;
      });
      setRoles(initialRoles);
    }
  }, [adminUsersList]);
  const tabs = [
    { id: "general", name: "General", icon: Settings },
    { id: "profile", name: "Profile", icon: User },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "security", name: "Security", icon: Shield },
    { id: "payments", name: "Payments", icon: CreditCard },
    { id: "shipping", name: "Shipping", icon: Truck },
    { id: "email", name: "Email", icon: Mail },
    { id: "appearance", name: "Appearance", icon: Palette },
    { id: "integrations", name: "Integrations", icon: Database },
  ];

  const handleUpdateRole = async (id: string, role: string) => {
    try {
      setLoadingIds((prev) => ({ ...prev, [id]: true }));

      await updateUserRole({
        variables: { id, role },
      });
      refetch();
      toast.success("Role updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update role");
    } finally {
      setLoadingIds((prev) => ({ ...prev, [id]: false }));
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "general":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
                Business Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Name
                  </label>
                  <Input defaultValue="MiskBlooming" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Email
                  </label>
                  <Input defaultValue="admin@miskblooming.ae" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input defaultValue="+971 4 123 4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <Input defaultValue="https://miskblooming.ae" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Address
                  </label>
                  <Input defaultValue="Dubai Marina, Dubai, UAE" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Description
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
                    rows={3}
                    defaultValue="Premium flower and gift delivery service in Dubai, UAE"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h3>Admin Management ({adminUsersList?.length || 0})</h3>
              {adminUsersList?.map((user: any) => (
                <div
                  key={user.id}
                  className="sm:p-4 border border-gray-200 rounded-lg flex items-center flex-wrap gap-2 justify-between"
                >
                  <div className="space-y-1">
                    <p className="font-medium text-charcoal-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-sm text-gray-600">{user?.email}</p>
                    <p className="text-sm text-gray-600">
                      Role:{" "}
                      <span className="font-medium">
                        {roles[user.id] || user.role}
                      </span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Email Verified:{" "}
                      <span
                        className={`font-medium ${
                          user?.emailVerified
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {user?.emailVerified ? "Yes" : "No"}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <select
                      value={roles[user.id] || user.role}
                      onChange={(e) =>
                        setRoles((prev) => ({
                          ...prev,
                          [user.id]: e.target.value,
                        }))
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
                    >
                      <option value="ADMIN">Admin</option>
                      <option value="USER">Make User</option>
                    </select>

                    <Button
                      variant={"luxury"}
                      size={"sm"}
                      onClick={() => handleUpdateRole(user?.id, roles[user.id])}
                    >
                      {loadingIds[user.id] ? "Updating..." : "Update Role"}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case "profile":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
                Admin Profile
              </h3>
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-luxury-400 to-luxury-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <Button variant="outline" size="sm">
                    Change Photo
                  </Button>
                  <p className="text-sm text-gray-500 mt-1">
                    JPG, PNG or GIF. Max size 2MB
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name
                  </label>
                  <Input defaultValue="Admin" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name
                  </label>
                  <Input defaultValue="User" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input defaultValue="admin@miskblooming.ae" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone
                  </label>
                  <Input defaultValue="+971 50 123 4567" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent">
                    <option>Super Admin</option>
                    <option>Admin</option>
                    <option>Manager</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent">
                    <option>English</option>
                    <option>Arabic</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case "security":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
                Password & Security
              </h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Input type={showPassword ? "text" : "password"} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Eye className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <Input type="password" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <Input type="password" />
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
                Two-Factor Authentication
              </h3>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <p className="font-medium text-charcoal-900">Enable 2FA</p>
                  <p className="text-sm text-gray-600">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-luxury-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-luxury-600"></div>
                </label>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
                API Keys
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-charcoal-900">
                      Production API Key
                    </p>
                    <p className="text-sm text-gray-600 font-mono">
                      mk_live_••••••••••••••••
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Key className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-charcoal-900 mb-4">
                Email Notifications
              </h3>
              <div className="space-y-4">
                {[
                  {
                    name: "New Orders",
                    description: "Get notified when new orders are placed",
                  },
                  {
                    name: "Low Stock Alerts",
                    description: "Receive alerts when products are running low",
                  },
                  {
                    name: "Customer Reviews",
                    description: "Notifications for new customer reviews",
                  },
                  {
                    name: "Payment Updates",
                    description: "Updates on payment status changes",
                  },
                  {
                    name: "Delivery Updates",
                    description: "Notifications about delivery status",
                  },
                ].map((notification) => (
                  <div
                    key={notification.name}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-charcoal-900">
                        {notification.name}
                      </p>
                      <p className="text-sm text-gray-600">
                        {notification.description}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        defaultChecked
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-luxury-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-luxury-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Settings Section
            </h3>
            <p className="text-gray-600">
              This settings section is under development
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-cormorant font-bold text-charcoal-900">
            Settings
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your account and system preferences
          </p>
        </div>
        <Button variant="luxury">
          <Save className="w-4 h-4 mr-2 " />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <motion.div
            className="bg-white rounded-2xl sm:p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? "bg-luxury-50 text-luxury-700 border border-luxury-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              ))}
            </nav>
          </motion.div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3">
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            {renderTabContent()}

            <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
              <Button variant="outline">Cancel</Button>
              <Button variant="luxury">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
