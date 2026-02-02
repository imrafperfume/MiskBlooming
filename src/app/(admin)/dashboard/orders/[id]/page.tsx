"use client";

import {
  User,
  MapPin,
  CreditCard,
  Truck,
  Package,
  Calendar,
  Clock,
  FileText,
  Phone,
  Mail,
  Edit3,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  XCircle,
  Copy,
  Download,
  ChevronLeft,
  Gift,
} from "lucide-react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import { toast } from "sonner";
import { formatTimestamp, handleDownload } from "@/src/lib/utils";
import { GET_ORDER_BY_ID } from "@/src/modules/order/operations";
import Button from "@/src/components/ui/button";

// --- GraphQL Mutation ---
const UPDATE_ORDER_STATUS = gql`
  mutation updateOrderStatus($id: ID!, $status: OrderStatus!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

// --- Types ---
interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  emirate: string;
  postalCode?: string;
  paymentMethod: string;
  paymentStatus: string;
  cardLast4?: string;
  deliveryType: string;
  deliveryDate?: string;
  deliveryTime?: string;
  specialInstructions?: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: OrderItem[];
  deliveryCost: number;
  codFee: number;
  vatAmount: number;
  discount: number;
  hasGiftCard: boolean;
  giftCardFee: number;
  giftCardSize?: string;
  giftCardTheme?: string;
  giftRecipient?: string;
  giftSender?: string;
  giftMessage?: string;
}

// --- Helper Components ---

// Status Badge with Semantic Colors
const StatusBadge = ({
  status,
  type = "order",
}: {
  status: string;
  type?: "order" | "payment";
}) => {
  const s = status.toLowerCase();

  let styles = "bg-muted text-muted-foreground border-border";
  let Icon = AlertCircle;

  if (s === "delivered" || s === "completed" || s === "paid") {
    styles = "bg-green-500/10 text-green-600 border-green-500/20"; // Semantic Success
    Icon = CheckCircle;
  } else if (s === "pending") {
    styles = "bg-orange-500/10 text-orange-600 border-orange-500/20"; // Semantic Warning
    Icon = Clock;
  } else if (s === "processing" || s === "shipped") {
    styles = "bg-blue-500/10 text-blue-600 border-blue-500/20"; // Semantic Info
    Icon = Truck;
  } else if (s === "cancelled" || s === "failed" || s === "refunded") {
    styles = "bg-destructive/10 text-destructive border-destructive/20"; // Semantic Error
    Icon = XCircle;
  }

  return (
    <span
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${styles}`}
    >
      <Icon className="w-3.5 h-3.5" />
      {status.toUpperCase()}
    </span>
  );
};

// Copy Button Component
const CopyButton = ({ text, label }: { text: string; label: string }) => (
  <button
    onClick={() => {
      navigator.clipboard.writeText(text);
      toast.success(`${label} copied to clipboard`);
    }}
    className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors"
    title={`Copy ${label}`}
  >
    <Copy className="w-3.5 h-3.5" />
  </button>
);

// Loading Skeleton
const OrderSkeleton = () => (
  <div className="max-w-7xl mx-auto p-4 sm:p-8 space-y-6">
    <div className="h-8 w-32 bg-muted animate-pulse rounded" />
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-6">
        <div className="h-48 bg-card animate-pulse rounded-xl" />
        <div className="h-96 bg-card animate-pulse rounded-xl" />
      </div>
      <div className="w-full md:w-80 space-y-6">
        <div className="h-40 bg-card animate-pulse rounded-xl" />
        <div className="h-40 bg-card animate-pulse rounded-xl" />
      </div>
    </div>
  </div>
);

