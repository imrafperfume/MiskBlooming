"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Tag,
  TrendingUp,
  CheckCircle,
  ImageIcon,
  LayoutGrid,
  ShoppingBag,
  Globe,
  Calendar,
  Copy,
  PauseCircle,
  PlayCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { toast } from "sonner";
import { CreatePromotionModal } from "@/src/components/dashboard/CreatePromotionModal";

export type DiscountType = "PERCENTAGE" | "FIXED";
export type PromotionStatus = "ACTIVE" | "EXPIRED" | "PAUSED";
export type ScopeType = "ALL" | "CATEGORY" | "PRODUCT";

export interface Promotion {
  id: string;
  name: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string | Date;
  endDate: string | Date;
  isActive: boolean;
  imageUrl: string;
  scope: ScopeType;
  promoCode: string;
  status: PromotionStatus;
  categories: string[];
  products: string[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

const initialPromotions: Promotion[] = [
  {
    id: "1",
    name: "Valentine's Day Special",
    discountType: "PERCENTAGE",
    discountValue: 20,
    promoCode: "VALENTINE20",
    startDate: "2024-02-01",
    endDate: "2024-02-14",
    status: "ACTIVE",
    isActive: true,
    imageUrl:
      "https://images.unsplash.com/photo-1518191766482-844ed3c65070?q=80&w=800&auto=format&fit=crop",
    scope: "CATEGORY",
    categories: ["Flowers", "Bouquets"],
    products: [],
  },
];

export default function PromotionsPage() {
  const [promotions, setPromotions] = useState<Promotion[]>(initialPromotions);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scopeFilter, setScopeFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);

  // --- Handlers ---
  const handleCreateOrUpdate = (promo: Promotion) => {
    if (editingPromo) {
      setPromotions((prev) => prev.map((p) => (p.id === promo.id ? promo : p)));
      toast.success("Campaign updated successfully");
    } else {
      setPromotions((prev) => [promo, ...prev]);
      toast.success("New campaign published");
    }
    setIsModalOpen(false);
    setEditingPromo(null);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      setPromotions((prev) => prev.filter((p) => p.id !== id));
      toast.success("Campaign removed");
    }
  };

