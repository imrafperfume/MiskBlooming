import { PDFViewer } from "@react-pdf/renderer";
import InvoiceDocument, { CompanyInfo } from "./InvoiceDocument";
import { InvoiceDisplayData } from "@/src/types/invoice";

interface InvoicePDFViewerProps {
  data: InvoiceDisplayData;
  companyInfo?: CompanyInfo;
}

export default function InvoicePDFViewer({ data, companyInfo }: InvoicePDFViewerProps) {
  return (
    <PDFViewer className="w-full h-full border-none">
      <InvoiceDocument data={data} companyInfo={companyInfo} />
    </PDFViewer>
  );
}