export default function OrderDetails() {
  const params = useParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const { data, loading, error, refetch } = useQuery(GET_ORDER_BY_ID, {
    variables: { id: params.id },
    notifyOnNetworkStatusChange: true,
  });

  const [updateOrderStatus, { loading: updating }] = useMutation(
    UPDATE_ORDER_STATUS,
    {
      onCompleted: () => {
        toast.success("Order status updated successfully");
        setIsEditing(false);
        setNewStatus("");
        refetch();
      },
      onError: (err) => toast.error(err.message),
    }
  );

  const order: Order = data?.orderById;

  const handleStatusUpdate = async () => {
    if (!newStatus) return;
    try {
      await updateOrderStatus({
        variables: { id: order?.id, status: newStatus },
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <OrderSkeleton />;

  if (error || !order) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4">
        <div className="bg-destructive/10 p-4 rounded-full mb-4">
          <XCircle className="h-10 w-10 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Order Not Found
        </h2>
        <p className="text-muted-foreground mb-6">
          The order you are looking for does not exist or has been removed.
        </p>
        <Button variant="outline" onClick={() => router.back()}>
          <ChevronLeft className="w-4 h-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-12">
      {/* Header Section */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-cormorant font-bold text-foreground">
                  Order #{order.id.slice(-6).toUpperCase()}
                </h1>
                <StatusBadge status={order.status} />
                {order.hasGiftCard && (
                  <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-purple-500/10 text-purple-600 border-purple-500/20">
                    Gift Card Included
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  Placed on {formatTimestamp(Number(order.createdAt))}
                </span>
                <span className="text-border">|</span>
                <span className="font-mono text-xs">{order.id}</span>
                <CopyButton text={order.id} label="Order ID" />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Download Invoice */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownload(order.id)}
                className="bg-background hover:bg-muted"
              >
                <Download className="w-4 h-4 mr-2" />
                Invoice
              </Button>

              {/* Update Status Dialog */}
              <Dialog.Root open={isEditing} onOpenChange={setIsEditing}>
                <Dialog.Trigger asChild>
                  <Button variant="luxury" size="sm">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Update Status
                  </Button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
                  <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-card p-6 shadow-2xl rounded-xl border border-border z-50">
                    <div className="flex items-center justify-between mb-4">
                      <Dialog.Title className="text-lg font-semibold text-foreground">
                        Update Order Status
                      </Dialog.Title>
                      <Dialog.Close className="text-muted-foreground hover:text-foreground">
                        <X className="w-4 h-4" />
                      </Dialog.Close>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground">
                          Select New Status
                        </label>
                        <Select.Root
                          value={newStatus}
                          onValueChange={setNewStatus}
                        >
                          <Select.Trigger className="w-full px-3 py-2.5 bg-background border border-border rounded-lg flex items-center justify-between text-sm focus:ring-1 focus:ring-primary focus:border-primary">
                            <Select.Value placeholder="Current Status..." />
                            <Select.Icon className="text-muted-foreground" />
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="overflow-hidden bg-card border border-border rounded-lg shadow-lg z-[60]">
                              <Select.Viewport className="p-1">
                                {[
                                  "PENDING",
                                  "PROCESSING",
                                  "SHIPPED",
                                  "DELIVERED",
                                  "CANCELLED",
                                ].map((status) => (
                                  <Select.Item
                                    key={status}
                                    value={status}
                                    className="relative flex items-center px-6 py-2 text-sm text-foreground rounded-sm cursor-pointer select-none hover:bg-primary/10 hover:text-primary focus:bg-primary/10 focus:outline-none"
                                  >
                                    <Select.ItemText>{status}</Select.ItemText>
                                  </Select.Item>
                                ))}
                              </Select.Viewport>
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <Dialog.Close asChild>
                          <Button variant="outline" className="flex-1">
                            Cancel
                          </Button>
                        </Dialog.Close>
                        <Button
                          variant="luxury"
                          className="flex-1"
                          onClick={handleStatusUpdate}
                          disabled={!newStatus || updating}
                        >
                          {updating ? "Saving..." : "Update"}
                        </Button>
                      </div>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column (Items) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Order Items{" "}
                  <span className="text-muted-foreground text-sm font-normal">
                    ({order.items.length})
                  </span>
                </h3>
              </div>
              <div className="divide-y divide-border">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="p-6 flex flex-col sm:flex-row gap-4"
                  >
                    {/* Placeholder for Product Image if you had one */}
                    <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center shrink-0">
                      <Package className="w-8 h-8 text-muted-foreground/50" />
                    </div>

                    <div className="flex-1">

                      <h4 className="font-medium text-foreground text-lg">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        Item ID: {item.id.slice(0, 8)}
                      </p>

                      {/* Size & Color */}
                      {(item.size || item.color) && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {item.size && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border">
                              Size: {item.size}
                            </span>
                          )}
                          {item.color && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-muted text-muted-foreground border border-border">
                              Color: {item.color}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">
                        AED {item.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-semibold text-primary mt-1">
                        Total: AED {(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Summary */}
              <div className="bg-muted/30 p-6 border-t border-border">
                <div className="space-y-3 max-w-xs ml-auto text-sm">
                  {order.deliveryCost > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery Fee</span>
                      <span>AED {order.deliveryCost.toFixed(2)}</span>
                    </div>
                  )}
                  {order.codFee > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>COD Fee</span>
                      <span>AED {order.codFee.toFixed(2)}</span>
                    </div>
                  )}
                  {order.vatAmount > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>VAT</span>
                      <span>AED {order.vatAmount.toFixed(2)}</span>
                    </div>
                  )}
                  {order.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount</span>
                      <span>- AED {order.discount.toFixed(2)}</span>
                    </div>
                  )}
                  {order.giftCardFee > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Gift Card Fee</span>
                      <span>AED {order.giftCardFee.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t border-border pt-3 mt-3 flex justify-between items-center">
                    <span className="font-cormorant text-xl font-bold text-foreground">
                      Total
                    </span>
                    <span className="text-xl font-bold text-primary">
                      AED {order.totalAmount.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Instructions */}
            {order.specialInstructions && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4" />
                  Special Instructions
                </h3>
                <p className="text-muted-foreground italic bg-muted/50 p-4 rounded-lg border border-border/50">
                  "{order.specialInstructions}"
                </p>
              </div>
            )}
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-6">
            {/* Customer Details */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <User className="w-4 h-4" />
                Customer
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <span className="font-bold text-xs">
                      {order.firstName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      {order.firstName} {order.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Customer since{" "}
                      {new Date(Number(order.createdAt)).getFullYear()}
                    </p>
                  </div>
                </div>
                <div className="border-t border-border pt-4 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground group">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{order.email}</span>
                    <CopyButton text={order.email} label="Email" />
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground group">
                    <Phone className="w-4 h-4" />
                    <span>{order.phone}</span>
                    <CopyButton text={order.phone} label="Phone" />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4" />
                Delivery Address
              </h3>
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="bg-muted/30 p-3 rounded-lg border border-border/50 relative group">
                  <p className="text-foreground font-medium mb-1">
                    {order.address}
                  </p>
                  <p>
                    {order.city}, {order.emirate}
                  </p>
                  {order.postalCode && <p>{order.postalCode}</p>}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CopyButton
                      text={`${order.address}, ${order.city}`}
                      label="Address"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Type</span>
                    <span className="font-medium text-foreground">
                      {order.deliveryType}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Date</span>
                    <span className="font-medium text-foreground">
                      {order.deliveryDate
                        ? formatTimestamp(Number(order.deliveryDate))
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Time Slot</span>
                    <span className="font-medium text-foreground">
                      {order.deliveryTime || "Anytime"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                <CreditCard className="w-4 h-4" />
                Payment
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <StatusBadge status={order.paymentStatus} type="payment" />
                </div>

                <div className="border-t border-border pt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-6 bg-muted border border-border rounded flex items-center justify-center">
                      <span className="text-[10px] font-bold text-muted-foreground">
                        CARD
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">
                        {order.paymentMethod}
                      </p>
                      {order.cardLast4 && (
                        <p className="text-xs text-muted-foreground">
                          Ending in **** {order.cardLast4}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Gift Card Details */}
            {order.hasGiftCard && (
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-foreground flex items-center gap-2 mb-4">
                  <Gift className="w-4 h-4 text-purple-600" />
                  Gift Card Details
                </h3>
                <div className="space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-muted-foreground text-xs">Size</p>
                      <p className="font-medium">{order.giftCardSize || "A6"}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs">Theme</p>
                      <p className="font-medium">{order.giftCardTheme || "Standard"}</p>
                    </div>
                  </div>

                  <div className="border-t border-border pt-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="text-muted-foreground text-xs">From</p>
                        <p className="font-medium">{order.giftSender || "-"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-muted-foreground text-xs">To</p>
                        <p className="font-medium">{order.giftRecipient || "-"}</p>
                      </div>
                    </div>
                  </div>

                  {order.giftMessage && (
                    <div className="bg-muted/30 p-3 rounded-lg border border-border/50 italic text-muted-foreground">
                      "{order.giftMessage}"
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div >
  );
}
