"use client";

import Loading from "@/src/components/layout/Loading";
import { GET_PRODUCTS } from "@/src/modules/product/operations";
import { useMutation, useQuery } from "@apollo/client";
import { useEffect, useState, useRef, useMemo } from "react";
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
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { CREATE_SALE } from "@/src/modules/sales/oprations";

// --- Types ---
type Product = {
  id: string;
  name: string;
  price: number;
  category?: string;
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

  // --- NEW STATE: Gift Card ---
  const [isGift, setIsGift] = useState<boolean>(false);

  // Data Fetching
  const { data, loading } = useQuery(GET_PRODUCTS);
  const products: Product[] = data?.products || [];
  const [createSale, { loading: creatingSale }] = useMutation(CREATE_SALE);

  // --- Effects ---

  // Init Load
  useEffect(() => {
    setFiltered(products);
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
  }, []);

  // --- Logic ---

  const handleSearch = (text: string) => {
    setSearch(text);
    if (!text.trim()) {
      setFiltered(products);
      return;
    }
    const lower = text.toLowerCase();
    const res = products.filter((p) => p.name.toLowerCase().includes(lower));
    setFiltered(res);
    setVisible(20);
  };

  const addToCart = (p: Product) => {
    const exist = cart.find((i) => i.id === p.id);
    if (exist) {
      setCart(cart.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i)));
    } else {
      setCart([...cart, { ...p, qty: 1 }]);
    }
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
    setCart(cart.filter((i) => i.id !== id));
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
      const change = Math.max(0, paid - total);

      return {
        subTotal: sub,
        discountAmount: disc,
        taxAmount: tax,
        grandTotal: total,
        changeDue: change,
      };
    }, [cart, discountPercent, paidAmount]);

  const visibleProducts = filtered.slice(0, visible);

  const handleCreateOrder = async () => {
    if (cart.length === 0) return;

    const payload = {
      items: cart.map((i) => ({ productId: i.id, qty: i.qty })),
      paymentMethod,
      subTotal,
      discount: discountAmount,
      vat: taxAmount,
      grandTotal,
      paidAmount: Number(paidAmount),
      // Include Gift Data
      isGift,
    };

    console.log("Processing Order:", payload);
    // Mutation logic here...
    await createSale({
      variables: {
        subtotal: subTotal,
        grandTotal,
        vat: taxAmount,
        discount: discountAmount,
        paymentMethod: paymentMethod === "cash" ? "CASH" : "ONLINE",
        giftCard: isGift,
        CashRecived: paymentMethod === "cash" ? Number(paidAmount) : null,
        items: cart.map((i) => ({
          productId: i.id,
          quantity: i.qty,
        })),
      },
    });
    if (!creatingSale) {
      toast.success("Order processed successfully ");
    }
    setCart([]);
    setPaidAmount("");
    setDiscountPercent(0);
    // Reset Gift state
    setIsGift(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans text-foreground">
      {/* --- LEFT COLUMN: PRODUCT CATALOG --- */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Header / Search */}
        <header className=" border-b px-8 py-5 flex items-center justify-between gap-4 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Sales Terminal
            </h1>
            <p className="text-sm text-muted-foreground">
              Select products to add to cart
            </p>
          </div>

          <div className="relative w-full max-w-md">
            <Search
              className="absolute top-1/2 -translate-y-1/2 left-3 text-foreground"
              size={20}
            />
            <input
              autoFocus
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search by product name, SKU..."
              className="w-full pl-10 pr-4 py-3 border border-border rounded-xl bg-background focus:ring-2 focus:ring-ring focus:border-transparent outline-none transition-all"
            />
            {search && (
              <button
                onClick={() => handleSearch("")}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-foreground"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </header>

        {/* Product Grid Scroll Area */}
        <main className="flex-1 overflow-y-auto p-6 scrollbar-hide">
          {visibleProducts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-foreground">
              <Search size={64} className="mb-4 opacity-20" />
              <p className="text-lg">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 pb-10">
              {visibleProducts.map((p) => (
                <div
                  key={p.id}
                  onClick={() => addToCart(p)}
                  className="group bg-background rounded-2xl border border-border overflow-hidden cursor-pointer hover:shadow-xl hover:border-border transition-all duration-200 active:scale-95 flex flex-col"
                >
                  <div className="relative w-full aspect-[4/3] bg-background">
                    <Image
                      src={p.images?.[0]?.url || "/placeholder.png"}
                      alt={p.name}
                      fill
                      className="object-cover"
                    />
                    {/* Overlay on Hover */}
                    <div className="absolute inset-0 bg-background/10 group-hover:bg-background/30 transition-colors" />
                  </div>

                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-semibold text-foreground line-clamp-2 mb-1 leading-tight">
                      {p.name}
                    </h3>
                    <div className="mt-auto pt-2 flex items-center justify-between">
                      <span className="font-bold text-primary text-lg">
                        AED {p.price}
                      </span>
                      <div className="h-8 w-8 rounded-full bg-foreground text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-foreground transition-colors">
                        <Plus size={18} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Loader Trigger */}
          {visible < filtered.length && (
            <div
              ref={loaderRef}
              className="py-8 text-center text-foreground text-sm"
            >
              Loading more products...
            </div>
          )}
        </main>
      </div>

      {/* --- RIGHT COLUMN: CART & CHECKOUT --- */}
      <aside className="w-[400px] bg-background border-l border-border shadow-2xl flex flex-col h-full z-10">
        {/* Cart Header */}
        <div className="p-5 border-b border-border flex items-center justify-between bg-background/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="text-primary" size={20} />
            <h2 className="font-bold text-lg text-foreground">Current Order</h2>
          </div>
          <span className="bg-foreground text-primary text-xs font-bold px-2 py-1 rounded-full">
            {cart.reduce((a, b) => a + b.qty, 0)} Items
          </span>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-foreground space-y-3">
              <Receipt size={48} className="opacity-20" />
              <p>Order is empty</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 p-3 rounded-xl bg-background border border-border group  transition-colors"
              >
                {/* Thumbnail */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-border">
                  <Image
                    src={item.images?.[0]?.url || "/placeholder.png"}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info & Controls */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <p
                      className="font-semibold text-sm text-foreground line-clamp-1"
                      title={item.name}
                    >
                      {item.name}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs text-foreground">
                      {formatCurrency(item.price)}
                    </p>
                    <div className="flex items-center gap-3 bg-background rounded-lg border border-border px-1 py-0.5 shadow-sm">
                      <button
                        onClick={() =>
                          item.qty > 1
                            ? updateQty(item.id, -1)
                            : removeItem(item.id)
                        }
                        className="p-1 hover:text-primary "
                      >
                        <Minus size={14} />
                      </button>
                      <span className="text-sm font-bold w-4 text-center">
                        {item.qty}
                      </span>
                      <button
                        onClick={() => updateQty(item.id, 1)}
                        className="p-1 hover:text-primary"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <p className="font-bold text-sm text-primary">
                      {formatCurrency(item.price * item.qty)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Calculations & Payment Section */}
        <div className="bg-background border-t border-border p-5 space-y-4">
          {/* Summary Rows */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-foreground">
              <span>Subtotal</span>
              <span>{formatCurrency(subTotal)}</span>
            </div>

            <div className="flex justify-between items-center text-foreground">
              <span className="flex items-center gap-2">
                Discount
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discountPercent}
                  onChange={(e) => setDiscountPercent(Number(e.target.value))}
                  className="w-20 text-center border rounded bg-background text-xs py-0.5 focus:ring-1 focus:ring-ring outline-none"
                />
                %
              </span>
              <span className="text-destructive">
                - {formatCurrency(discountAmount)}
              </span>
            </div>

            <div className="flex justify-between text-foreground">
              <span>VAT (5%)</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-border">
              <span className="text-lg font-bold text-foreground">Total</span>
              <span className="text-2xl font-extrabold text-primary">
                {formatCurrency(grandTotal)}
              </span>
            </div>
          </div>

          {/* --- START ADDED CODE: Gift Card Check Input --- */}
          <div className="border-t border-border pt-3">
            <div className="flex items-center gap-2 mb-2">
              <input
                type="checkbox"
                id="gift-card-toggle"
                checked={isGift}
                onChange={(e) => setIsGift(e.target.checked)}
                className="w-4 h-4 accent-primary cursor-pointer rounded focus:ring-primary"
              />
              <label
                htmlFor="gift-card-toggle"
                className="text-sm font-medium text-foreground cursor-pointer select-none flex items-center gap-1"
              >
                <Gift size={16} /> Gift Card
              </label>
            </div>

            {/* {isGift && (
              <input
                type="text"
                value={giftCardCode}
                onChange={(e) => setGiftCardCode(e.target.value)}
                placeholder="Enter Gift Card Code or Note..."
                className="w-full text-sm bg-background px-3 py-2 rounded-lg border border-border focus:ring-2 focus:ring-ring outline-none text-foreground transition-all"
              />
            )} */}
          </div>
          {/* --- END ADDED CODE --- */}

          {/* Payment Method Toggles */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setPaymentMethod("cash")}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-all ${
                paymentMethod === "cash"
                  ? "bg-primary text-white border-border shadow-md"
                  : "bg-primary-foreground text-foreground border-border hover:bg-primary"
              }`}
            >
              <Banknote size={16} /> Cash
            </button>
            <button
              onClick={() => setPaymentMethod("card")}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg border text-sm font-medium transition-all ${
                paymentMethod === "card"
                  ? "bg-primary text-foreground border-border shadow-md"
                  : "bg-primary-foreground text-foreground border-border hover:bg-primary"
              }`}
            >
              <CreditCard size={16} /> Card / Online
            </button>
          </div>

          {/* Cash Payment Logic */}
          {paymentMethod === "cash" && (
            <div className="bg-background p-3 rounded-xl border border-border shadow-sm">
              <label className="text-xs font-semibold text-foreground uppercase mb-1 block">
                Cash Received
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground font-bold text-sm">
                  AED
                </span>
                <input
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-primary-foreground pl-12 pr-4 py-2 rounded-lg border border-border focus:ring-2 focus:ring-ring focus:border-transparent outline-none font-bold text-foreground"
                />
              </div>
              {paidAmount && (
                <div className="flex justify-between items-center mt-2 text-sm">
                  <span className="text-foreground">Change Due:</span>
                  <span
                    className={`font-bold ${
                      changeDue < 0 ? "text-red-500" : "text-green-600"
                    }`}
                  >
                    {formatCurrency(changeDue)}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Checkout Button */}
          <button
            onClick={handleCreateOrder}
            disabled={
              cart.length === 0 ||
              (paymentMethod === "cash" && Number(paidAmount) < grandTotal)
            }
            className="w-full bg-primary   disabled:cursor-not-allowed text-foreground py-4 rounded-xl text-lg font-bold shadow-sm  transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Receipt size={20} />
            Print & Complete Order
          </button>
        </div>
      </aside>
    </div>
  );
}
