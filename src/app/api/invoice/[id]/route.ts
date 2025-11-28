import { prisma } from "@/src/lib/db";
import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import path from "path";
import fs from "fs";

// --- Configuration ---
const COLORS = {
  navy: "#0B1E3B",
  green: "#15803d",
  textMain: "#1f2937",
  textMuted: "#6b7280",
  bgLight: "#f9fafb",
  white: "#ffffff",
};

const COMPANY_INFO = {
  name: "MISK BLOOMING",
  sub: "CHOCOLATES & FLOWERS",
  address: "Location UAE Ajman, Al Tallah",
  building: "building no2, shop no#4",
  email: "miskblooming@gmail.com",
  phone: "0504683002",
  instagram: "Miskblooming.ae",
};

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const orderId = resolvedParams.id;

    // 1. Fetch Data
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 2. Generate PDF
    const pdfBuffer = await generateInvoicePDF(order);

    // 3. Return Response
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${orderId}.pdf`,
      },
    });
  } catch (error) {
    console.error("Invoice Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}

/**
 * Core PDF Generation Logic
 */
async function generateInvoicePDF(order: any): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // Create Document
    const doc = new PDFDocument({ size: "A4", margin: 40, bufferPages: true });
    const chunks: Buffer[] = [];

    doc.on("data", (chunk: any) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (err: Error) => reject(err));

    // --- Font Setup ---
    // Make sure these files exist in /public/fonts/ to avoid "Helvetica" fallback
    const regularFontPath = path.join(
      process.cwd(),
      "public/fonts/Poppins-Regular.ttf"
    );
    const boldFontPath = path.join(
      process.cwd(),
      "public/fonts/Poppins-Bold.ttf"
    );

    let fontRegular = "Helvetica";
    let fontBold = "Helvetica-Bold";

    // Only use custom fonts if files actually exist
    if (fs.existsSync(regularFontPath) && fs.existsSync(boldFontPath)) {
      doc.registerFont("Poppins", regularFontPath);
      doc.registerFont("Poppins-Bold", boldFontPath);
      fontRegular = "Poppins";
      fontBold = "Poppins-Bold";
    }

    // --- Layout ---
    const startX = 40;
    const endX = 550;
    let currentY = 50;

    // 1. HEADER
    doc
      .font(fontRegular)
      .fontSize(26)
      .fillColor(COLORS.textMain)
      .text(COMPANY_INFO.name, 0, currentY, {
        align: "center",
        characterSpacing: 2,
      });
    currentY += 35;

    doc
      .font(fontRegular)
      .fontSize(12)
      .fillColor(COLORS.textMuted)
      .text(COMPANY_INFO.sub, 0, currentY, {
        align: "center",
        characterSpacing: 3,
      });
    currentY += 35;

    doc
      .font(fontBold)
      .fontSize(16)
      .fillColor(COLORS.navy)
      .text("INVOICE", 0, currentY, { align: "center", underline: true });
    currentY += 50;

    // 2. INFO GRID
    const col1X = startX;
    const col2X = 380;
    const labelWidth = 80;

    const drawInfoRow = (
      x: number,
      label: string,
      value: string,
      isGreen = false
    ) => {
      const startY = doc.y;
      doc
        .font(fontBold)
        .fontSize(9)
        .fillColor(isGreen ? COLORS.green : COLORS.navy)
        .text(label, x, startY, { width: labelWidth });

      doc
        .font(fontRegular)
        .fillColor(COLORS.textMain)
        .text(value, x + labelWidth + 5, startY);

      return doc.y - startY;
    };

    const gridTopY = currentY;

    // Left Column
    doc.y = gridTopY;
    drawInfoRow(col1X, "BILLING TO:", "Walk-in Customer", true);
    doc.moveDown(0.5);
    drawInfoRow(col1X, "NAME:", order.firstName || "Guest", true);
    doc.moveDown(0.5);
    drawInfoRow(
      col1X,
      "ADDRESS:",
      order.address ? `${order.city}, UAE` : "UAE",
      true
    );

    // Right Column
    doc.y = gridTopY;
    drawInfoRow(col2X, "INVOICE #", order.id.slice(-6).toUpperCase(), true);
    doc.moveDown(0.5);
    drawInfoRow(
      col2X,
      "DATE ISSUED:",
      new Date(order.createdAt).toLocaleDateString("en-GB"),
      true
    );

    currentY = doc.y + 40;

    // 3. TABLE
    const tableHeaders = ["PRODUCT", "PRICE", "QTY", "TOTAL"];
    const colWidths = [240, 90, 60, 100];
    const tableX = startX;

    // Header BG
    doc.rect(tableX, currentY, endX - startX, 25).fill(COLORS.navy);

    // Header Text
    let xOffset = tableX + 10;
    doc.fillColor(COLORS.white).font(fontRegular).fontSize(10);
    doc.text(tableHeaders[0], xOffset, currentY + 7);
    xOffset += colWidths[0];
    doc.text(tableHeaders[1], xOffset, currentY + 7, {
      width: colWidths[1],
      align: "center",
    });
    xOffset += colWidths[1];
    doc.text(tableHeaders[2], xOffset, currentY + 7, {
      width: colWidths[2],
      align: "center",
    });
    xOffset += colWidths[2];
    doc.text(tableHeaders[3], xOffset, currentY + 7, {
      width: colWidths[3] - 20,
      align: "right",
    });

    currentY += 25;

    // Rows
    let subtotal = 0;
    order.items.forEach((item: any, index: number) => {
      const itemTotal = item.product.price * item.quantity;
      subtotal += itemTotal;
      const rowHeight = 30;

      if (index % 2 === 0) {
        doc
          .rect(tableX, currentY, endX - startX, rowHeight)
          .fill(COLORS.bgLight);
      }

      doc.fillColor(COLORS.textMain).font(fontRegular).fontSize(10);
      const textY = currentY + 9;
      let rowX = tableX + 10;

      doc.text(item.product.name, rowX, textY, {
        width: colWidths[0] - 10,
        lineBreak: false,
        ellipsis: true,
      });
      rowX += colWidths[0];
      doc.text(item.product.price.toFixed(2), rowX, textY, {
        width: colWidths[1],
        align: "center",
      });
      rowX += colWidths[1];
      doc.text(item.quantity.toString(), rowX, textY, {
        width: colWidths[2],
        align: "center",
      });
      rowX += colWidths[2];
      doc.text(itemTotal.toFixed(2), rowX, textY, {
        width: colWidths[3] - 20,
        align: "right",
      });

      currentY += rowHeight;
    });

    // Fillers
    const minRows = 4;
    for (let i = 0; i < Math.max(0, minRows - order.items.length); i++) {
      if ((order.items.length + i) % 2 === 0)
        doc.rect(tableX, currentY, endX - startX, 30).fill(COLORS.bgLight);
      currentY += 30;
    }
    currentY += 20;

    // 4. FOOTER
    if (currentY > 650) {
      doc.addPage();
      currentY = 50;
    }

    const footerLeftX = startX;
    const footerRightX = 350;
    let leftY = currentY;

    // Payment Info
    doc.font(fontRegular).fontSize(9).fillColor(COLORS.textMain);
    doc.text("Payment Info:", footerLeftX, leftY);
    leftY += 15;
    doc.text("Account #: ----------------", footerLeftX, leftY);
    leftY += 15;
    doc.text("Bank: ----------------", footerLeftX, leftY);
    leftY += 25;

    doc.fontSize(8).fillColor(COLORS.textMuted);
    doc.text(`${COMPANY_INFO.name} (sps-l.l.c)`, footerLeftX, leftY);
    leftY += 12;
    doc.text(COMPANY_INFO.address, footerLeftX, leftY);
    leftY += 12;
    doc.text(COMPANY_INFO.building, footerLeftX, leftY);
    leftY += 30;

    // Stamp
    const stampY = leftY;
    doc.save();
    doc
      .circle(footerLeftX + 40, stampY + 20, 30)
      .lineWidth(2)
      .strokeColor("#1e40af")
      .stroke();
    doc.rotate(-15, { origin: [footerLeftX + 40, stampY + 20] });
    doc
      .font(fontBold)
      .fontSize(8)
      .fillColor("#1e40af")
      .text("MISK", footerLeftX + 25, stampY + 12)
      .text("BLOOMING", footerLeftX + 20, stampY + 22);
    doc.restore();

    // Totals
    let rightY = currentY;
    const vat = order.vatAmount || 0;
    const discount = order.discount || 0;
    const grandTotal = subtotal + vat - discount;

    const drawTotal = (l: string, v: string, isBold = false) => {
      doc.font(isBold ? fontBold : fontRegular).fontSize(isBold ? 11 : 9);
      doc.fillColor(COLORS.green).text(l, footerRightX, rightY, { width: 100 });
      doc
        .fillColor(COLORS.textMain)
        .text(v, footerRightX + 100, rightY, { width: 80, align: "right" });
      rightY += 20;
    };

    drawTotal("SUBTOTAL", subtotal.toFixed(2));
    if (discount > 0) drawTotal("DISCOUNT", `- ${discount.toFixed(2)}`);
    drawTotal("VAT", vat.toFixed(2));
    rightY += 5;
    drawTotal("TOTAL PRICE", grandTotal.toFixed(2), true);

    // End
    doc.end();
  });
}
