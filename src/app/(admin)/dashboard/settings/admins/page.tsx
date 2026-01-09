"use client";

import { useState, useMemo } from "react";
import {
    Shield,
    ShieldOff,
    Search,
    UserPlus,
    Trash2,
    Users,
    Calendar,
    Mail,
    Phone,
    AlertTriangle,
    Loader2,
    X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation } from "@apollo/client";
import { toast } from "sonner";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import {
    GET_ADMIN_USERS,
    GET_ALL_USERS,
    UPDATE_USER_ROLE,
    DELETE_USER,
} from "@/src/modules/user/operations";

interface Admin {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    createdAt: string;
    role: string;
    stats: {
        totalOrders: number;
        totalSpent: number;
    };
}

interface User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    createdAt: string;
    status: string;
}

export default function AdminManagementPage() {
    const [searchTerm, setSearchTerm] = useState("");
    const [showPromoteDialog, setShowPromoteDialog] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

    // Queries
    const {
        data: adminData,
        loading: loadingAdmins,
        refetch: refetchAdmins,
    } = useQuery(GET_ADMIN_USERS, {
        fetchPolicy: "cache-and-network",
    });

    const { data: usersData } = useQuery(GET_ALL_USERS, {
        skip: !showPromoteDialog,
    });

    // Mutations
    const [updateUserRole, { loading: updatingRole }] = useMutation(
        UPDATE_USER_ROLE,
        {
            refetchQueries: [{ query: GET_ADMIN_USERS }, { query: GET_ALL_USERS }],
            awaitRefetchQueries: true,
        }
    );

    const [deleteUser, { loading: deletingUser }] = useMutation(DELETE_USER, {
        update(cache, { data }) {
            if (data?.deleteUser && deletingUserId) {
                // Read the current admin users from cache
                const existingAdmins: any = cache.readQuery({
                    query: GET_ADMIN_USERS,
                });

                if (existingAdmins?.adminUsers) {
                    // Filter out the deleted admin
                    const updatedAdmins = existingAdmins.adminUsers.filter(
                        (admin: Admin) => admin.id !== deletingUserId
                    );

                    // Write the updated list back to cache
                    cache.writeQuery({
                        query: GET_ADMIN_USERS,
                        data: { adminUsers: updatedAdmins },
                    });
                }
            }
        },
        refetchQueries: [{ query: GET_ADMIN_USERS }],
        awaitRefetchQueries: true,
    });

    const admins: Admin[] = adminData?.adminUsers || [];
    const regularUsers: User[] =
        usersData?.users?.filter((u: User) => u.role === "USER") || [];

    // Filter admins
    const filteredAdmins = useMemo(() => {
        return admins.filter((admin) => {
            const searchLower = searchTerm.toLowerCase();
            return (
                admin.firstName?.toLowerCase().includes(searchLower) ||
                admin.lastName?.toLowerCase().includes(searchLower) ||
                admin.email?.toLowerCase().includes(searchLower)
            );
        });
    }, [admins, searchTerm]);

    // Stats
    const stats = useMemo(() => {
        const now = new Date();
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

        const recentAdmins = admins.filter(
            (admin) => new Date(Number(admin.createdAt)) > sevenDaysAgo
        );

        return {
            total: admins.length,
            recent: recentAdmins.length,
            active: admins.filter((a) => a.stats.totalOrders > 0).length,
        };
    }, [admins]);

    // Handlers
    const handleDemote = async (admin: Admin) => {
        if (
            !confirm(
                `Remove admin privileges from ${admin.firstName} ${admin.lastName}?`
            )
        )
            return;

        try {
            await updateUserRole({
                variables: { id: admin.id, role: "USER" },
            });
            toast.success("Admin demoted to regular user");
        } catch (error: any) {
            toast.error(error.message || "Failed to demote admin");
        }
    };

    const handleDelete = async (admin: Admin) => {
        if (
            !confirm(
                `Permanently delete admin ${admin.firstName} ${admin.lastName}? This action cannot be undone.`
            )
        )
            return;

        setDeletingUserId(admin.id);
        try {
            await deleteUser({ variables: { id: admin.id } });
            toast.success("Admin deleted successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to delete admin");
        } finally {
            setDeletingUserId(null);
        }
    };

    const handlePromote = async (userId: string) => {
        const user = regularUsers.find((u) => u.id === userId);
        if (!user) return;

        try {
            await updateUserRole({
                variables: { id: userId, role: "ADMIN" },
            });
            toast.success(`${user.firstName} ${user.lastName} promoted to admin`);
            setShowPromoteDialog(false);
            setSelectedUserId(null);
        } catch (error: any) {
            toast.error(error.message || "Failed to promote user");
        }
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="font-cormorant text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                        Admin Management
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Manage administrator roles and permissions
                    </p>
                </div>
                <Button
                    variant="luxury"
                    onClick={() => setShowPromoteDialog(true)}
                    className="w-full md:w-auto"
                >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Promote User to Admin
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    {
                        label: "Total Admins",
                        value: stats.total,
                        icon: Shield,
                        color: "text-primary",
                    },
                    {
                        label: "Recently Added",
                        value: stats.recent,
                        icon: UserPlus,
                        color: "text-green-600",
                    },
                    {
                        label: "Active Admins",
                        value: stats.active,
                        icon: Users,
                        color: "text-blue-600",
                    },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                                {stat.label}
                            </span>
                            <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                        <span className="text-3xl font-bold text-foreground">
                            {stat.value}
                        </span>
                    </motion.div>
                ))}
            </div>

            {/* Search Bar */}
            <div className="bg-card border border-border rounded-xl p-4 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search admins by name or email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-background border-border"
                    />
                </div>
            </div>

            {/* Admin List */}
            {loadingAdmins ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                </div>
            ) : filteredAdmins.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border border-dashed border-border">
                    <Shield className="w-12 h-12 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground">
                        No admins found
                    </h3>
                    <p className="text-muted-foreground">
                        Try adjusting your search terms.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAdmins.map((admin) => (
                        <motion.div
                            key={admin.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-primary/30 hover:shadow-md transition-all"
                        >
                            {/* Admin Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold border border-primary/20">
                                        {admin.firstName?.[0]}
                                        {admin.lastName?.[0]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-foreground">
                                            {admin.firstName} {admin.lastName}
                                        </h3>
                                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                            <Shield className="w-3 h-3" />
                                            Admin
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Admin Details */}
                            <div className="space-y-2 text-sm text-muted-foreground mb-4">
                                <div className="flex items-center gap-2">
                                    <Mail className="w-3.5 h-3.5" />
                                    <span className="truncate">{admin.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="w-3.5 h-3.5" />
                                    <span>{admin.phoneNumber || "No phone"}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-3.5 h-3.5" />
                                    <span>
                                        Joined{" "}
                                        {new Date(Number(admin.createdAt)).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <div className="bg-muted/40 p-2 rounded-lg text-center">
                                    <p className="text-lg font-bold text-foreground">
                                        {admin.stats.totalOrders}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Orders</p>
                                </div>
                                <div className="bg-muted/40 p-2 rounded-lg text-center">
                                    <p className="text-lg font-bold text-primary">
                                        AED {admin.stats.totalSpent.toFixed(0)}
                                    </p>
                                    <p className="text-xs text-muted-foreground">Spent</p>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-4 border-t border-border flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDemote(admin)}
                                    disabled={updatingRole || deletingUser}
                                    className="flex-1 hover:bg-orange-500/10 hover:text-orange-600 hover:border-orange-500/20"
                                >
                                    <ShieldOff className="w-4 h-4 mr-2" />
                                    Demote
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDelete(admin)}
                                    disabled={updatingRole || deletingUser}
                                    className="flex-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </Button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Promote User Dialog */}
            <AnimatePresence>
                {showPromoteDialog && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                        onClick={() => setShowPromoteDialog(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-card border border-border rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl"
                        >
                            {/* Dialog Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-foreground">
                                        Promote User to Admin
                                    </h2>
                                    <p className="text-muted-foreground text-sm mt-1">
                                        Select a user to grant admin privileges
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowPromoteDialog(false)}
                                    className="p-2 hover:bg-muted rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Warning */}
                            <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4 mb-6 flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                    <p className="font-medium text-orange-900 dark:text-orange-100">
                                        Important
                                    </p>
                                    <p className="text-orange-800 dark:text-orange-200 mt-1">
                                        Admin users will have full access to the dashboard and can
                                        manage all aspects of the system.
                                    </p>
                                </div>
                            </div>

                            {/* User List */}
                            <div className="space-y-2">
                                {regularUsers.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        No regular users available to promote
                                    </div>
                                ) : (
                                    regularUsers.map((user) => (
                                        <div
                                            key={user.id}
                                            className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedUserId === user.id
                                                ? "border-primary bg-primary/5"
                                                : "border-border hover:border-primary/50 hover:bg-muted/50"
                                                }`}
                                            onClick={() => setSelectedUserId(user.id)}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-muted text-foreground flex items-center justify-center text-sm font-bold">
                                                        {user.firstName?.[0]}
                                                        {user.lastName?.[0]}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-foreground">
                                                            {user.firstName} {user.lastName}
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {user.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                                                    {user.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Dialog Actions */}
                            <div className="flex gap-3 mt-6 pt-6 border-t border-border">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowPromoteDialog(false)}
                                    className="flex-1"
                                    disabled={updatingRole}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="luxury"
                                    onClick={() =>
                                        selectedUserId && handlePromote(selectedUserId)
                                    }
                                    disabled={!selectedUserId || updatingRole}
                                    className="flex-1"
                                >
                                    {updatingRole ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Promoting...
                                        </>
                                    ) : (
                                        <>
                                            <Shield className="w-4 h-4 mr-2" />
                                            Promote to Admin
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
