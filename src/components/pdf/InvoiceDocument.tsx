

import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image
} from "@react-pdf/renderer";
import { InvoiceDisplayData } from "@/src/types/invoice";

// Register Fonts (Using standard fonts for now to ensure compatibility)
// In a real scenario, you'd register custom fonts here if available in public/
// Font.register({
//   family: 'Cormorant',
//   src: '/fonts/CormorantGaramond-Regular.ttf'
// });

const colors = {
  primary: "#111827", // Gray 900
  secondary: "#4b5563", // Gray 600
  accent: "#059669", // Emerald 600
  border: "#e5e7eb", // Gray 200
  bgLight: "#f9fafb", // Gray 50
  white: "#ffffff",
};

const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 40,
    backgroundColor: "#ffffff",
    color: colors.primary,
    flexDirection: "column",
  },
  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 20,
    alignItems: 'center'
  },
  brandColumn: {
    flexDirection: "column",
  },
  logo: {
    width: 80,
    height: 80,
    objectFit: 'contain',
    marginBottom: 10
  },
  brandTitle: {
    fontSize: 24,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 4,
    color: colors.primary,
  },
  brandSub: {
    fontSize: 9,
    color: colors.secondary,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  invoiceTitleColumn: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  invoiceTitle: {
    fontSize: 32,
    fontFamily: "Helvetica-Bold",
    color: colors.accent,
    textTransform: "uppercase",
    opacity: 0.1,
    position: "absolute",
    top: -10,
    right: 0,
  },
  invoiceMetaText: {
    fontSize: 10,
    color: colors.secondary,
    marginBottom: 2,
  },
  invoiceMetaValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
  },

  // Customer & Company Info
  infoSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 40,
  },
  infoColumn: {
    width: "45%",
  },
  sectionTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.secondary,
    textTransform: "uppercase",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: 2,
  },
  infoText: {
    fontSize: 10, // Increased legible size
    marginBottom: 3,
    lineHeight: 1.4,
  },
  infoTextBold: {
    fontFamily: "Helvetica-Bold",
  },

  // Table
  tableContainer: {
    marginBottom: 40,
    borderRadius: 4,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  th: {
    color: colors.white,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingVertical: 10,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  td: {
    fontSize: 10,
  },
  // Columns
  colProduct: { width: "50%" },
  colPrice: { width: "15%", textAlign: "right" },
  colQty: { width: "10%", textAlign: "center" },
  colTotal: { width: "25%", textAlign: "right" },

  // Totals
  totalsSection: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 40,
  },
  totalsContainer: {
    width: "40%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
  },
  totalLabel: {
    fontSize: 10,
    color: colors.secondary,
  },
  totalValue: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
    marginTop: 5,
  },
  grandTotalLabel: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
  },
  grandTotalValue: {
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    color: colors.primary,
  },

  // Footer
  footer: {
    marginTop: "auto",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  footerText: {
    fontSize: 8,
    color: colors.secondary,
    lineHeight: 1.5,
  },
  stamp: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: 30, // Circle
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.8,
    transform: "rotate(-15deg)",
  },
  stampText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: colors.accent,
    textAlign: "center",
  },
});

export interface CompanyInfo {
  name: string;
  sub?: string;
  address: string;
  email: string;
  phone: string;
  legal?: string;
  logoUrl?: string | null;
}

interface InvoiceDocumentProps {
  data: InvoiceDisplayData;
  companyInfo?: CompanyInfo;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-AE", {
    style: "currency",
    currency: "AED",
    minimumFractionDigits: 2,
  }).format(amount);

