"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Bell,
  Shield,
  Save,
  Edit3,
} from "lucide-react";
import { Button } from "../../../../components/ui/Button";
import { useAuth } from "@/src/hooks/useAuth";
import Loading from "@/src/components/layout/Loading";
import { useMutation } from "@apollo/client";
import { USER_UPDATE } from "@/src/modules/user/oparations";
import { toast } from "sonner";
import { deleteAccount } from "@/src/modules/user/actions";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function SettingsPage() {
  const { data: user, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [updateUser, { loading, error }] = useMutation(USER_UPDATE);
  console.log("🚀 ~ SettingsPage ~ user:", user);
  const router = useRouter();
  const [formData, setFormData] = useState<any>(null);
  const queryClient = useQueryClient();
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phoneNumber,
        address: user?.address,
        notifications: {
          email: true,
          sms: true,
          push: false,
        },
        privacy: {
          profileVisible: true,
          shareData: false,
        },
      });
    }
  }, [isLoading]);
  const handleSave = async () => {
    try {
      if (user) {
        console.log(user);
        const res = await updateUser({
          variables: {
            id: user?.id,
            firstName: formData?.firstName,
            lastName: formData?.lastName,
            email: formData?.email,
            phoneNumber: formData?.phone,
            address: formData?.address,
          },
        });
        console.log("🚀 ~ handleSave ~ res:", res);
        const updatedUser = res?.data.updateUser;
        if (updatedUser) {
          toast.success("Profile updated successfully");
          setFormData((prev: any) => ({
            ...prev,
            firstName: updatedUser.firstName || prev.firstName,
            lastName: updatedUser.lastName || prev.lastName,
            email: updatedUser.email || prev.email,
            phone: updatedUser.phoneNumber || prev.phone,
            address: updatedUser.address || prev.address,
          }));
        }
      }
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error("Error updating profile:", error);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (field: string, value: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value,
      },
    }));
  };

  const handlePrivacyChange = (field: string, value: boolean) => {
    setFormData((prev: any) => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: value,
      },
    }));
  };

  const handleDeleteAccount = async () => {
    const result = await deleteAccount(user?.id || "");
    if (result.success) {
      toast.success("Account deleted");
      await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      router.push("/");
    } else {
      toast.error(result.error);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg text-muted-foreground">
          You must be logged in to view this page.
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 to-cream-100 pt-32 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-foreground  mb-4">
              Account Settings
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Manage your account preferences and personal information
            </p>
          </div>

          <div className="space-y-8">
            {/* Profile Information */}
            <motion.div
              className="bg-background rounded-2xl shadow-luxury p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-foregroundp-3 rounded-full">
                    <User className="w-6 h-6 text-primary " />
                  </div>
                  <h2 className="text-2xl font-cormorant font-bold text-foreground ">
                    Profile Information
                  </h2>
                </div>
                <Button
                  variant={isEditing ? "luxury" : "outline"}
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  className="flex items-center"
                >
                  {isEditing ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {loading ? "Saving..." : "Save Changes"}
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground  mb-2">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData?.firstName ?? ""}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-border  rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground  mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData?.lastName ?? ""}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-border  rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent disabled:bg-gray-50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground  mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={formData?.email ?? ""}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-border  rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground  mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={formData?.phone ?? ""}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full pl-10 pr-4 py-3 border border-border  rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-foreground  mb-2">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                    <textarea
                      value={formData?.address ?? ""}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      disabled={!isEditing}
                      rows={3}
                      className="w-full pl-10 pr-4 py-3 border border-border  rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent disabled:bg-gray-50"
                    />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Notification Preferences */}
            <motion.div
              className="bg-background rounded-2xl shadow-luxury p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-foregroundp-3 rounded-full">
                  <Bell className="w-6 h-6 text-primary " />
                </div>
                <h2 className="text-2xl font-cormorant font-bold text-foreground ">
                  Notification Preferences
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-cream-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground ">
                      Email Notifications
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Receive order updates and promotions via email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData?.notifications.email ?? ""}
                      onChange={(e) =>
                        handleNotificationChange("email", e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-luxury-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-foreground 0"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-cream-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground ">
                      SMS Notifications
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Get delivery updates via text message
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData?.notifications.sms ?? ""}
                      onChange={(e) =>
                        handleNotificationChange("sms", e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-luxury-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-foreground 0"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-cream-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground ">
                      Push Notifications
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications in your browser
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData?.notifications.push ?? ""}
                      onChange={(e) =>
                        handleNotificationChange("push", e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-luxury-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-foreground 0"></div>
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Privacy Settings */}
            <motion.div
              className="bg-background rounded-2xl shadow-luxury p-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-foregroundp-3 rounded-full">
                  <Shield className="w-6 h-6 text-primary " />
                </div>
                <h2 className="text-2xl font-cormorant font-bold text-foreground ">
                  Privacy Settings
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-cream-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground ">
                      Profile Visibility
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Make your profile visible to other users
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData?.privacy.profileVisible ?? ""}
                      onChange={(e) =>
                        handlePrivacyChange("profileVisible", e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-luxury-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-foreground 0"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-cream-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-foreground ">
                      Data Sharing
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Allow us to share your data with partners for better
                      service
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData?.privacy.shareData ?? ""}
                      onChange={(e) =>
                        handlePrivacyChange("shareData", e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-luxury-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-background after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-foreground 0"></div>
                  </label>
                </div>
              </div>
            </motion.div>

            {/* Danger Zone */}
            <motion.div
              className="bg-background rounded-2xl shadow-luxury p-8 border-l-4 border-red-500"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="text-2xl font-cormorant font-bold text-red-600 mb-4">
                Danger Zone
              </h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg">
                  <div>
                    <h3 className="font-medium text-red-900">Delete Account</h3>
                    <p className="text-sm text-red-700">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button
                    onClick={() => handleDeleteAccount()}
                    variant="outline"
                    className="border-red-300 text-red-600 hover:bg-red-500"
                  >
                    Delete Account
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
