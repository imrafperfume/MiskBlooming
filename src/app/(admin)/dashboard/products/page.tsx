"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Plus,
  Search,
  Filter,
  Edit,
  Eye,
  Star,
  Package,
  AlertCircle,
  CheckCircle,
  MoreHorizontal,
  Download,
  Upload,
  Trash2,
  Copy,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { gql, useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";

import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
import { useCategories } from "@/src/hooks/useCategories";

// --- GraphQL ---
const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      slug
      images {
        url
      }
      status
      quantity
      price
      compareAtPrice
      featured
      category
      sku
    }
  }
`;

const DELETE_PRODUCT = gql`
  mutation DeleteProduct($slug: String!) {
    deleteProduct(slug: $slug) {
      id
      name
      slug
    }
  }
`;

// --- Components ---

// Status Badge
const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    active: "bg-green-500/10 text-green-600 border-green-500/20",
    draft: "bg-muted text-muted-foreground border-border",
    "out-of-stock": "bg-destructive/10 text-destructive border-destructive/20",
  };

  const label = status === "out-of-stock" ? "Out of Stock" : status;
  const style = styles[status as keyof typeof styles] || styles.draft;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${style}`}
    >
      {label}
    </span>
  );
};

// Skeleton Loader
const TableSkeleton = () => (
  <div className="space-y-4">
    <div className="flex gap-4 mb-6">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="h-24 flex-1 bg-card rounded-xl border border-border animate-pulse"
        />
      ))}
    </div>
    <div className="bg-card rounded-xl border border-border p-4 space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 bg-muted/30 rounded-lg animate-pulse" />
      ))}
    </div>
  </div>
);