const InvoiceDocument = ({
  data,
  companyInfo = {
    name: "MISK BLOOMING",
    sub: "CHOCOLATES & FLOWERS",
    legal: "MISK BLOOMING CHOCOLATES & FLOWERS (SPS-L.L.C)",
    address: "Location UAE Ajman, Al Tallah - building no2, shop no#4",
    phone: "0504683002",
    email: "miskblooming@gmail.com",
    logoUrl: null
  },
}: InvoiceDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandColumn}>
          {companyInfo.logoUrl ? (
            <Image src={companyInfo.logoUrl} style={styles.logo} />
          ) : (
            <Text style={styles.brandTitle}>{companyInfo.name}</Text>
          )}
          {/* Even with logo, we might want brand name text if logo doesn't include it. 
              But for flexibility, let's keep name if no logo, or maybe both? 
              Commonly invoices have logo top left. 
              Let's show name below logo if logo exists, or just logo. 
              User request 'dynamic', often means 'my logo'. 
          */}
          {companyInfo.logoUrl && <Text style={[styles.brandTitle, { fontSize: 16, marginTop: 4 }]}>{companyInfo.name}</Text>}

          <Text style={styles.brandSub}>{companyInfo.sub}</Text>
          <Text style={[styles.brandSub, { marginTop: 4 }]}>{companyInfo.legal}</Text>
        </View>
        <View style={styles.invoiceTitleColumn}>
          <Text style={styles.invoiceTitle}>INVOICE</Text>
          <Text style={styles.invoiceMetaText}>Invoice #: <Text style={styles.invoiceMetaValue}>{data.id.slice(-6).toUpperCase()}</Text></Text>
          <Text style={styles.invoiceMetaText}>Date: <Text style={styles.invoiceMetaValue}>{data.issueDate}</Text></Text>
          <Text style={styles.invoiceMetaText}>Status: <Text style={[styles.invoiceMetaValue, { color: data.status === 'PAID' ? colors.accent : colors.secondary }]}>{data.status}</Text></Text>
        </View>
      </View>

      {/* Info Section */}
      <View style={styles.infoSection}>
        <View style={styles.infoColumn}>
          <Text style={styles.sectionTitle}>Bill To</Text>
          <Text style={[styles.infoText, styles.infoTextBold]}>{data.customer.name}</Text>
          <Text style={styles.infoText}>{data.customer.address || "N/A"}</Text>
          <Text style={styles.infoText}>{data.customer.city || "Dubai"}, UAE</Text>
          <Text style={styles.infoText}>{data.customer.phone}</Text>
          <Text style={styles.infoText}>{data.customer.email}</Text>
        </View>
        <View style={styles.infoColumn}>
          <Text style={styles.sectionTitle}>Ship To (If different)</Text>
          {/* Assuming Ship To is same as Bill To for simplicty unless we explicitly have shipping address separate in data struct which we do */}
          <Text style={[styles.infoText, styles.infoTextBold]}>{data.customer.name}</Text>
          <Text style={styles.infoText}>{data.customer.address || "N/A"}</Text>
          <Text style={styles.infoText}>{data.customer.city || "Dubai"}, UAE</Text>
        </View>
      </View>

      {/* Table */}
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.th, styles.colProduct]}>Product / Description</Text>
          <Text style={[styles.th, styles.colQty]}>Qty</Text>
          <Text style={[styles.th, styles.colPrice]}>Price</Text>
          <Text style={[styles.th, styles.colTotal]}>Total</Text>
        </View>
        {data.items.map((item, i) => (
          <View key={i} style={[styles.tableRow, { backgroundColor: i % 2 === 0 ? '#fff' : colors.bgLight }]}>
            <Text style={[styles.td, styles.colProduct]}>{item.name}</Text>
            <Text style={[styles.td, styles.colQty]}>{item.quantity}</Text>
            <Text style={[styles.td, styles.colPrice]}>{formatCurrency(item.price)}</Text>
            <Text style={[styles.td, styles.colTotal]}>{formatCurrency(item.total)}</Text>
          </View>
        ))}
      </View>

      {/* Totals */}
      <View style={styles.totalsSection}>
        <View style={styles.totalsContainer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>{formatCurrency(data.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>VAT (5%)</Text>
            <Text style={styles.totalValue}>{formatCurrency(data.taxAmount)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Delivery Fee</Text>
            <Text style={styles.totalValue}>{formatCurrency(data.deliveryFee)}</Text>
          </View>
          {data.discount > 0 && (
            <View style={styles.totalRow}>
              <Text style={[styles.totalLabel, { color: colors.accent }]}>Discount</Text>
              <Text style={[styles.totalValue, { color: colors.accent }]}>- {formatCurrency(data.discount)}</Text>
            </View>
          )}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>{formatCurrency(data.totalAmount)}</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={{ width: '60%' }}>
          <Text style={[styles.footerText, { fontFamily: 'Helvetica-Bold', marginBottom: 4 }]}>Details</Text>
          <Text style={styles.footerText}>
            Phone: {companyInfo.phone} | Email: {companyInfo.email}{"\n"}
            Address: {companyInfo.address}
          </Text>
          <Text style={[styles.footerText, { marginTop: 8, fontStyle: 'italic', fontSize: 7 }]}>
            Thank you for choosing Misk Blooming. We hope to see you again soon!
          </Text>
        </View>
        <View style={styles.stamp}>
          <Text style={styles.stampText}>MISK{"\n"}BLOOMING</Text>
        </View>
      </View>
    </Page>
  </Document>
);

export default InvoiceDocument;

