import { prisma } from "@/src/lib/db";
import { NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import path from "path";
import { redis } from "@/src/lib/redis";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const resolvedParams = await params;
  const orderId = resolvedParams.id;

  const cache = await redis.get(`orderInvoice:${orderId}`);
  if (cache) {
    return new NextResponse(
      new Uint8Array(Buffer.from(JSON.stringify(cache), "base64")),
      {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename=invoice-${orderId}.pdf`,
        },
      }
    );
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      user: true,
      items: { include: { product: true } },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }
  await redis.set(`orderInvoice:${orderId}`, JSON.stringify(order), {
    ex: 60 * 15, // Cache for 15 minutes
  });
  const regularFont = path.join(
    process.cwd(),
    "public/fonts/Poppins-Regular.ttf"
  );
  const boldFont = path.join(process.cwd(), "public/fonts/Poppins-Bold.ttf");

  const pdfBuffer: Buffer = await new Promise((resolve) => {
    const doc = new PDFDocument({ size: "A4", margin: 50, font: regularFont });
    const chunks: Buffer[] = [];

    doc.registerFont("Poppins", regularFont);
    doc.registerFont("Poppins-Bold", boldFont);
    doc.font("Poppins");

    doc.on("data", (chunk: any) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));

    // -------- Header --------
    const headerTop = doc.y;
    const leftX = 50;
    const rightX = 400;

    doc
      .font("Poppins-Bold")
      .fontSize(22)
      .fillColor("#1F2937")
      .text("Miskblooming", leftX, headerTop);

    doc
      .font("Poppins")
      .fontSize(10)
      .fillColor("#4B5563")
      .text(
        `${process.env.NEXT_PUBLIC_COMPANY_ADDRESS || ""}\nPhone: ${
          process.env.NEXT_PUBLIC_COMPANY_PHONE || ""
        }\nEmail: ${process.env.NEXT_PUBLIC_COMPANY_EMAIL || ""}\nWebsite: ${
          process.env.NEXT_PUBLIC_COMPANY_WEBSITE || ""
        }`,
        leftX,
        headerTop + 30
      );

    doc
      .font("Poppins-Bold")
      .fontSize(16)
      .fillColor("#111827")
      .text("INVOICE", rightX, headerTop);

    // Right side details
    let rightY = headerTop + 20;

    doc
      .font("Poppins")
      .fontSize(8)
      .text(`Order ID: ${order.id}`, rightX, rightY);

    rightY += 25;

    // Order Date
    doc
      .font("Poppins")
      .fontSize(8)
      .text(
        `Order Date: ${new Date(order.createdAt).toLocaleDateString()}`,
        rightX,
        rightY
      );

    // Move cursor below header for next sections
    doc.moveDown(5);

    // -------- Bill To --------
    const billToX = 50;
    let currentY = doc.y;

    doc
      .font("Poppins-Bold")
      .fontSize(12)
      .fillColor("#111827")
      .text("Bill To:", billToX, currentY, { underline: true });

    currentY += 20;

    doc
      .font("Poppins")
      .text(`${order.firstName} (${order.email})`, billToX, currentY);
    currentY += 15;

    if (order.address) {
      doc.text(
        `${order.address}, ${order.city}, ${order.postalCode}, ${order.emirate}`,
        billToX,
        currentY
      );
      currentY += 15;
    }

    doc.text(
      `Payment Method: ${order.paymentMethod || "N/A"}`,
      billToX,
      currentY
    );
    currentY += 15;

    doc.text(`Payment Status: ${order.paymentStatus}`, billToX, currentY);
    currentY += 15;
    doc.text(`Delivery Type: ${order.deliveryType}`, billToX, currentY);
    currentY += 20;

    doc.moveTo(50, currentY).lineTo(550, currentY).stroke();

    doc.moveDown();

    // -------- Table Header --------
    const tableTop = doc.y;
    const itemX = 50,
      skuX = 220,
      unitX = 300,
      qtyX = 370,
      totalX = 440;

    doc
      .font("Poppins-Bold")
      .fontSize(10)
      .fillColor("#111827")
      .text("Product", itemX, tableTop, { width: skuX - itemX - 5 })
      .text("SKU", skuX, tableTop, { width: unitX - skuX - 5 })
      .text("Unit", unitX, tableTop, {
        width: qtyX - unitX - 5,
        align: "right",
      })
      .text("Qty", qtyX, tableTop, { width: totalX - qtyX - 5, align: "right" })
      .text("Total", totalX, tableTop, { width: 70, align: "right" });

    doc.moveDown(0.5);

    // -------- Table Rows --------
    let y = doc.y;
    let calculatedSubtotal = 0;

    order.items.forEach((item: any) => {
      const itemTotal = item.product.price * item.quantity;
      calculatedSubtotal += itemTotal;

      doc
        .font("Poppins")
        .fontSize(10)
        .text(item.product.name, itemX, y, { width: skuX - itemX - 5 })
        .text(item.product.sku || "-", skuX, y, { width: unitX - skuX - 5 })
        .text(item.product.price.toFixed(2), unitX, y, {
          width: qtyX - unitX - 5,
          align: "right",
        })
        .text(item.quantity.toString(), qtyX, y, {
          width: totalX - qtyX - 5,
          align: "right",
        })
        .text(itemTotal.toFixed(2), totalX, y, { width: 70, align: "right" });
      y += 20;
    });

    doc
      .moveTo(50, y + 5)
      .lineTo(550, y + 5)
      .stroke();

    // -------- Summary Section --------
    const summaryX = 350;
    let summaryY = y + 15;

    // Subtotal
    doc
      .font("Poppins")
      .fontSize(10)
      .text("Subtotal:", summaryX, summaryY, { width: 100, align: "right" });
    doc.text(calculatedSubtotal.toFixed(2), summaryX + 100, summaryY, {
      width: 70,
      align: "right",
    });
    summaryY += 20;
    // Discount
    const discount = order.discount || 0;
    doc.text("Discount:", summaryX, summaryY, { width: 100, align: "right" });
    doc.text(
      discount > 0 ? `- ${discount.toFixed(2)}` : "-",
      summaryX + 100,
      summaryY,
      { width: 70, align: "right" }
    );
    summaryY += 20;
    // Delivery Charge
    const delivery = order.deliveryCost || 0;
    doc.text("Delivery:", summaryX, summaryY, { width: 100, align: "right" });
    doc.text(
      delivery > 0 ? delivery.toFixed(2) : "Free",
      summaryX + 100,
      summaryY,
      { width: 70, align: "right" }
    );
    summaryY += 20;

    // COD Fee
    const codFee = order.codFee || 0;
    doc.text("COD Fee:", summaryX, summaryY, { width: 100, align: "right" });
    doc.text(
      codFee > 0 ? codFee.toFixed(2) : "0.00",
      summaryX + 100,
      summaryY,
      { width: 70, align: "right" }
    );
    summaryY += 20;

    // Tax
    const tax = order.vatAmount || 0;
    doc.text("Tax:", summaryX, summaryY, { width: 100, align: "right" });
    doc.text(tax > 0 ? tax.toFixed(2) : "0.00", summaryX + 100, summaryY, {
      width: 70,
      align: "right",
    });
    summaryY += 30;

    // Grand Total
    const grandTotal = calculatedSubtotal + delivery + codFee + tax;
    const grandTotalAfterDiscount = grandTotal - discount;
    doc
      .font("Poppins-Bold")
      .fontSize(12)
      .fillColor("#111827")
      .text("Grand Total:", summaryX, summaryY, { width: 100, align: "right" });
    doc.text(grandTotalAfterDiscount.toFixed(2), summaryX + 100, summaryY, {
      width: 70,
      align: "right",
    });

    // -------- Footer --------
    const footerHeight = 50;
    const footerY = doc.page.height - doc.page.margins.bottom - footerHeight;
    doc
      .font("Poppins")
      .fontSize(10)
      .fillColor("#6B7280")
      .text(
        "Thank you for shopping with YourShop. Need help? support@example.com",
        50,
        footerY,
        { align: "center", width: 500 }
      );

    doc.end();
  });

  return new NextResponse(new Uint8Array(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename=invoice-${order.id}.pdf`,
    },
  });
}
