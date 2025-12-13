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

  const { data, loading, error } = useQuery(GET_SALE_DETAILS, {
    variables: { id },
    skip: !id,
  });

  const sale = data?.sale;

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <Loading />
      </div>
    );

  if (error)
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
        <InvoicePDFViewer sale={sale} />
      </div>
    </div>
  );
}
