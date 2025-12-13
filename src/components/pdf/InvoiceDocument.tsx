"use client";

import React from "react";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Svg,
  Path,
} from "@react-pdf/renderer";

// --- NO Font.register calls needed! ---

const colors = {
  navy: "#0B1E3B",
  emerald: "#059669",
  textMain: "#1f2937",
  textLight: "#6b7280",
  bgGray: "#f3f4f6",
  white: "#ffffff",
  blueAccent: "#2563eb",
};

const styles = StyleSheet.create({
  // Use 'Helvetica' (Standard Sans-Serif) instead of Lato
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    padding: 40,
    backgroundColor: "#ffffff",
    color: colors.textMain,
  },

  headerContainer: { alignItems: "center", marginBottom: 30 },

  // Use 'Times-Roman' (Standard Serif) to look like Playfair Display
  brandTitle: {
    fontFamily: "Times-Roman",
    fontSize: 28,
    color: colors.textMain,
    textTransform: "uppercase",
    letterSpacing: 2,
    marginBottom: 5,
  },

  brandSub: {
    fontSize: 10,
    color: colors.textLight,
    textTransform: "uppercase",
    letterSpacing: 4,
    marginBottom: 20,
  },

  invoiceTitleWrapper: {
    borderBottomWidth: 2,
    borderBottomColor: colors.navy,
    paddingBottom: 3,
    paddingHorizontal: 10,
  },

  invoiceTitle: {
    fontFamily: "Times-Roman",
    fontSize: 16,
    color: colors.navy,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 30,
  },
  infoCol: { flexDirection: "column", gap: 4 },
  infoRow: { flexDirection: "row", alignItems: "center", marginBottom: 2 },

  // Use 'Helvetica-Bold' for labels
  label: {
    color: colors.emerald,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    textTransform: "uppercase",
    marginRight: 5,
    width: 70,
  },

  value: { fontSize: 9, textTransform: "uppercase" },

  labelRight: {
    color: colors.emerald,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    textTransform: "uppercase",
    marginRight: 5,
    textAlign: "right",
  },

  table: { marginBottom: 30 },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: colors.navy,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
  },

  th: {
    color: colors.white,
    fontSize: 8,
    textTransform: "uppercase",
    fontFamily: "Helvetica-Bold",
  },

  tableRow: {
    flexDirection: "row",
    backgroundColor: colors.bgGray,
    borderBottomWidth: 1,
    borderBottomColor: colors.white,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
  },

  td: { fontSize: 9, color: colors.textMain },
  col1: { width: "45%" },
  col2: { width: "15%", textAlign: "center" },
  col3: { width: "15%", textAlign: "center" },
  col4: { width: "25%", textAlign: "right" },

  footerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
  },
  leftCol: { width: "55%" },
  rightCol: { width: "40%", justifyContent: "space-between" },

  paymentInfo: { marginBottom: 20 },
  paymentText: { fontSize: 9, marginBottom: 2, color: colors.textMain },
  legalText: {
    fontSize: 7,
    color: colors.textLight,
    marginBottom: 20,
    lineHeight: 1.5,
    textTransform: "uppercase",
  },

  stampContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.blueAccent,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    transform: "rotate(-12deg)",
  },

  stampText: {
    color: colors.blueAccent,
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },

  sigRow: { flexDirection: "row", alignItems: "flex-end", marginBottom: 15 },
  sigLabel: { fontSize: 9, marginRight: 5, width: 100 },
  sigLine: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#9ca3af",
    flex: 1,
    height: 1,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  totalLabel: {
    color: colors.emerald,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
  },
  totalValue: { fontSize: 9, fontFamily: "Helvetica-Bold" },
  grandTotal: { fontSize: 12, marginTop: 5 },

  contactRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 5,
  },
  contactText: { fontSize: 8, marginRight: 8 },
  iconBox: {
    width: 14,
    height: 14,
    backgroundColor: colors.navy,
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
  },
});

// Helper for Icons
const ContactItem = ({ text, type }: { text: string; type: string }) => (
  <View style={styles.contactRow}>
    <Text style={styles.contactText}>{text}</Text>
    <View style={styles.iconBox}>
      <Svg width={8} height={8} viewBox="0 0 24 24">
        {type === "mail" && (
          <Path
            fill="white"
            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
          />
        )}
        {type === "phone" && (
          <Path
            fill="white"
            d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
          />
        )}
        {type === "insta" && (
          <Path
            fill="white"
            d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z M17.5 6.5h.01 M16 2H8C4.69 2 2 4.69 2 8v8c0 3.31 2.69 6 6 6h8c3.31 0 6-2.69 6-6V8c0-3.31-2.69-6-6-6z"
            stroke="white"
            strokeWidth={2}
          />
        )}
      </Svg>
    </View>
  </View>
);

