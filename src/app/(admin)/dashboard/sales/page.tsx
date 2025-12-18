"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import Image from "next/image";
import { useMutation, useQuery } from "@apollo/client";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Receipt,
  ShoppingBag,
  X,
  Gift,
  RotateCcw,
  Loader2,
} from "lucide-react";

import Loading from "@/src/components/layout/Loading";
import { GET_PRODUCTS } from "@/src/modules/product/operations";
import { CREATE_SALE } from "@/src/modules/sales/oprations";

// --- Types ---
type Product = {
  id: string;
  name: string;
  price: number;
  category?: string;
  sku?: string;
  stock?: number;
  images?: { url: string }[];
};

type CartItem = Product & { qty: number };

// --- Helper: Currency Formatter ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 2,
  }).format(amount);
};

export default function POSPage() {
  // --- State ---
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [visible, setVisible] = useState<number>(20);
  const [search, setSearch] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);

  // Financial State
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [paidAmount, setPaidAmount] = useState<string>("");
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [isGift, setIsGift] = useState<boolean>(false);

  // Data Fetching
  const { data, loading: productsLoading } = useQuery(GET_PRODUCTS, {
    fetchPolicy: "cache-and-network",
  });

  const [createSale, { loading: creatingSale }] = useMutation(CREATE_SALE);

  const products: Product[] = data?.products || [];

  // --- Effects ---
  useEffect(() => {
    if (products) {
      setFiltered(products);
    }
  }, [products]);

  // Infinite Scroll Observer
  const loaderRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisible((prev) => prev + 20);
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [filtered]);

  // --- Logic ---
  const handleSearch = (text: string) => {
    setSearch(text);
    if (!text.trim()) {
      setFiltered(products);
      return;
    }
    const lower = text.toLowerCase();
    const res = products.filter(
      (p) =>
        p.name.toLowerCase().includes(lower) ||
        p.sku?.toLowerCase().includes(lower)
    );
    setFiltered(res);
    setVisible(20);
  };

  const addToCart = (p: Product) => {
    setCart((prev) => {
      const exist = prev.find((i) => i.id === p.id);
      if (exist) {
        return prev.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...p, qty: 1 }];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, qty: Math.max(1, item.qty + delta) };
        }
        return item;
      })
    );
  };

  const removeItem = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    if (confirm("Are you sure you want to clear the cart?")) {
      setCart([]);
      setPaidAmount("");
      setDiscountPercent(0);
    }
  };

  // --- Calculations ---
  const { subTotal, discountAmount, taxAmount, grandTotal, changeDue } =
    useMemo(() => {
      const sub = cart.reduce((a, b) => a + b.price * b.qty, 0);
      const disc = (sub * discountPercent) / 100;
      const taxable = sub - disc;
      const tax = taxable * 0.05; // 5% VAT
      const total = taxable + tax;

      const paid = parseFloat(paidAmount) || 0;
      const change = paymentMethod === "cash" ? paid - total : 0;

      return {
        subTotal: sub,
        discountAmount: disc,
        taxAmount: tax,
        grandTotal: total,
        changeDue: change,
      };
    }, [cart, discountPercent, paidAmount, paymentMethod]);

  const visibleProducts = filtered.slice(0, visible);

  const handleCreateOrder = async () => {
    if (cart.length === 0) return;

    try {
      const { data: saleData } = await createSale({
        variables: {
          subtotal: Number(subTotal.toFixed(2)),
          grandTotal: Number(grandTotal.toFixed(2)),
          vat: Number(taxAmount.toFixed(2)),
          discount: Number(discountAmount.toFixed(2)),
          paymentMethod: paymentMethod === "cash" ? "CASH" : "ONLINE",
          giftCard: isGift,
          CashRecived: paymentMethod === "cash" ? Number(paidAmount) : null,
          items: cart.map((i) => ({
            productId: i.id,
            quantity: i.qty,
          })),
        },
      });

      const newSaleId = saleData?.createSale?.id;
      console.log("🚀 ~ handleCreateOrder ~ newSaleId:", newSaleId);

      if (newSaleId) {
        toast.success("Order processed successfully");
        // Open Invoice
        window.open(`/dashboard/sales/invoice/${newSaleId}`, "_blank");

        // Reset State
        setCart([]);
        setPaidAmount("");
        setDiscountPercent(0);
        setIsGift(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to process order. Please try again.");
    }
  };

  if (productsLoading) return <Loading />;

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground">
      {/* --- LEFT COLUMN: PRODUCT CATALOG --- */}
      <div className="flex-1 flex flex-col h-full min-w-0 border-r border-border">
        {/* Header / Search */}
        <header className="border-b border-border px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0 bg-background/50 backdrop-blur-sm z-10">
          <div>
            <h1 className="text-2xl font-bold text-primary font-cormorant">
              Sales Terminal
            </h1>
            <p className="text-xs text-muted-foreground">
              Select products to add to cart
            </p>
          </div>

          <div className="relative w-full max-w-md group">
            <Search
              className="absolute top-1/2 -translate-y-1/2 left-3 text-muted-foreground group-focus-within:text-primary transition-colors"
              size={18}
            />
            <input
              autoFocus
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by name, SKU..."
              className="w-full h-10 pl-10 pr-10 rounded-xl border border-input bg-background text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground"
            />
            {search && (
              <button
                onClick={() => handleSearch("")}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-muted-foreground hover:text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </header>

        {/* Product Grid */}
        <main className="flex-1 overflow-y-auto p-6 bg-muted/10 scrollbar-hide">
          {visibleProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
              <Search size={64} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm">Try adjusting your search query</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 pb-10">
              {visibleProducts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="group relative flex flex-col bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-200 text-left"
                >
                  <div className="relative w-full aspect-square bg-muted">
                    <Image
                      src={p.images?.[0]?.url || "/placeholder.png"}
                      alt={p.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                  </div>

                  <div className="p-3 flex flex-col flex-1 w-full">
                    <h3 className="font-semibold text-card-foreground text-sm line-clamp-2 leading-tight mb-2 h-10">
                      {p.name}
                    </h3>
                    <div className="mt-auto flex items-center justify-between">
                      <span className="font-bold text-primary">
                        AED {p.price}
                      </span>
                      <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                        <Plus size={14} />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Loader Trigger */}
          {visible < filtered.length && (
            <div ref={loaderRef} className="py-8 flex justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </main>
      </div>

      {/* --- RIGHT COLUMN: CART --- */}
      <aside className="w-[380px] xl:w-[420px] bg-card border-l border-border flex flex-col h-full shadow-xl z-20">
        {/* Cart Header */}
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-card">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-primary" size={20} />
            <h2 className="font-bold text-lg text-card-foreground">
              Current Order
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded-md">
              {cart.reduce((a, b) => a + b.qty, 0)} Items
            </span>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                title="Clear Cart"
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-4">
              <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
                <Receipt size={32} className="opacity-50" />
              </div>
              <p className="text-sm font-medium">Order is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group"
              >
                {/* Thumbnail */}
                <div className="relative w-14 h-14 rounded-md overflow-hidden shrink-0 border border-border bg-muted">
                  <Image
                    src={item.images?.[0]?.url || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info & Controls */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <p
                      className="font-semibold text-sm text-card-foreground truncate w-full"
                      title={item.name}
                    >
                      {item.name}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <div className="flex items-center gap-1 bg-muted/50 rounded-lg border border-border p-0.5">
                      <button
                        onClick={() =>
                          item.qty > 1
                            ? updateQty(item.id, -1)
                            : removeItem(item.id)
                        }
                        className="p-1 hover:bg-background rounded-md text-foreground transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-xs font-bold w-6 text-center tabular-nums">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="p-1 hover:bg-background rounded-md text-foreground transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                    <p className="font-bold text-sm text-foreground tabular-nums">
                      {formatCurrency(item.price * item.qty)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer: Totals & Payment */}
        <div className="bg-card border-t border-border p-5 space-y-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span>
              <span className="text-foreground">
                {formatCurrency(subTotal)}
              </span>
            </div>

            <div className="flex justify-between items-center text-muted-foreground">
              <span className="flex items-center gap-2">
                Discount
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(Number(e.target.value))}
                    className="w-12 text-center border border-input rounded bg-background text-xs py-0.5 focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                  <span className="absolute right-1 top-0.5 text-[10px]">
                    %
                  </span>
                </div>
              </span>
              <span className="text-destructive font-medium">
                - {formatCurrency(discountAmount)}
              </span>
            </div>

            <div className="flex justify-between text-muted-foreground">
              <span>VAT (5%)</span>
              <span className="text-foreground">
                {formatCurrency(taxAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border">
              <span className="text-lg font-bold text-card-foreground">
                Total
              </span>
              <span className="text-2xl font-extrabold text-primary">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>

          {/* Extras: Gift Card */}
          <div className="flex items-center gap-2 py-2">
            <input
              type="checkbox"
              id="gift-card-toggle"
              checked={isGift}
              onChange={(e) => setIsGift(e.target.checked)}
              className="w-4 h-4 rounded border-input text-primary focus:ring-primary"
            />
            <label
              htmlFor="gift-card-toggle"
              className="text-sm font-medium text-muted-foreground cursor-pointer select-none flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Gift size={14} /> Mark as Gift
            </label>
          </div>

          {/* Payment Method Switch */}
          <div className="grid grid-cols-2 gap-2 bg-muted/50 p-1 rounded-lg border border-border">
            <button
              onClick={() => setPaymentMethod("cash")}
              className={`flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                paymentMethod === "cash"
                  ? "bg-background text-primary shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Banknote size={16} /> Cash
            </button>
            <button
              onClick={() => setPaymentMethod("card")}
              className={`flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-all ${
                paymentMethod === "card"
                  ? "bg-background text-primary shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CreditCard size={16} /> Card
            </button>
          </div>

          {/* Cash Input Logic */}
          {paymentMethod === "cash" && (
            <div className="bg-muted/30 p-3 rounded-lg border border-border animate-in fade-in slide-in-from-top-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-bold text-sm">
                  AED
                </span>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-12 pr-4 py-2.5 rounded-md border border-input bg-background text-lg font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
              </div>

              <div className="flex justify-between items-center mt-2 text-sm px-1">
                <span className="text-muted-foreground">Change Due:</span>
                <span
                  className={`font-bold text-base tabular-nums ${
                    changeDue < 0 ? "text-destructive" : "text-green-600"
                  }`}
                >
                  {formatCurrency(Math.max(0, changeDue))}
                </span>
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleCreateOrder}
            disabled={
              creatingSale ||
              cart.length === 0 ||
              (paymentMethod === "cash" && Number(paidAmount) < grandTotal)
            }
            className="w-full bg-primary text-primary-foreground py-3.5 rounded-xl text-lg font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {creatingSale ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Receipt size={20} />
            )}
            {creatingSale ? "Processing..." : "Complete Order"}
          </button>
        </div>
      </aside>
    </div>
  );
}
