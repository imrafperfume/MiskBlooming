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
  AlertCircle,
  ImageIcon,
  LayoutGrid,
  ShoppingBag,
  Globe,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { toast } from "sonner";
import { CreatePromotionModal } from "@/src/components/dashboard/CreatePromotionModal";

// --- Updated Types to match Modal ---
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
  bannerImage?: string;
  scope: {
    target: "all" | "category" | "product";
    categories?: string[];
    products?: string[];
  };
}

// --- Updated Mock Data ---
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
    bannerImage:
      "https://images.unsplash.com/photo-1518191766482-844ed3c65070?q=80&w=800&auto=format&fit=crop",
    scope: { target: "category", categories: ["Flowers", "Bouquets"] },
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
    bannerImage:
      "https://images.unsplash.com/photo-1599110364762-ecd45ec44253?q=80&w=800&auto=format&fit=crop",
    scope: { target: "all" },
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
    scope: { target: "all" },
  },
];

// --- Scope Badge Component ---
const ScopeIndicator = ({ scope }: { scope: Promotion["scope"] }) => {
  const configs = {
    all: {
      label: "Entire Store",
      icon: Globe,
      color: "text-blue-600 bg-blue-50",
    },
    category: {
      label: "Categories",
      icon: LayoutGrid,
      color: "text-purple-600 bg-purple-50",
    },
    product: {
      label: "Specific Products",
      icon: ShoppingBag,
      color: "text-orange-600 bg-orange-50",
    },
  };

  const config = configs[scope.target];
  const Icon = config.icon;

  return (
    <div
      className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${config.color}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    active: "bg-green-500 text-white border-green-600",
    scheduled: "bg-blue-500 text-white border-blue-600",
    expired: "bg-destructive text-white border-destructive",
    paused: "bg-orange-500 text-white border-orange-600",
    default: "bg-muted text-muted-foreground border-border",
  };
  const style = styles[status as keyof typeof styles] || styles.default;
  return (
    <span
      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shadow-sm border ${style}`}
    >
      {status}
    </span>
  );
};

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scopeFilter, setScopeFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const filteredPromotions = useMemo(() => {
    return promotions.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.code.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesScope =
        scopeFilter === "all" || p.scope.target === scopeFilter;
      return matchesSearch && matchesStatus && matchesScope;
    });
  }, [promotions, searchTerm, statusFilter, scopeFilter]);

  const stats = useMemo(
    () => ({
      total: promotions.length,
      active: promotions.filter((p) => p.status === "active").length,
      revenue: promotions.reduce((sum, p) => sum + p.revenue, 0),
      usage: promotions.reduce((sum, p) => sum + p.usageCount, 0),
    }),
    [promotions]
  );

  const handleCreate = (newPromo: Promotion) => {
    setPromotions((prev) => [newPromo, ...prev]);
    setIsCreateModalOpen(false);
    toast.success("Marketing campaign published successfully!");
  };

  const handleDelete = (id: string) => {
    if (confirm("Permanently remove this campaign?")) {
      setPromotions((prev) => prev.filter((p) => p.id !== id));
      toast.success("Campaign deleted");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 p-4 lg:p-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-cormorant font-bold text-foreground">
            Marketing & Banners
          </h1>
          <p className="text-muted-foreground mt-1">
            Design your storefront offers and target specific categories.
          </p>
        </div>
        <Button
          variant="luxury"
          size="lg"
          onClick={() => setIsCreateModalOpen(true)}
        >
          <Plus className="w-5 h-5 mr-2" /> Create New Campaign
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Active",
            value: stats.active,
            icon: CheckCircle,
            color: "text-green-600",
          },
          {
            label: "Total Revenue",
            value: `AED ${stats.revenue.toLocaleString()}`,
            icon: TrendingUp,
            color: "text-primary",
          },
          {
            label: "Usage",
            value: stats.usage,
            icon: Users,
            color: "text-blue-600",
          },
          {
            label: "Campaigns",
            value: stats.total,
            icon: Tag,
            color: "text-muted-foreground",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-xl p-5 flex items-center gap-4 shadow-sm"
          >
            <div className={`p-3 rounded-lg bg-muted/50 ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-card p-4 rounded-xl border border-border shadow-sm">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search code or campaign..."
            className="pl-10 bg-background"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <select
            className="bg-background border border-border rounded-lg px-3 h-10 text-sm outline-none focus:ring-1 focus:ring-primary min-w-[130px]"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="scheduled">Scheduled</option>
          </select>
          <select
            className="bg-background border border-border rounded-lg px-3 h-10 text-sm outline-none focus:ring-1 focus:ring-primary min-w-[130px]"
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value)}
          >
            <option value="all">All Targets</option>
            <option value="all">Store-wide</option>
            <option value="category">Categories</option>
            <option value="product">Products</option>
          </select>
        </div>
      </div>

      {/* Promotions List */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPromotions.map((promo, idx) => (
          <motion.div
            key={promo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="group bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
          >
            {/* Banner Preview */}
            <div className="relative h-44 w-full bg-muted overflow-hidden shrink-0">
              {promo.bannerImage ? (
                <img
                  src={promo.bannerImage}
                  alt={promo.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30 gap-2 font-bold uppercase text-[10px] tracking-widest">
                  <ImageIcon className="w-10 h-10" /> No Image
                </div>
              )}

              <div className="absolute top-3 left-3 flex flex-col gap-2">
                <StatusBadge status={promo.status} />
                <ScopeIndicator scope={promo.scope} />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                <div>
                  <p className="text-white/60 text-[9px] uppercase font-bold tracking-[0.2em]">
                    Promo Code
                  </p>
                  <p className="text-white font-mono text-xl font-black">
                    {promo.code}
                  </p>
                </div>
                <div className="bg-primary text-white px-3 py-1 rounded-full text-xs font-black shadow-lg">
                  {promo.type === "percentage"
                    ? `${promo.value}% OFF`
                    : `AED ${promo.value} OFF`}
                </div>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 flex flex-col flex-1">
              <div className="mb-4">
                <h3 className="text-lg font-bold text-foreground leading-tight group-hover:text-primary transition-colors line-clamp-1">
                  {promo.name}
                </h3>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2 min-h-[32px]">
                  {promo.description}
                </p>
              </div>

              {/* Target Details (If categories) */}
              {promo.scope.target === "category" && promo.scope.categories && (
                <div className="mb-4 flex flex-wrap gap-1">
                  {promo.scope.categories.map((cat) => (
                    <span
                      key={cat}
                      className="text-[9px] bg-muted px-2 py-0.5 rounded-full font-bold text-muted-foreground"
                    >
                      #{cat}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats & Progress */}
              <div className="mt-auto space-y-4 pt-4 border-t border-border/50">
                <div>
                  <div className="flex justify-between text-[10px] mb-1.5 font-bold uppercase tracking-tight">
                    <span className="text-muted-foreground">Usage Limit</span>
                    <span className="text-foreground">
                      {promo.usageCount} / {promo.usageLimit}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${
                          (promo.usageCount / promo.usageLimit) * 100
                        }%`,
                      }}
                      className="h-full bg-primary"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center bg-muted/30 p-2 rounded-lg">
                  <div className="text-center flex-1 border-r border-border/50">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground">
                      Revenue
                    </p>
                    <p className="text-sm font-black">
                      AED {promo.revenue.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center flex-1">
                    <p className="text-[9px] uppercase font-bold text-muted-foreground">
                      Min Order
                    </p>
                    <p className="text-sm font-black">
                      AED {promo.minOrderValue}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 h-9 text-xs font-bold"
                  >
                    <Edit className="w-3.5 h-3.5 mr-2" /> Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/5"
                    onClick={() => handleDelete(promo.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create Modal */}
      <CreatePromotionModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