const InvoiceDocument = ({ sale }: { sale: any }) => {
  const company = {
    name: "MISK BLOOMING",
    sub: "CHOCOLATES & FLOWERS",
    legal: "MISK BLOOMING CHOCOLATES & FLOWERS (SPS-L.L.C)",
    address: "Location UAE Ajman, Al Tallah",
    building: "building no2, shop no#4",
    phone: "0504683002",
    email: "miskblooming@gmail.com",
    insta: "Miskblooming.ae",
  };

  const formatNum = (num: number) => num.toFixed(2);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <Text style={styles.brandTitle}>{company.name}</Text>
          <Text style={styles.brandSub}>{company.sub}</Text>
          <View style={styles.invoiceTitleWrapper}>
            <Text style={styles.invoiceTitle}>Invoice</Text>
          </View>
        </View>

        {/* Info Grid */}
        {/* <View style={styles.infoContainer}>
          <View style={styles.infoCol}>
            <View style={styles.infoRow}>
              <Text style={styles.label}>BILLING TO:</Text>
              <Text style={styles.value}>Cards Palace</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>NAME:</Text>
              <Text style={styles.value}>HANI</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>ADDRESS:</Text>
              <Text style={styles.value}>ABU DHABI, UAE</Text>
            </View>
          </View>
          <View style={styles.infoCol}>
            <View style={[styles.infoRow, { justifyContent: "flex-end" }]}>
              <Text style={styles.labelRight}>INVOICE #</Text>
              <Text style={styles.value}>
                {sale.id.slice(-6).toUpperCase()}
              </Text>
            </View>
            <View style={[styles.infoRow, { justifyContent: "flex-end" }]}>
              <Text style={styles.labelRight}>DATE ISSUED:</Text>
              <Text style={styles.value}>
                {new Date(sale.createdAt).toLocaleDateString("en-GB")}
              </Text>
            </View>
          </View>
        </View> */}

        {/* Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.th, styles.col1]}>Product</Text>
            <Text style={[styles.th, styles.col2]}>Price</Text>
            <Text style={[styles.th, styles.col3]}>Qty</Text>
            <Text style={[styles.th, styles.col4]}>Total</Text>
          </View>
          {sale.orderItems.map((item: any, i: number) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.td, styles.col1]}>{item.product.name}</Text>
              <Text style={[styles.td, styles.col2]}>
                {formatNum(item.product.price)}
              </Text>
              <Text style={[styles.td, styles.col3]}>
                {item.quantity.toString().padStart(2, "0")}
              </Text>
              <Text style={[styles.td, styles.col4]}>
                {formatNum(item.product.price * item.quantity)}
              </Text>
            </View>
          ))}
          {Array.from({ length: Math.max(0, 4 - sale.orderItems.length) }).map(
            (_, i) => (
              <View
                key={`fill-${i}`}
                style={[styles.tableRow, { height: 25 }]}
              />
            )
          )}
        </View>

        {/* Footer Area */}
        <View style={styles.footerContainer}>
          {/* Left Column */}
          <View style={styles.leftCol}>
            {/* <View style={styles.paymentInfo}>
              <Text style={styles.paymentText}>Payment Info:</Text>
              <Text style={styles.paymentText}>Account#:</Text>
              <Text style={styles.paymentText}>A/C Name:</Text>
              <Text style={styles.paymentText}>Bank Details:</Text>
            </View> */}

            <View style={{ marginBottom: 15 }}>
              <Text style={styles.legalText}>
                {company.legal}
                {"\n"}
                Address: {company.address}
                {"\n"}
                {company.building}
              </Text>
            </View>

            <View style={styles.stampContainer}>
              <Text style={styles.stampText}>STAMP{"\n"}HERE</Text>
            </View>

            <View style={styles.sigRow}>
              <Text style={styles.sigLabel}>Misk Blooming:</Text>
              <View style={styles.sigLine} />
            </View>
            <View style={styles.sigRow}>
              <Text style={styles.sigLabel}>Receiver Sig:</Text>
              <View style={styles.sigLine} />
            </View>
          </View>

          {/* Right Column */}
          <View style={styles.rightCol}>
            <View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Subtotal</Text>
                <Text style={styles.totalValue}>
                  {formatNum(sale.subtotal)}
                </Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>VAT</Text>
                <Text style={styles.totalValue}>
                  {sale.vat > 0 ? formatNum(sale.vat) : "0.00"}
                </Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Discount</Text>
                <Text style={styles.totalValue}>
                  {sale.discount > 0 ? formatNum(sale.discount) : "0.00"}
                </Text>
              </View>
              <View style={[styles.totalRow, { marginTop: 5 }]}>
                <Text style={styles.totalLabel}>Total Price</Text>
                <Text style={[styles.totalValue, styles.grandTotal]}>
                  {formatNum(sale.grandTotal)}
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 40 }}>
              <ContactItem text={company.email} type="mail" />
              <ContactItem text={company.phone} type="phone" />
              <ContactItem text={company.insta} type="insta" />
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default InvoiceDocument;
