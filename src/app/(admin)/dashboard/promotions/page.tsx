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
  Ghost,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../../../../components/ui/button";
import { Input } from "../../../../components/ui/input";
import { toast } from "sonner";
import {
  CreatePromotionModal,
  PromotionInput,
} from "@/src/components/dashboard/CreatePromotionModal";
import { useMutation, useQuery } from "@apollo/client";
import {
  CREATE_PROMOTION,
  DELETE_PROMOTION,
  GET_PROMOTIONS,
  UPDATE_PROMOTION,
} from "@/src/modules/promotion/operation";
import Loading from "@/src/components/layout/Loading";

// --- Types ---
export type DiscountType = "PERCENTAGE" | "FIXED";
export type PromotionStatus = "ACTIVE" | "PAUSED" | "DRAFT" | "EXPIRED";
export type ScopeType = "ALL" | "CATEGORY" | "PRODUCT";

export interface Promotion {
  id: string;
  name: string;
  discountType: DiscountType;
  discountValue: number;
  startDate: string; // ISO String from DB
  endDate: string; // ISO String from DB
  isActive: boolean;
  imageUrl: string;
  scope: ScopeType;
  promoCode: string;
  status: PromotionStatus;
  categories: string[];
  products: string[]; // IDs
  createdAt?: string;
  updatedAt?: string;
}

