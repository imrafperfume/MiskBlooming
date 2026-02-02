"use client";

import { useQuery, gql } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Loading from "@/src/components/layout/Loading";
import dynamic from "next/dynamic";

// --- KEY FIX: Import the WRAPPER dynamically, not just the library ---
const InvoicePDFViewer = dynamic(
  () => import("@/src/components/pdf/InvoicePDFViewer"),
  {
    ssr: false,
    loading: () => <Loading />,
  }
);

const GET_SALE_DETAILS = gql`
  query GetSale($id: ID!) {
    sale(id: $id) {
      id
      createdAt
      grandTotal
      subtotal
      discount
      vat
      paymentMethod
      orderItems {
        product {
          name
          price
        }
        quantity
      }
    }
  }
`;

export default function InvoicePage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  // Import Store Settings Query (Assume it's exported from operations or similar, strict typing inline for now if needed or import)
  // Actually, let's use the one from opration.ts if we can, or just define it here to be safe and quick.
  // Better to use the existing one from `src/modules/system/opration.ts`.
  // But for now, defining it here to ensure it works without import issues.
  const GET_STORE_SETTINGS = gql`
    query GetStoreSettings {
      getStoreSettings {
        storeName
        description
        logoUrl
        supportEmail
        phoneNumber
        address
      }
    }
  `;

  const { data: saleData, loading: saleLoading, error: saleError } = useQuery(GET_SALE_DETAILS, {
    variables: { id },
    skip: !id,
  });

  const { data: settingsData } = useQuery(GET_STORE_SETTINGS);

  const sale = saleData?.sale;
  const settings = settingsData?.getStoreSettings;

  if (saleLoading)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <Loading />
      </div>
    );

  if (saleError)
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Error loading invoice.
      </div>
    );

  if (!sale) return <div>Invoice not found</div>;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-10">
      <div className="w-full max-w-5xl flex justify-between items-center mb-6 px-4">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-white hover:text-gray-300 transition"
        >
          <ArrowLeft size={20} /> Back to Orders
        </button>
        <div className="text-white text-sm opacity-70">
          Invoice #{sale.id.slice(-6).toUpperCase()}
        </div>
      </div>

      <div className="w-full max-w-5xl h-[850px] bg-white rounded-lg shadow-2xl overflow-hidden">
        {sale && (
          <InvoicePDFViewer
            data={{
              id: sale.id,
              issueDate: new Date(Number(sale.createdAt)).toLocaleDateString(
                "en-GB"
              ),
              status: "PAID",
              customer: {
                name: "Walk-in Customer",
                email: "N/A",
                phone: "N/A",
                city: "Dubai",
              },
              items: sale.orderItems.map((item: any) => ({
                name: item.product.name,
                quantity: item.quantity,
                price: item.product.price,
                total: item.product.price * item.quantity,
              })),
              subtotal: sale.subtotal,
              taxAmount: sale.vat,
              discount: sale.discount,
              deliveryFee: 0,
              totalAmount: sale.grandTotal,
              paymentMethod: sale.paymentMethod,
            }}
            companyInfo={settings ? {
              name: settings.storeName,
              sub: settings.description,
              address: settings.address,
              email: settings.supportEmail,
              phone: settings.phoneNumber,
              logoUrl: settings.logoUrl,
              legal: "MISK BLOOMING CHOCOLATES & FLOWERS (SPS-L.L.C)" // Keep legal hardcoded or add to settings if exists.
            } : undefined}
          />
        )}
      </div>
    </div>
  );
}