  const toggleStatus = (id: string) => {
    setPromotions((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newStatus = p.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
          toast.info(
            `Campaign ${newStatus === "ACTIVE" ? "Resumed" : "Paused"}`
          );
          return { ...p, status: newStatus as PromotionStatus };
        }
        return p;
      })
    );
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  // --- Filter Logic ---
  const filteredPromotions = useMemo(() => {
    return promotions.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.promoCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || p.status === statusFilter;
      const matchesScope = scopeFilter === "all" || p.scope === scopeFilter;
      return matchesSearch && matchesStatus && matchesScope;
    });
  }, [promotions, searchTerm, statusFilter, scopeFilter]);

  const stats = useMemo(
    () => ({
      total: promotions.length,
      active: promotions.filter((p) => p.status === "ACTIVE").length,
      paused: promotions.filter((p) => p.status === "PAUSED").length,
    }),
    [promotions]
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-20 p-4 lg:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-cormorant font-bold text-foreground">
            Marketing & Banners
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage storefront promotions and featured homepage banners.
          </p>
        </div>
        <Button
          variant="luxury"
          size="lg"
          onClick={() => {
            setEditingPromo(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-5 h-5 mr-2" /> Create Campaign
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Campaigns",
            value: stats.total,
            icon: Tag,
            color: "text-primary",
          },
          {
            label: "Active Now",
            value: stats.active,
            icon: CheckCircle,
            color: "text-green-600",
          },
          {
            label: "Paused",
            value: stats.paused,
            icon: PauseCircle,
            color: "text-amber-500",
          },
          {
            label: "Performance",
            value: "84%",
            icon: TrendingUp,
            color: "text-blue-600",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm hover:border-primary/50 transition-colors"
          >
            <div className={`p-3 rounded-xl bg-muted ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-card p-4 rounded-2xl border border-border">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search campaign name or code..."
            className="pl-10 bg-background border-border"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <select
            className="bg-background border border-border rounded-xl px-4 h-11 text-sm outline-none focus:ring-1 focus:ring-primary min-w-[140px] text-foreground"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
            <option value="EXPIRED">Expired</option>
          </select>
          <select
            className="bg-background border border-border rounded-xl px-4 h-11 text-sm outline-none focus:ring-1 focus:ring-primary min-w-[140px] text-foreground"
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value)}
          >
            <option value="all">All Targets</option>
            <option value="ALL">Store-wide</option>
            <option value="CATEGORY">Categories</option>
            <option value="PRODUCT">Products</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredPromotions.map((promo) => (
            <motion.div
              layout
              key={promo.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-card border border-border rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Header */}
              <div className="relative aspect-video bg-muted overflow-hidden">
                {promo.imageUrl ? (
                  <img
                    src={promo.imageUrl}
                    alt={promo.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground/30">
                    <ImageIcon className="w-12 h-12" />
                  </div>
                )}

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-tight border shadow-sm ${
                      promo.status === "ACTIVE"
                        ? "bg-green-500 text-white border-green-600"
                        : promo.status === "PAUSED"
                        ? "bg-amber-500 text-white border-amber-600"
                        : "bg-destructive text-white border-destructive"
                    }`}
                  >
                    {promo.status}
                  </span>
                </div>

                {/* Promo Code Float */}
                <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                  <button
                    onClick={() => copyCode(promo.promoCode)}
                    className="flex items-center gap-2 bg-background/90 backdrop-blur-md border border-border px-3 py-1.5 rounded-xl hover:bg-primary hover:text-secondary transition-all group/code shadow-lg"
                  >
                    <span className="font-mono font-bold text-sm tracking-widest">
                      {promo.promoCode}
                    </span>
                    <Copy className="w-3 h-3 opacity-50 group-hover/code:opacity-100" />
                  </button>
                  <div className="bg-primary text-secondary px-4 py-1.5 rounded-xl font-black text-sm shadow-lg">
                    {promo.discountType === "PERCENTAGE"
                      ? `${promo.discountValue}% OFF`
                      : `AED ${promo.discountValue} OFF`}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-foreground leading-tight group-hover:text-primary transition-colors">
                      {promo.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground font-medium">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>
                        {new Date(promo.startDate).toLocaleDateString()} -{" "}
                        {new Date(promo.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 bg-muted rounded-xl">
                    {promo.scope === "ALL" ? (
                      <Globe className="w-4 h-4 text-primary" />
                    ) : promo.scope === "CATEGORY" ? (
                      <LayoutGrid className="w-4 h-4 text-primary" />
                    ) : (
                      <ShoppingBag className="w-4 h-4 text-primary" />
                    )}
                  </div>
                </div>

                {promo.scope === "CATEGORY" && (
                  <div className="flex flex-wrap gap-1.5">
                    {promo.categories.map((cat) => (
                      <span
                        key={cat}
                        className="text-[10px] bg-muted px-2.5 py-1 rounded-lg font-bold text-muted-foreground uppercase border border-border"
                      >
                        #{cat}
                      </span>
                    ))}
                  </div>
                )}

                <div className="pt-4 border-t border-border mt-auto flex items-center justify-between">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-border px-4"
                      onClick={() => {
                        setEditingPromo(promo);
                        setIsModalOpen(true);
                      }}
                    >
                      <Edit className="w-3.5 h-3.5 mr-2" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-10 rounded-xl text-destructive hover:bg-destructive/10"
                      onClick={() => handleDelete(promo.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <button
                    onClick={() => toggleStatus(promo.id)}
                    className={`p-2 rounded-xl transition-all ${
                      promo.status === "ACTIVE"
                        ? "text-amber-500 hover:bg-amber-50"
                        : "text-green-500 hover:bg-green-50"
                    }`}
                    title={
                      promo.status === "ACTIVE"
                        ? "Pause Campaign"
                        : "Resume Campaign"
                    }
                  >
                    {promo.status === "ACTIVE" ? (
                      <PauseCircle className="w-6 h-6" />
                    ) : (
                      <PlayCircle className="w-6 h-6" />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <CreatePromotionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPromo(null);
        }}
        onSave={handleCreateOrUpdate}
        // Assuming your modal will accept initialData for editing:
        // initialData={editingPromo}
      />
    </div>
  );
}