export default function ProductsPage() {
  const router = useRouter();

  // State
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Click outside handler for dropdown
  const actionMenuRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        actionMenuRef.current &&
        !actionMenuRef.current.contains(event.target as Node)
      ) {
        setActiveActionId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Data Fetching
  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  const { data: categories } = useCategories(["id", "name"]);

  const [deleteProduct, { loading: deleteLoading }] = useMutation(
    DELETE_PRODUCT,
    {
      refetchQueries: [GET_PRODUCTS],
      onCompleted: () => toast.success("Product deleted successfully"),
      onError: (err) => toast.error(err.message || "Failed to delete product"),
    }
  );

  const products = data?.products || [];

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter((product: any) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        product.name.toLowerCase().includes(searchLower) ||
        (product.sku && product.sku.toLowerCase().includes(searchLower));

      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "all" || product.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = useMemo(() => {
    return filteredProducts.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
  }, [filteredProducts, currentPage, itemsPerPage]);

  // Stats
  const activeCount = products.filter((p: any) => p.status === "active").length;
  const outOfStockCount = products.filter((p: any) => p.quantity === 0).length;
  const featuredCount = products.filter((p: any) => p.featured).length;

  const handleDeleteProduct = async (slug: string) => {
    setActiveActionId(null);
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;
    await deleteProduct({ variables: { slug } });
  };

  if (loading) return <TableSkeleton />;
  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <AlertTriangle className="w-12 h-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold">Error loading products</h2>
        <p className="text-muted-foreground">{error.message}</p>
      </div>
    );

  return (
    <div className="space-y-8 pb-20 w-full overflow-x-hidden">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-cormorant font-bold text-foreground">
            Product Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your inventory, prices, and stock levels.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" className="bg-background">
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button>
          <Button variant="outline" className="bg-background">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button
            variant="luxury"
            onClick={() => router.push("/dashboard/products/add")}
          >
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Products",
            value: products.length,
            icon: Package,
            color: "text-primary",
          },
          {
            label: "Active",
            value: activeCount,
            icon: CheckCircle,
            color: "text-green-600",
          },
          {
            label: "Out of Stock",
            value: outOfStockCount,
            icon: AlertCircle,
            color: "text-destructive",
          },
          {
            label: "Featured",
            value: featuredCount,
            icon: Star,
            color: "text-yellow-500",
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
            <span className="text-2xl font-bold text-foreground truncate">
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
            placeholder="Search by name or SKU..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-10 bg-background border-border"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 bg-background border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories?.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="h-10 px-3 bg-background border border-border rounded-lg text-sm focus:ring-1 focus:ring-primary focus:border-primary outline-none cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="out-of-stock">Out of Stock</option>
            <option value="draft">Draft</option>
          </select>

          <Button variant="outline" size="sm" className="h-10 bg-background">
            <Filter className="w-4 h-4 mr-2" /> More
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="bg-muted p-4 rounded-full mb-4">
                <Package className="w-8 h-8 text-muted-foreground/50" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                No products found
              </h3>
              <p className="text-muted-foreground mt-1">
                Try adjusting your search or filters to find what you're looking
                for.
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  {[
                    "Product",
                    "SKU",
                    "Category",
                    "Price",
                    "Stock",
                    "Status",
                    "Actions",
                  ].map((head) => (
                    <th
                      key={head}
                      className="px-6 py-4 font-semibold text-muted-foreground whitespace-nowrap"
                    >
                      {head}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {paginatedProducts.map((product: any) => (
                  <tr
                    key={product.id}
                    className="group hover:bg-muted/30 transition-colors"
                  >
                    {/* Product Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden border border-border bg-muted">
                          <Image
                            src={product.images?.[0]?.url || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="max-w-[200px]">
                          <div className="flex items-center gap-2">
                            <p
                              className="font-medium text-foreground truncate"
                              title={product.name}
                            >
                              {product.name}
                            </p>
                            {product.featured && (
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground truncate">
                            ID: {product.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                      {product.sku || "—"}
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md bg-primary/5 text-primary text-xs font-medium border border-primary/10 capitalize">
                        {product.category?.replace("-", " ") || "Uncategorized"}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">
                          AED {product.price}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-xs text-muted-foreground line-through">
                            AED {product.compareAtPrice}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Stock */}
                    <td className="px-6 py-4">
                      <span
                        className={`font-medium ${
                          product.quantity > 10
                            ? "text-green-600"
                            : product.quantity > 0
                            ? "text-yellow-600"
                            : "text-destructive"
                        }`}
                      >
                        {product.quantity} units
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge status={product.status} />
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Eye className="w-4 h-4 text-muted-foreground hover:text-primary" />
                          </Button>
                        </Link>

                        <Link
                          href={`/dashboard/products/add?slug=${product.slug}`}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Edit className="w-4 h-4 text-muted-foreground hover:text-primary" />
                          </Button>
                        </Link>

                        <div
                          className="relative"
                          ref={
                            activeActionId === product.id ? actionMenuRef : null
                          }
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() =>
                              setActiveActionId(
                                activeActionId === product.id
                                  ? null
                                  : product.id
                              )
                            }
                          >
                            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
                          </Button>

                          <AnimatePresence>
                            {activeActionId === product.id && (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                className="absolute right-0 top-full mt-1 w-32 bg-popover border border-border rounded-lg shadow-lg z-50 overflow-hidden"
                              >
                                <button
                                  onClick={() =>
                                    router.push(
                                      `/dashboard/products/add?slug=${product.slug}`
                                    )
                                  }
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center gap-2 text-foreground transition-colors"
                                >
                                  <Edit className="w-3.5 h-3.5" /> Edit
                                </button>
                                {/* <button
                                  onClick={() => toast.info("Duplicate feature coming soon")}
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center gap-2 text-foreground transition-colors"
                                >
                                  <Copy className="w-3.5 h-3.5" /> Duplicate
                                </button> */}
                                <button
                                  onClick={() =>
                                    handleDeleteProduct(product.slug)
                                  }
                                  className="w-full text-left px-3 py-2 text-sm hover:bg-destructive/10 text-destructive flex items-center gap-2 transition-colors border-t border-border"
                                >
                                  <Trash2 className="w-3.5 h-3.5" /> Delete
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {(currentPage - 1) * itemsPerPage + 1}
            </span>{" "}
            to{" "}
            <span className="font-medium text-foreground">
              {Math.min(currentPage * itemsPerPage, filteredProducts.length)}
            </span>{" "}
            of{" "}
            <span className="font-medium text-foreground">
              {filteredProducts.length}
            </span>{" "}
            results
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="bg-background hover:bg-muted"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Prev
            </Button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1; // Simplified logic, can be expanded for large page counts
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
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
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
