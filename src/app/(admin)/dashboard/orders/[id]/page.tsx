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
} from "lucide-react";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as Dialog from "@radix-ui/react-dialog";
import * as Select from "@radix-ui/react-select";
import Loading from "@/src/components/layout/Loading";
import { toast } from "sonner";
import { formatDate, formatTimestamp, handleDownload } from "@/src/lib/utils";
import { GET_ORDER_BY_ID } from "@/src/modules/order/operations";
import Button from "@/src/components/ui/Button";

const UPDATE_ORDER_STATUS = gql`
  mutation updateOrderStatus($id: ID!, $status: OrderStatus!) {
    updateOrderStatus(id: $id, status: $status) {
      id
      status
    }
  }
`;

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
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
}

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
    case "delivered":
      return {
        variant: "default" as const,
        className: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: CheckCircle,
        color: "text-emerald-600",
      };
    case "pending":
      return {
        variant: "secondary" as const,
        className: "bg-amber-100 text-amber-800 border-amber-200",
        icon: Clock,
        color: "text-amber-600",
      };
    case "processing":
      return {
        variant: "default" as const,
        className: "bg-luxury-100 text-luxury-800 border-border ",
        icon: AlertCircle,
        color: "text-primary ",
      };
    case "cancelled":
    case "failed":
      return {
        variant: "destructive" as const,
        className: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
        color: "text-red-600",
      };
    default:
      return {
        variant: "outline" as const,
        className: "bg-background  text-gray-800 border-border ",
        icon: AlertCircle,
        color: "text-foreground ",
      };
  }
};

const getPaymentStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
    case "completed":
      return {
        className: "bg-emerald-100 text-emerald-800 border-emerald-200",
        icon: CheckCircle,
      };
    case "pending":
      return {
        className: "bg-amber-100 text-amber-800 border-amber-200",
        icon: Clock,
      };
    case "failed":
    case "refunded":
      return {
        className: "bg-red-100 text-red-800 border-red-200",
        icon: XCircle,
      };
    default:
      return {
        className: "bg-background  text-gray-800 border-border ",
        icon: AlertCircle,
      };
  }
};

