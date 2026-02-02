import { prisma } from "@/src/lib/db";
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import InvoiceDocument from "@/src/components/pdf/InvoiceDocument";
import React from "react";
import { InvoiceDisplayData } from "@/src/types/invoice";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const orderId = resolvedParams.id;

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    // 1. Fetch Data
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    const storeSettings = await prisma.storeSettings.findFirst();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // 2. Prepare Data for Invoice Component
    // Map Order to InvoiceDisplayData
    const invoiceData: InvoiceDisplayData = {
      id: order.id,
      issueDate: new Date(order.createdAt).toLocaleDateString("en-GB"),
      status: order.paymentStatus,
      customer: {
        name: `${order.firstName} ${order.lastName}`,
        email: order.email,
        phone: order.phone,
        address: order.address,
        city: order.city,
      },
      items: order.items.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        price: item.price, // Use order item price as it captures historical price
        total: item.price * item.quantity,
      })),
      subtotal:
        order.totalAmount +
        (order.discount || 0) -
        (order.deliveryCost || 0) -
        (order.codFee || 0) -
        (order.vatAmount || 0) -
        (order.giftCardFee || 0),
      taxAmount: order.vatAmount || 0,
      discount: order.discount || 0,
      deliveryFee: order.deliveryCost || 0,
      totalAmount: order.totalAmount,
      paymentMethod: order.paymentMethod,
    };

    // Prepare Company Info
    const companyInfo = storeSettings
      ? {
        name: storeSettings.storeName,
        sub: storeSettings.description || "CHOCOLATES & FLOWERS",
        address: storeSettings.address,
        email: storeSettings.supportEmail,
        phone: storeSettings.phoneNumber,
        logoUrl: storeSettings.logoUrl,
        legal: "MISK BLOOMING CHOCOLATES & FLOWERS (SPS-L.L.C)",
      }
      : undefined;

    // 3. Render PDF Stream
    const stream = await renderToStream(
      <InvoiceDocument data={invoiceData} companyInfo={companyInfo} />
    );

    // 4. Return Response
    return new NextResponse(stream as unknown as BodyInit, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=invoice-${orderId}.pdf`,
      },
    });
  } catch (error) {
    console.error("Invoice Generation Error:", error);
    return NextResponse.json(
      {
        error: "Failed to generate invoice",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

