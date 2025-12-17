"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  Tag,
  Percent,
  Gift,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  MoreHorizontal,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { toast } from "sonner";
import { CreatePromotionModal } from "@/src/components/dashboard/CreatePromotionModal";

// --- Types ---
export interface Promotion {
  id: string;
  name: string;
  description: string;
  type: "percentage" | "fixed" | "buy_x_get_y";
  value: number;
  code: string;
  startDate: string;
  endDate: string;
  status: "active" | "scheduled" | "expired" | "paused";
  usageLimit: number;
  usageCount: number;
  minOrderValue: number;
  revenue: number;
}

// --- Mock Data (Replace with API call) ---
const initialPromotions: Promotion[] = [
  {
    id: "1",
    name: "Valentine's Day Special",
    description: "20% off on all premium rose bouquets",
    type: "percentage",
    value: 20,
    code: "VALENTINE20",
    startDate: "2024-02-01",
    endDate: "2024-02-14",
    status: "active",
    usageLimit: 500,
    usageCount: 234,
    minOrderValue: 200,
    revenue: 15680,
  },
  {
    id: "2",
    name: "Mother's Day Bundle",
    description: "Buy 2 get 1 free on chocolate collections",
    type: "buy_x_get_y",
    value: 1,
    code: "MOTHERSDAY",
    startDate: "2024-03-15",
    endDate: "2024-03-31",
    status: "scheduled",
    usageLimit: 200,
    usageCount: 0,
    minOrderValue: 150,
    revenue: 0,
  },
  {
    id: "3",
    name: "First Order Discount",
    description: "AED 50 off for new customers",
    type: "fixed",
    value: 50,
    code: "WELCOME50",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    status: "active",
    usageLimit: 1000,
    usageCount: 456,
    minOrderValue: 100,
    revenue: 22800,
  },
];

// --- Helper Components ---
const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    active: "bg-green-500/10 text-green-600 border-green-500/20",
    scheduled: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    expired: "bg-destructive/10 text-destructive border-destructive/20",
    paused: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    default: "bg-muted text-muted-foreground border-border",
  };

  const icons = {
    active: CheckCircle,
    scheduled: Clock,
    expired: XCircle,
    paused: AlertCircle,
    default: Tag,
  };

  const style = styles[status as keyof typeof styles] || styles.default;
  const Icon = icons[status as keyof typeof icons] || icons.default;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${style}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {status}
    </span>
  );
};

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filter Logic
  const filteredPromotions = useMemo(() => {
    return promotions.filter((promotion) => {
      const matchesSearch =
        promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promotion.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || promotion.status === statusFilter;
      const matchesType = typeFilter === "all" || promotion.type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });
  }, [promotions, searchTerm, statusFilter, typeFilter]);

  // Stats Logic
  const stats = useMemo(() => {
    return {
      total: promotions.length,
      active: promotions.filter((p) => p.status === "active").length,
      scheduled: promotions.filter((p) => p.status === "scheduled").length,
      expired: promotions.filter((p) => p.status === "expired").length,
      totalRevenue: promotions.reduce((sum, p) => sum + p.revenue, 0),
      totalUsage: promotions.reduce((sum, p) => sum + p.usageCount, 0),
    };
  }, [promotions]);

  // Handlers
  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this promotion?")) {
      setPromotions((prev) => prev.filter((p) => p.id !== id));
      toast.success("Promotion deleted successfully");
    }
  };

  const handleCreate = (newPromo: Promotion) => {
    setPromotions((prev) => [newPromo, ...prev]);
    setIsCreateModalOpen(false);
    toast.success("Promotion created successfully");
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-cormorant font-bold text-foreground">
            Promotions & Offers
          </h1>
          <p className="text-muted-foreground mt-2">
            Create and manage discount campaigns to boost sales.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="bg-background">
            <TrendingUp className="w-4 h-4 mr-2" /> Analytics
          </Button>
          <Button variant="luxury" onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" /> Create Promotion
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          {
            label: "Total Campaigns",
            value: stats.total,
            icon: Tag,
            color: "text-primary",
          },
          {
            label: "Active",
            value: stats.active,
            icon: CheckCircle,
            color: "text-green-600",
          },
          {
            label: "Scheduled",
            value: stats.scheduled,
            icon: Clock,
            color: "text-blue-600",
          },
          {
            label: "Expired",
            value: stats.expired,
            icon: XCircle,
            color: "text-destructive",
          },
          {
            label: "Redemptions",
            value: stats.totalUsage,
            icon: Users,
            color: "text-purple-600",
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

      {/* Filters Bar */}
      <div className="bg-card border border-border rounded-xl p-4 flex flex-col lg:flex-row gap-4 items-center justify-between shadow-sm">
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by name or code..."
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
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
            <option value="expired">Expired</option>
          </select>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="h-10 px-3 bg-background border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer"
          >
            <option value="all">All Types</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed Amount</option>
            <option value="buy_x_get_y">Buy X Get Y</option>
          </select>

          <Button variant="outline" size="sm" className="h-10 bg-background">
            <Filter className="w-4 h-4 mr-2" /> Filters
          </Button>
        </div>
      </div>

      {/* Promotions Grid */}
      {filteredPromotions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-muted/20 rounded-xl border border-dashed border-border text-center">
          <Tag className="w-12 h-12 text-muted-foreground/50 mb-4" />
          <h3 className="text-lg font-semibold text-foreground">
            No promotions found
          </h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your filters or create a new campaign.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPromotions.map((promotion, idx) => (
            <motion.div
              key={promotion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 shadow-sm hover:border-primary/30 transition-all relative group"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    {promotion.type === "percentage" ? (
                      <Percent className="w-6 h-6" />
                    ) : promotion.type === "fixed" ? (
                      <Tag className="w-6 h-6" />
                    ) : (
                      <Gift className="w-6 h-6" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg">
                      {promotion.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {promotion.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={promotion.status} />
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 mb-6 py-4 border-y border-border/50">
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Discount
                  </span>
                  <span className="font-semibold text-primary">
                    {promotion.type === "percentage"
                      ? `${promotion.value}% OFF`
                      : promotion.type === "fixed"
                      ? `AED ${promotion.value} OFF`
                      : `Buy 2 Get ${promotion.value}`}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Code
                  </span>
                  <code className="font-mono font-medium text-foreground bg-muted px-2 py-0.5 rounded w-fit">
                    {promotion.code}
                  </code>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Duration
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {new Date(promotion.startDate).toLocaleDateString()} -{" "}
                    {new Date(promotion.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    Min Order
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    AED {promotion.minOrderValue}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-foreground">
                    Usage (
                    {Math.round(
                      (promotion.usageCount / promotion.usageLimit) * 100
                    )}
                    %)
                  </span>
                  <span className="font-medium text-foreground">
                    {promotion.usageCount} / {promotion.usageLimit}
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full"
                    style={{
                      width: `${Math.min(
                        (promotion.usageCount / promotion.usageLimit) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 bg-background">
                  <Eye className="w-4 h-4 mr-2" /> Details
                </Button>
                <Button variant="outline" className="flex-1 bg-background">
                  <Edit className="w-4 h-4 mr-2" /> Edit
                </Button>
                <Button
                  variant="ghost"
                  className="px-3 hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                  onClick={() => handleDelete(promotion.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal */}
      <CreatePromotionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