export default function PromotionsPage() {
  // --- Data Fetching ---
  const { data, loading, error, refetch } = useQuery(GET_PROMOTIONS, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const [createPromotion] = useMutation(CREATE_PROMOTION);
  const [updatePromotion] = useMutation(UPDATE_PROMOTION);
  const [deletePromotion] = useMutation(DELETE_PROMOTION);

  // --- UI State ---
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [scopeFilter, setScopeFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null); // For individual button loading states

  const promotions: Promotion[] = data?.getPromotions || [];

  // --- Handlers ---

  const handleSave = async (formData: PromotionInput) => {
    // Sanitizing the payload for GraphQL
    const payload = {
      name: formData.name,
      promoCode: formData.promoCode,
      discountType: formData.discountType,
      discountValue: Number(formData.discountValue),
      startDate: new Date(formData.startDate).toISOString(), // Ensure ISO format for DB
      endDate: new Date(formData.endDate).toISOString(),
      scope: formData.scope,
      status: formData.status,
      isActive: formData.status === "ACTIVE",
      imageUrl: formData.imageUrl,
      categories: formData.categories,
      products: formData.products,
    };

    try {
      if (editingPromo?.id) {
        // Update
        await updatePromotion({
          variables: {
            id: editingPromo.id,
            input: payload,
          },
        });
        toast.success("Campaign updated successfully");
      } else {
        // Create
        await createPromotion({
          variables: {
            input: payload,
          },
        });
        toast.success("New campaign published");
      }

      await refetch();
      setIsModalOpen(false);
      setEditingPromo(null);
    } catch (err: any) {
      console.error("Save Error:", err);
      toast.error(err.message || "Failed to save campaign");
      throw err; // Re-throw to let Modal stop loading state if needed
    }
  };

  const handleDelete = async (id: string) => {
    // In production, use a custom modal here instead of window.confirm
    if (
      !confirm(
        "Are you sure you want to delete this campaign? This action cannot be undone."
      )
    )
      return;

    setActionLoadingId(id);
    try {
      await deletePromotion({
        variables: { id },
      });
      toast.success("Campaign deleted");
      await refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    } finally {
      setActionLoadingId(null);
    }
  };

  const toggleStatus = async (id: string, currentStatus: PromotionStatus) => {
    const newStatus: PromotionStatus =
      currentStatus === "ACTIVE" ? "PAUSED" : "ACTIVE";
    setActionLoadingId(id);

    try {
      await updatePromotion({
        variables: {
          id,
          input: {
            status: newStatus,
            isActive: newStatus === "ACTIVE",
          },
        },
      });
      toast.success(
        `Campaign ${newStatus === "ACTIVE" ? "Resumed" : "Paused"}`
      );
      await refetch();
    } catch (error) {
      toast.error("Status update failed");
    } finally {
      setActionLoadingId(null);
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Code copied to clipboard");
  };

  // --- Derived State & Stats ---

  const filteredPromotions = useMemo(() => {
    return promotions.filter((p) => {
      const sTerm = searchTerm.toLowerCase();
      const matchesSearch =
        (p.name?.toLowerCase() || "").includes(sTerm) ||
        (p.promoCode?.toLowerCase() || "").includes(sTerm);
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

  // --- Render ---

  if (loading && !data) return <Loading />;
  if (error)
    return (
      <div className="p-10 text-center text-red-500">
        Error loading promotions. Please refresh.
      </div>
    );

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 pb-24 p-4 lg:p-6 bg-background min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-8">
        <div>
          <h1 className="text-4xl lg:text-5xl font-cormorant font-bold text-foreground tracking-tight">
            Marketing & <span className="text-primary">Banners</span>
          </h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Manage your store's promotional offers and visual campaigns.
          </p>
        </div>
        <Button
          variant="luxury"
          size="lg"
          className="shadow-xl shadow-primary/10 transition-transform hover:scale-105"
          onClick={() => {
            setEditingPromo(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-5 h-5 mr-2" /> New Campaign
        </Button>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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
            color: "text-orange-500",
          },
          {
            label: "Conversion Rate",
            value: "N/A",
            icon: TrendingUp,
            color: "text-blue-500",
          }, // Placeholder for future analytics
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-card border border-border hover:border-primary/30 rounded-2xl p-6 transition-all shadow-sm hover:shadow-md"
          >
            <div className="flex justify-between items-start">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-3xl font-bold text-foreground">
                {stat.value}
              </span>
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-4">
              {stat.label}
            </p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-center bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative w-full lg:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search campaign name or code..."
            className="pl-12 bg-background border-border h-12 rounded-xl focus:ring-primary/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2 w-full lg:w-auto">
          <select
            className="bg-background border border-border rounded-xl px-4 h-12 text-sm font-bold outline-none focus:ring-1 focus:ring-primary min-w-[140px] text-foreground cursor-pointer hover:bg-muted/50 transition-colors"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Status: All</option>
            <option value="ACTIVE">Active</option>
            <option value="PAUSED">Paused</option>
          </select>
          <select
            className="bg-background border border-border rounded-xl px-4 h-12 text-sm font-bold outline-none focus:ring-1 focus:ring-primary min-w-[140px] text-foreground cursor-pointer hover:bg-muted/50 transition-colors"
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value)}
          >
            <option value="all">Target: All</option>
            <option value="ALL">Store-wide</option>
            <option value="CATEGORY">Categories</option>
            <option value="PRODUCT">Products</option>
          </select>
        </div>
      </div>

      {/* Grid Content */}
      {filteredPromotions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed border-border rounded-[2rem]">
          <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            <Ghost className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold text-foreground">
            No campaigns found
          </h3>
          <p className="text-muted-foreground max-w-sm mt-2">
            We couldn't find any promotions matching your search filters. Try
            adjusting your terms or create a new one.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setScopeFilter("all");
            }}
          >
            Clear Filters
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPromotions.map((promo) => (
              <motion.div
                layout
                key={promo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group bg-card border border-border rounded-[2rem] overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col hover:shadow-2xl"
              >
                {/* Banner Image */}
                <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                  {promo.imageUrl ? (
                    <img
                      src={promo.imageUrl}
                      alt={promo.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground/20 bg-muted">
                      <ImageIcon size={48} />
                    </div>
                  )}

                  <div className="absolute top-4 left-4 z-10">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-md shadow-sm ${
                        promo.status === "ACTIVE"
                          ? "bg-green-500/90 text-white border-transparent"
                          : "bg-background/90 text-foreground border-border"
                      }`}
                    >
                      {promo.status}
                    </span>
                  </div>

                  {/* Overlay Gradient */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent h-2/3" />

                  {/* Overlay Content */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end text-white">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyCode(promo.promoCode);
                      }}
                      className="flex items-center gap-2 bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1.5 rounded-xl hover:bg-white/30 transition-all group/code"
                    >
                      <span className="font-mono font-bold text-sm tracking-wider">
                        {promo.promoCode}
                      </span>
                      <Copy
                        size={12}
                        className="opacity-70 group-hover/code:opacity-100"
                      />
                    </button>

                    <div className="bg-primary text-secondary px-4 py-1.5 rounded-xl font-black text-sm shadow-lg">
                      {promo.discountType === "PERCENTAGE"
                        ? `${promo.discountValue}% OFF`
                        : `AED ${promo.discountValue}`}
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex flex-col flex-1 gap-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3
                        className="text-xl font-bold text-foreground line-clamp-1"
                        title={promo.name}
                      >
                        {promo.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
                        <Calendar size={14} className="text-primary" />
                        <span>
                          {new Date(promo.startDate).toLocaleDateString()} —{" "}
                          {new Date(promo.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Scope Icon */}
                    <div className="p-2.5 bg-muted rounded-xl border border-border text-primary shrink-0">
                      {promo.scope === "ALL" ? (
                        <Globe size={18} />
                      ) : promo.scope === "CATEGORY" ? (
                        <LayoutGrid size={18} />
                      ) : (
                        <ShoppingBag size={18} />
                      )}
                    </div>
                  </div>

                  {/* Tags (Categories/Products) */}
                  {promo.scope === "CATEGORY" &&
                    promo.categories?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {promo.categories.slice(0, 3).map((cat) => (
                          <span
                            key={cat}
                            className="text-[9px] bg-muted px-2 py-1 rounded-md font-bold text-muted-foreground uppercase border border-border"
                          >
                            {cat}
                          </span>
                        ))}
                        {promo.categories.length > 3 && (
                          <span className="text-[9px] px-2 py-1 text-muted-foreground">
                            + {promo.categories.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                  {/* Footer Actions */}
                  <div className="pt-4 border-t border-border mt-auto flex items-center justify-between gap-3">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={actionLoadingId === promo.id}
                        className="rounded-xl border-border h-9 font-bold text-xs"
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
                        disabled={actionLoadingId === promo.id}
                        className="w-9 h-9 rounded-xl text-destructive hover:bg-destructive/10"
                        onClick={() => handleDelete(promo.id)}
                      >
                        {actionLoadingId === promo.id ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    <button
                      disabled={actionLoadingId === promo.id}
                      onClick={() => toggleStatus(promo.id, promo.status)}
                      className={`p-1.5 rounded-full transition-all disabled:opacity-50 ${
                        promo.status === "ACTIVE"
                          ? "text-primary hover:bg-primary/10"
                          : "text-green-600 hover:bg-green-600/10"
                      }`}
                      title={
                        promo.status === "ACTIVE"
                          ? "Pause Campaign"
                          : "Resume Campaign"
                      }
                    >
                      {actionLoadingId === promo.id ? (
                        <Loader2 className="w-6 h-6 animate-spin p-1" />
                      ) : promo.status === "ACTIVE" ? (
                        <PauseCircle size={28} />
                      ) : (
                        <PlayCircle size={28} />
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      <CreatePromotionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPromo(null);
        }}
        onSave={handleSave}
        // Critical: Ensure dates are pure strings (YYYY-MM-DD) for the input fields
        initialData={
          editingPromo
            ? {
                id: editingPromo.id,
                name: editingPromo.name,
                promoCode: editingPromo.promoCode,
                discountType: editingPromo.discountType,
                discountValue: editingPromo.discountValue,
                startDate: new Date(editingPromo.startDate).toISOString(),
                endDate: new Date(editingPromo.endDate).toISOString(),
                scope: editingPromo.scope,
                status: editingPromo.status,
                isActive: editingPromo.isActive,
                imageUrl: editingPromo.imageUrl,
                categories: editingPromo.categories,
                products: editingPromo.products,
              }
            : null
        }
      />
    </div>
  );
}