export default function OrderDetails() {
  const params = useParams();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  const { data, loading, error, refetch } = useQuery(GET_ORDER_BY_ID, {
    variables: { id: params.id },
  });

  const [updateOrderStatus, { loading: updating }] = useMutation(
    UPDATE_ORDER_STATUS,
    {
      onCompleted: () => {
        toast.success("Order Status Update Successfull");
        setIsEditing(false);
        setNewStatus("");
        router.refresh();
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }
  );

  const order: Order = data?.orderById;

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-backgroundfrom-slate-50 to-gray-100 flex items-center justify-center">
        <div className="max-w-md bg-background rounded-xl shadow-xl border-0 sm:p-8 text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-foreground  mb-4">{error.message}</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 border border-border  rounded-md text-gray-700 hover:bg-background transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!order) return null;

  const statusConfig = getStatusConfig(order?.status);
  const paymentConfig = getPaymentStatusConfig(order?.paymentStatus);
  const StatusIcon = statusConfig.icon;
  const PaymentIcon = paymentConfig.icon;

  const handleStatusUpdate = async () => {
    console.log("🚀 ~ handleStatusUpdate ~ newStatus:", newStatus);
    if (!newStatus) return;

    try {
      await updateOrderStatus({
        variables: {
          id: order?.id,
          status: newStatus,
        },
      });
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  return (
    <div className="min-h-screen bg-backgroundfrom-slate-50 to-gray-100">
      <div className="max-w-7xl mx-auto sm:p-6 space-y-8">
        <div className="bg-background rounded-xl border-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary via-luxury-500 to-luxury-400 sm:p-8 p-4 text-white">
            <div className="flex flex-col  lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8" />
                  <h1 className="sm:text-4xl font-bold tracking-tight text-balance">
                    Order #{order.id}
                  </h1>
                </div>
                <p className="text-luxury-100 text-lg">
                  Placed on{" "}
                  {order?.createdAt
                    ? formatTimestamp(Number(order?.createdAt))
                    : "Not available"}
                </p>
              </div>
              <div className="text-left lg:text-right space-y-3">
                <div className="flex items-center gap-2 lg:justify-end">
                  <StatusIcon className="h-5 w-5" />
                  <span
                    className={`${statusConfig.className} text-sm font-semibold px-4 py-2 border rounded-full`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <p className="text-3xl font-bold tracking-tight">
                  AED {order.totalAmount.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-background rounded-xl  border-0">
          <div className="sm:p-6 pb-4 border-b border-border ">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="flex items-center gap-2 text-luxury-700 text-xl font-semibold">
                <Edit3 className="h-5 w-5" />
                Order Management
              </h3>
              <Button
                variant={"outline"}
                size={"sm"}
                onClick={() => handleDownload(order?.id)}
                className="px-4 py-2 border border-border  bg-transparent rounded-md font-medium flex items-center gap-2 transition-colors"
              >
                Download Invoice
              </Button>
              <Dialog.Root open={isEditing} onOpenChange={setIsEditing}>
                <Dialog.Trigger asChild>
                  <Button
                    variant={"luxury"}
                    size={"sm"}
                    className="px-4 py-2 border border-border  text-luxury-100 hover:bg-foregroundhover:border-luxury-300 bg-transparent rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Update Status
                  </Button>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                  <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 bg-background p-6 shadow-2xl rounded-xl border-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
                    <Dialog.Title className="text-xl font-semibold text-gray-900 mb-4">
                      Update Order Status
                    </Dialog.Title>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">
                          New Status
                        </label>
                        <Select.Root
                          value={newStatus}
                          onValueChange={setNewStatus}
                        >
                          <Select.Trigger className="w-full px-3 py-2 border border-border  rounded-md focus:border-luxury-500 focus:ring-1 focus:ring-ring bg-background text-left flex items-center justify-between">
                            <Select.Value placeholder="Select new status" />
                            <Select.Icon>
                              <svg
                                className="h-4 w-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 9l-7 7-7-7"
                                />
                              </svg>
                            </Select.Icon>
                          </Select.Trigger>
                          <Select.Portal>
                            <Select.Content className="bg-background border border-border  rounded-md  z-50 overflow-hidden">
                              <Select.Viewport className="p-1">
                                <Select.Item
                                  value="PENDING"
                                  className="px-3 py-2 text-sm cursor-pointer hover:bg-background  rounded"
                                >
                                  <Select.ItemText>Pending</Select.ItemText>
                                </Select.Item>
                                <Select.Item
                                  value="PROCESSING"
                                  className="px-3 py-2 text-sm cursor-pointer hover:bg-background  rounded"
                                >
                                  <Select.ItemText>Processing</Select.ItemText>
                                </Select.Item>
                                <Select.Item
                                  value="SHIPPED"
                                  className="px-3 py-2 text-sm cursor-pointer hover:bg-background  rounded"
                                >
                                  <Select.ItemText>Shipped</Select.ItemText>
                                </Select.Item>
                                <Select.Item
                                  value="DELIVERED"
                                  className="px-3 py-2 text-sm cursor-pointer hover:bg-background  rounded"
                                >
                                  <Select.ItemText>Delivered</Select.ItemText>
                                </Select.Item>
                                <Select.Item
                                  value="CANCELLED"
                                  className="px-3 py-2 text-sm cursor-pointer hover:bg-background  rounded"
                                >
                                  <Select.ItemText>Cancelled</Select.ItemText>
                                </Select.Item>
                              </Select.Viewport>
                            </Select.Content>
                          </Select.Portal>
                        </Select.Root>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-6">
                      <Button
                        variant={"luxury"}
                        size={"sm"}
                        onClick={handleStatusUpdate}
                        disabled={!newStatus || updating}
                        className="bg-primary hover:bg-luxury-700 text-white px-4 py-2 rounded-md font-medium flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        <Save className="h-4 w-4" />
                        {updating ? "Updating..." : "Update Order"}
                      </Button>

                      <Dialog.Close asChild>
                        <Button
                          variant={"outline"}
                          size={"sm"}
                          className="px-4 py-2 border border-border  bg-transparent rounded-md font-medium flex items-center gap-2 transition-colors"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                      </Dialog.Close>
                    </div>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Customer Information */}
          <div className="bg-background rounded-xl border-0 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            <div className="sm:p-6 pb-4 border-b border-border ">
              <h3 className="flex items-center gap-2 text-luxury-700 text-lg font-semibold">
                <User className="h-5 w-5" />
                Customer Information
              </h3>
            </div>
            <div className="sm:p-6 space-y-4">
              <div>
                <p className="font-semibold text-lg text-gray-900 text-balance">
                  {order.firstName} {order.lastName}
                </p>
              </div>
              <div className="flex items-center gap-3 text-foreground ">
                <Mail className="h-4 w-4 text-primary  flex-shrink-0" />
                <span className="text-sm break-all">{order.email}</span>
              </div>
              <div className="flex items-center gap-3 text-foreground ">
                <Phone className="h-4 w-4 text-primary  flex-shrink-0" />
                <span className="text-sm">{order.phone}</span>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-background rounded-xl  border-0 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            <div className="sm:p-6 pb-4 border-b border-border ">
              <h3 className="flex items-center gap-2 text-luxury-700 text-lg font-semibold">
                <MapPin className="h-5 w-5" />
                Shipping Address
              </h3>
            </div>
            <div className="sm:p-6 space-y-2">
              <p className="font-medium text-gray-900 text-balance">
                {order.address}
              </p>
              <p className="text-foreground ">
                {order?.city}, {order?.emirate}
              </p>
              {order.postalCode && (
                <p className="text-sm text-foreground ">
                  Postal Code: {order.postalCode}
                </p>
              )}
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-background rounded-xl border-0 hover:shadow-xl transition-all duration-200 hover:-translate-y-1">
            <div className="sm:p-6 pb-4 border-b border-border ">
              <h3 className="flex items-center gap-2 text-luxury-700 text-lg font-semibold">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </h3>
            </div>
            <div className="sm:p-6 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-foreground ">Method:</span>
                <span className="font-medium">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground ">Status:</span>
                <div className="flex items-center gap-2">
                  <PaymentIcon className="h-4 w-4" />
                  <span
                    className={`${paymentConfig.className} text-xs font-medium border rounded-full px-3 py-1`}
                  >
                    {order.paymentStatus}
                  </span>
                </div>
              </div>
              {order.cardLast4 && (
                <div className="flex justify-between items-center">
                  <span className="text-foreground ">Card:</span>
                  <span className="font-mono text-sm">
                    **** {order.cardLast4}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Delivery Information */}
          <div className="bg-background rounded-xl  border-0 hover:shadow-xl transition-all duration-200 hover:-translate-y-1 md:col-span-2 lg:col-span-3">
            <div className="sm:p-6 pb-4 border-b border-border ">
              <h3 className="flex items-center gap-2 text-luxury-700 text-lg font-semibold">
                <Truck className="h-5 w-5" />
                Delivery Information
              </h3>
            </div>
            <div className="sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex justify-between items-center">
                  <span className="text-foreground ">Type:</span>
                  <span className="font-medium">{order.deliveryType}</span>
                </div>
                {order.deliveryDate && (
                  <div className="flex items-center gap-2 text-foreground ">
                    <Calendar className="h-4 w-4 text-primary  flex-shrink-0" />
                    <span>
                      {order.deliveryDate
                        ? new Date(
                            Number(order.deliveryDate)
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "Not Scheduled"}
                    </span>
                  </div>
                )}
                {order.deliveryTime && (
                  <div className="flex items-center gap-2 text-foreground ">
                    <Clock className="h-4 w-4 text-primary  flex-shrink-0" />
                    <span>{order.deliveryTime}</span>
                  </div>
                )}
              </div>
              {order.specialInstructions && (
                <div className="mt-6 pt-6 border-t border-border ">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-primary " />
                    <span className="font-medium text-gray-900">
                      Special Instructions:
                    </span>
                  </div>
                  <div className="bg-foregroundborder border-border  rounded-lg p-4">
                    <p className="text-gray-700 text-pretty">
                      {order.specialInstructions}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-background rounded-xl border-0">
          <div className="sm:p-6 pb-4 border-b border-border ">
            <h3 className="flex items-center gap-2 text-luxury-700 text-lg font-semibold">
              <Package className="h-5 w-5" />
              Order Items ({order.items.length})
            </h3>
          </div>
          <div className="sm:p-4">
            <div className="space-y-2">
              {order.items.map((item: any, index: number) => (
                <div key={item.id}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 bg-background">
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg text-gray-900 text-balance">
                        {item.product.name}
                      </h4>
                    </div>
                    <div className="text-left flex items-center justify-between sm:inline-block sm:text-right sm:ml-6 space-y-1">
                      <p className="font-medium sm:text-lg">
                        {item.quantity} × AED {item.price.toFixed(2)}
                      </p>
                      <p className="text-primary font-semibold">
                        = AED {(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                  {index < order.items.length - 1 && (
                    <div className="border-t border-border  my-4" />
                  )}
                </div>
              ))}

              {/* Cost Breakdown */}
              <div className="border-t-2 border-border  pt-6 mt-6 space-y-2 text-right">
                {order?.deliveryCost > 0 && (
                  <p className="text-gray-700">
                    Delivery Fee:{" "}
                    <span className="font-medium">
                      AED {order?.deliveryCost.toFixed(2)}
                    </span>
                  </p>
                )}
                {order?.codFee > 0 && (
                  <p className="text-gray-700">
                    COD Fee:{" "}
                    <span className="font-medium">
                      AED {order?.codFee.toFixed(2)}
                    </span>
                  </p>
                )}
                {order.vatAmount > 0 && (
                  <p className="text-gray-700">
                    VAT:{" "}
                    <span className="font-medium">
                      AED {order.vatAmount.toFixed(2)}
                    </span>
                  </p>
                )}
                {order.discount > 0 && (
                  <p className="text-gray-700">
                    Discount:{" "}
                    <span className="font-medium text-green-600">
                      - AED {order.discount.toFixed(2)}
                    </span>
                  </p>
                )}

                <div className="flex justify-between items-center sm:flex-row sm:justify-between sm:items-center gap-4 bg-foregroundrounded-xl mt-4 pt-4 border-t border-border ">
                  <span className="sm:text-lg text-xl font-cormorant font-semibold text-gray-900">
                    Total Amount:
                  </span>
                  <span className="sm:text-3xl text-xl font-bold text-primary ">
                    AED {order.totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
