"use client";

import { PDFViewer } from "@react-pdf/renderer";
import InvoiceDocument from "./InvoiceDocument";

interface InvoicePDFViewerProps {
  sale: any;
}

export default function InvoicePDFViewer({ sale }: InvoicePDFViewerProps) {
  return (
    <PDFViewer className="w-full h-full border-none">
      <InvoiceDocument sale={sale} />
    </PDFViewer>
  );
}
