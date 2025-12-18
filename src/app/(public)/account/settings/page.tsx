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
  Trash2,
  AlertTriangle,
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

// --- Components ---

// Reusable Switch Component
const Switch = ({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}) => (
  <button
    type="button"
    role="switch"
    aria-checked={checked}
    disabled={disabled}
    onClick={() => onChange(!checked)}
    className={`
      relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50
      ${checked ? "bg-primary" : "bg-muted"}
    `}
  >
    <span
      aria-hidden="true"
      className={`
        pointer-events-none inline-block h-5 w-5 transform rounded-full bg-background shadow ring-0 transition duration-200 ease-in-out
        ${checked ? "translate-x-5" : "translate-x-0"}
      `}
    />
  </button>
);

export default function SettingsPage() {
  const { data: user, isLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  // Mutations
  const [updateUser, { loading: updating }] = useMutation(USER_UPDATE);

  // Sync user data to form state
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        phone: user.phoneNumber || "",
        address: user.address || "",
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
  }, [user]);

  // Handlers
  const handleSave = async () => {
    if (!user || !formData) return;

    try {
      const res = await updateUser({
        variables: {
          id: user.id,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phoneNumber: formData.phone,
          address: formData.address,
        },
      });

      if (res?.data?.updateUser) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        // Optimistically update or invalidate query
        queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
      }
    } catch (error) {
      toast.error("Failed to update profile. Please try again.");
      console.error(error);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    )
      return;

    try {
      const result = await deleteAccount(user?.id || "");
      if (result.success) {
        toast.success("Account deleted successfully");
        await queryClient.invalidateQueries({ queryKey: ["auth", "me"] });
        router.push("/");
      } else {
        toast.error(result.error || "Failed to delete account");
      }
    } catch (e) {
      toast.error("An unexpected error occurred");
    }
  };

  const updateField = (section: string | null, field: string, value: any) => {
    setFormData((prev: any) => {
      if (section) {
        return {
          ...prev,
          [section]: { ...prev[section], [field]: value },
        };
      }
      return { ...prev, [field]: value };
    });
  };

  if (isLoading) return <Loading />;

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <AlertTriangle className="w-12 h-12 text-muted-foreground" />
        <h2 className="text-xl font-semibold text-foreground">
          Access Restricted
        </h2>
        <p className="text-muted-foreground">
          Please sign in to manage your account settings.
        </p>
        <Button onClick={() => router.push("/login")}>Sign In</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center md:text-left border-b border-border pb-6">
            <h1 className="text-3xl md:text-4xl font-cormorant font-bold text-foreground mb-2">
              Account Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your profile, preferences, and security settings.
            </p>
          </div>

          {/* Profile Section */}
          <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      Personal Information
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Update your personal details.
                    </p>
                  </div>
                </div>
                <Button
                  variant={isEditing ? "luxury" : "outline"}
                  onClick={isEditing ? handleSave : () => setIsEditing(true)}
                  disabled={updating}
                  className="w-full md:w-auto min-w-[140px]"
                >
                  {isEditing ? (
                    <>
                      {updating ? (
                        <span className="animate-spin mr-2">⏳</span>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {updating ? "Saving..." : "Save Changes"}
                    </>
                  ) : (
                    <>
                      <Edit3 className="w-4 h-4 mr-2" /> Edit Profile
                    </>
                  )}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    First Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={formData?.firstName}
                      onChange={(e) =>
                        updateField(null, "firstName", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData?.lastName}
                    onChange={(e) =>
                      updateField(null, "lastName", e.target.value)
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="email"
                      value={formData?.email}
                      onChange={(e) =>
                        updateField(null, "email", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="tel"
                      value={formData?.phone}
                      onChange={(e) =>
                        updateField(null, "phone", e.target.value)
                      }
                      disabled={!isEditing}
                      className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed transition-all"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <textarea
                      value={formData?.address}
                      onChange={(e) =>
                        updateField(null, "address", e.target.value)
                      }
                      disabled={!isEditing}
                      rows={3}
                      className="w-full pl-9 pr-4 py-2.5 bg-background border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary disabled:opacity-60 disabled:cursor-not-allowed transition-all resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Notifications Section */}
          <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">
                    Notifications
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Manage how we communicate with you.
                  </p>
                </div>
              </div>

              <div className="space-y-4 divide-y divide-border/50">
                {[
                  {
                    key: "email",
                    label: "Email Notifications",
                    desc: "Receive order confirmations and offers.",
                  },
                  {
                    key: "sms",
                    label: "SMS Notifications",
                    desc: "Get delivery updates on your phone.",
                  },
                  {
                    key: "push",
                    label: "Push Notifications",
                    desc: "Receive alerts in your browser.",
                  },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div>
                      <h3 className="font-medium text-foreground">
                        {item.label}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {item.desc}
                      </p>
                    </div>
                    <Switch
                      checked={formData?.notifications[item.key]}
                      onChange={(checked) =>
                        updateField("notifications", item.key, checked)
                      }
                      disabled={!isEditing}
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Privacy Section */}
          <section className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">Privacy</h2>
                  <p className="text-sm text-muted-foreground">
                    Control your data visibility.
                  </p>
                </div>
              </div>

              <div className="space-y-4 divide-y divide-border/50">
                <div className="flex items-center justify-between py-4 first:pt-0">
                  <div>
                    <h3 className="font-medium text-foreground">
                      Profile Visibility
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Allow others to see your basic profile info.
                    </p>
                  </div>
                  <Switch
                    checked={formData?.privacy.profileVisible}
                    onChange={(checked) =>
                      updateField("privacy", "profileVisible", checked)
                    }
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between py-4 last:pb-0">
                  <div>
                    <h3 className="font-medium text-foreground">
                      Data Sharing
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Share anonymous usage data to help us improve.
                    </p>
                  </div>
                  <Switch
                    checked={formData?.privacy.shareData}
                    onChange={(checked) =>
                      updateField("privacy", "shareData", checked)
                    }
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Danger Zone */}
          <section className="bg-destructive/5 rounded-xl border border-destructive/20 overflow-hidden">
            <div className="p-6 md:p-8">
              <h2 className="text-lg font-bold text-destructive mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" /> Danger Zone
              </h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-background rounded-lg border border-border/50">
                <div>
                  <h3 className="font-medium text-foreground">
                    Delete Account
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Permanently delete your account and all data. This cannot be
                    undone.
                  </p>
                </div>
                <Button
                  onClick={handleDeleteAccount}
                  variant="outline"
                  className="border-destructive/30 text-destructive hover:bg-destructive hover:text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Delete Account
                </Button>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
