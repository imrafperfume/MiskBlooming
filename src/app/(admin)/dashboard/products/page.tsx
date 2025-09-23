"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "../../../../components/ui/Button";
import { Input } from "../../../../components/ui/Input";
// import { getAllProducts } from "@/src/hooks/getAllProducts";
import { gql, useMutation, useQuery } from "@apollo/client";
import { getStatusColor } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";
import Loading from "@/src/components/layout/Loading";
import { useCategories } from "@/src/hooks/useCategories";

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
export default function ProductsPage() {
  const router = useRouter();
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  // const [sortBy, setSortBy] = useState("name");
  // const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [deleteProduct, { loading: deleteLoading, error: deleteError }] =
    useMutation(DELETE_PRODUCT, {
      refetchQueries: [GET_PRODUCTS],
    });

  const { data, loading, error } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network",
  });
  const { data: categories } = useCategories(["id", "name"]);
  // const categories = [
  //   { value: "all", label: "All Categories" },
  //   { value: "roses", label: "Premium Roses" },
  //   { value: "mixed-arrangements", label: "Mixed Arrangements" },
  //   { value: "chocolates", label: "Premium Chocolates" },
  //   { value: "cakes", label: "Fresh Cakes" },
  //   { value: "plants", label: "Indoor Plants" },
  // ];
  const products = data?.products;
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredProducts = useMemo(() => {
    return products?.filter((product: any) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.sku.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || product.category === selectedCategory;
      const matchesStatus =
        selectedStatus === "all" || product.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchTerm, selectedCategory, selectedStatus]);

  const totalPages = Math.ceil(filteredProducts?.length / itemsPerPage);
  if (loading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;

  const activeCount = products.filter((p: any) => p.status === "active").length;
  const outOfStock = products.filter((p: any) => p.quantity === 0).length;
  const Featured = products.filter((p: any) => p.featured).length;
  //DELETE PRODUCT::::::::::::::::::::::::::::::::::::::::::::::

  const handleDeleteProduct = async (slug: string) => {
    console.log("🚀 ~ handleDeleteProduct ~ slug:", slug);
    try {
      const ok = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!ok) return;

      await deleteProduct({
        variables: { slug },
      });

      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Failed to delete product!");
    }
  };
  return (
    <div className="space-y-8  min-w-[100%]">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
        <div>
          <h1 className="text-3xl font-cormorant font-bold text-charcoal-900">
            Product Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your flower and gift inventory
          </p>
        </div>
        <div className="flex items-center sm:space-x-4 mt-4 gap-4 lg:mt-0 flex-wrap">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            variant="luxury"
            onClick={() => router.push("/dashboard/products/add")}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Products</p>
              <p className="text-2xl font-bold text-charcoal-900">
                {products.length}
              </p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active</p>
              <p className="text-2xl font-bold text-green-600">{activeCount}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Out of Stock</p>
              <p className="text-2xl font-bold text-red-600">
                {outOfStock || 0}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-luxury-600">
                {Featured || 0}
              </p>
            </div>
            <Star className="w-8 h-8 text-luxury-500" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        className="bg-white rounded-xl sm:p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search products or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-luxury-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="out-of-stock">Out of Stock</option>
            <option value="draft">Draft</option>
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </motion.div>

      {/* Products Table */}
      <motion.div
        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="sm:p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-charcoal-900">
              Products ({filteredProducts.length})
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto min-h-[450px]">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  SKU
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product: any, index: any) => (
                <motion.tr
                  key={product.id}
                  className="hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <td className="sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-12 w-12">
                        <Image
                          className="h-12 w-12 rounded-lg object-cover"
                          src={product?.images[0].url || "/placeholder.svg"}
                          alt={product.name}
                          width={48}
                          height={48}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-charcoal-900 truncate">
                            {product.name}
                          </p>
                          {product.featured && (
                            <Star className="w-4 h-4 text-yellow-400 ml-2 fill-current" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          ID: {product.id}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-mono text-gray-900">
                      {product.sku}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-luxury-100 text-luxury-800 capitalize">
                      {product.category.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm">
                      <span className="font-medium text-charcoal-900">
                        AED {product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-gray-500 line-through ml-2">
                          AED {product.originalPrice}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`text-sm font-medium ${
                        product.stock > 10
                          ? "text-green-600"
                          : product.quantity > 0
                          ? "text-yellow-600"
                          : "text-red-600"
                      }`}
                    >
                      {product.quantity} units
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm text-charcoal-900">
                        {/* {product.rating} ({product.reviews}) */} 0
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                        product.status
                      )}`}
                    >
                      {product.status.replace("-", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link href={`/products/${product.slug}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <Link
                          href={`/dashboard/products/add?slug=${product.slug}`}
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <div className="relative inline-block text-left">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setOpenSlug(
                              openSlug === product.slug ? null : product.slug
                            )
                          }
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>

                        {openSlug === product.slug && (
                          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-sm z-50">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() =>
                                router.push(
                                  `/dashboard/products/add?slug=${product.slug}`
                                )
                              }
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
                              onClick={() =>
                                product && handleDeleteProduct(product?.slug)
                              }
                            >
                              Delete
                            </Button>
                            {/* <Button
                              variant="ghost"
                              size="sm"
                              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                              onClick={() => alert("Duplicate clicked")}
                            >
                              Duplicate
                            </Button> */}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-charcoal-900 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </motion.div>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1}–
            {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{" "}
            {filteredProducts?.length} products
          </p>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant="outline"
                size="sm"
                className={
                  currentPage === i + 1
                    ? "bg-luxury-500 text-white"
                    : "text-gray-600"
                }
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
