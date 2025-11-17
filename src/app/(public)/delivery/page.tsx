import React from "react";

export default function MiskBloomingShipping({ lastUpdated = "Oct 10, 2025" }) {
  return (
    <section className="max-w-4xl mt-14 mx-auto p-6 bg-background shadow-lg rounded-2xl border border-gray-100">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Shipping & Delivery Information — Misk Blooming UAE
        </h1>
        <p className="mt-1 text-sm text-foreground ">
          Last Updated:{" "}
          <span className="font-medium text-gray-700">{lastUpdated}</span>
        </p>
        <p className="mt-3 text-foreground ">
          Welcome to Misk Blooming UAE — your trusted online destination for
          fresh flowers, luxury chocolates, and elegant gifts across the UAE. We
          take pride in offering fast, reliable, and beautifully presented
          deliveries, ensuring that every order arrives on time and in perfect
          condition.
        </p>
      </header>

      <div className="space-y-6">
        <article className="bg-background p-4 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            1. Same-Day Delivery
          </h2>
          <p className="mt-2 text-foreground ">
            We offer same-day delivery for eligible flower, chocolate, and gift
            orders placed before our daily cut-off times:
          </p>

          <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-gray-700">
            <li className="px-3 py-2 bg-background rounded-md shadow-sm">
              Ajman: Same-day delivery for orders placed before 8:00 PM
            </li>
            <li className="px-3 py-2 bg-background rounded-md shadow-sm">
              Dubai & Sharjah: Same-day delivery for orders placed before 7:00
              PM
            </li>
            <li className="px-3 py-2 bg-background rounded-md shadow-sm">
              Other Emirates: Delivery depends on location and order time
              (usually within 24 hours)
            </li>
          </ul>

          <p className="mt-3 text-sm text-foreground ">
            During busy seasons such as Valentine’s Day, Eid, Mother’s Day, and
            other UAE holidays, we recommend placing your order early, as
            cut-off times may be earlier.
          </p>
        </article>

        <article className="bg-background p-4 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            2. Service Areas & Delivery Charges
          </h2>
          <p className="mt-2 text-foreground ">
            We deliver across Ajman, Dubai, Sharjah, and other Emirates in the
            UAE. Below is our delivery charge chart:
          </p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="text-sm text-foreground ">
                  <th className="px-3 py-2">Location</th>
                  <th className="px-3 py-2">Delivery Fee (AED)</th>
                  <th className="px-3 py-2">Free Delivery Threshold</th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                <tr className="border-t">
                  <td className="px-3 py-2">Ajman</td>
                  <td className="px-3 py-2">AED 20</td>
                  <td className="px-3 py-2">
                    Free delivery on orders AED 200+
                  </td>
                </tr>
                <tr className="border-t bg-background">
                  <td className="px-3 py-2">Dubai & Sharjah</td>
                  <td className="px-3 py-2">AED 35</td>
                  <td className="px-3 py-2">
                    Free delivery on orders AED 300+
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-3 py-2">Other Emirates</td>
                  <td className="px-3 py-2">AED 50</td>
                  <td className="px-3 py-2">
                    Free delivery on orders AED 400+
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-sm text-foreground ">
            Free delivery applies when your order total (before VAT & discounts)
            meets or exceeds the threshold shown above.
          </p>
        </article>

        <article className="bg-background p-4 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            3. Delivery Timeframes
          </h2>

          <div className="mt-3 grid sm:grid-cols-2 gap-4 text-gray-700">
            <div className="bg-background p-3 rounded-md border">
              <p className="font-medium">Ajman</p>
              <p className="text-sm">
                Regular Delivery Window: 10:00 AM – 10:00 PM
              </p>
              <p className="text-sm">Same-Day Cut-Off Time: 8:00 PM</p>
            </div>
            <div className="bg-background p-3 rounded-md border">
              <p className="font-medium">Dubai & Sharjah</p>
              <p className="text-sm">
                Regular Delivery Window: 10:00 AM – 9:30 PM
              </p>
              <p className="text-sm">Same-Day Cut-Off Time: 7:00 PM</p>
            </div>
            <div className="sm:col-span-2 bg-background p-3 rounded-md border">
              <p className="font-medium">Other Emirates</p>
              <p className="text-sm">
                Next-day or 24-hour delivery. Cut-off depends on area & order
                time.
              </p>
            </div>
          </div>

          <p className="mt-3 text-foreground ">
            Scheduled Delivery: You can select your preferred delivery date and
            time during checkout — perfect for birthdays, anniversaries, or
            surprise occasions.
          </p>
        </article>

        <article className="bg-background p-4 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            4. How We Handle Your Flowers & Gifts
          </h2>
          <ul className="mt-2 list-disc pl-5 text-gray-700">
            <li>
              All flower arrangements are prepared fresh daily by our
              professional florists.
            </li>
            <li>
              Chocolates are packed using moisture and temperature protection to
              maintain premium quality.
            </li>
            <li>
              We use luxury packaging for all gifts, including branded ribbons
              and message cards.
            </li>
            <li>
              During warmer months, deliveries are made in climate-controlled
              vehicles to keep products in perfect condition.
            </li>
          </ul>
        </article>

        <article className="bg-background p-4 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            5. Order Accuracy & Delivery Instructions
          </h2>
          <p className="mt-2 text-gray-700">
            To ensure smooth and timely delivery, please provide complete and
            accurate address details, including landmarks, building name, floor,
            and apartment number. Share a valid recipient phone number for
            coordination.
          </p>
          <p className="mt-2 text-foreground  text-sm">
            If the recipient is unavailable, we may contact them to arrange
            redelivery or leave the order in a safe location (if permitted).
            Incorrect addresses or unreachable recipients may result in
            additional delivery charges for redelivery.
          </p>
        </article>

        <article className="bg-background p-4 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            6. Delivery Exceptions & Restrictions
          </h2>
          <ul className="mt-2 list-disc pl-5 text-gray-700">
            <li>
              We currently do not deliver to P.O. Box addresses or certain
              restricted zones.
            </li>
            <li>
              Some remote areas may not be eligible for same-day delivery.
            </li>
            <li>
              Delivery times may occasionally be affected by traffic, weather,
              or unforeseen circumstances.
            </li>
          </ul>
        </article>

        <article className="bg-background p-4 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            7. Order Tracking & Notifications
          </h2>
          <p className="mt-2 text-gray-700">
            Once your order has been dispatched, you will receive a confirmation
            email or SMS, delivery time slot notifications (when available), and
            real-time updates if there are any delays or changes. Our goal is to
            keep you fully informed at every step.
          </p>
        </article>

        <article className="bg-background p-4 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            8. Contact Our Delivery Support Team
          </h2>
          <address className="not-italic mt-3 text-gray-700">
            <p className="font-medium">Misk Blooming UAE</p>
            <p className="text-sm">
              مويهات جنب نستو - هایبرماركت 2 شارع التلة - Ajman, UAE
            </p>
            <p className="mt-2 text-sm">
              Email:{" "}
              <a href="mailto:support@miskblooming.com" className="underline">
                support@miskblooming.com
              </a>
            </p>
            <p className="text-sm">
              Phone:{" "}
              <a href="tel:+971564726740" className="underline">
                +971 56 472 6740
              </a>
            </p>
            <p className="text-sm">
              Website:{" "}
              <a href="https://www.miskblooming.com" className="underline">
                www.miskblooming.com
              </a>
            </p>
          </address>
        </article>
      </div>

      <footer className="mt-6 text-center text-sm text-foreground ">
        <p>
          For any delivery help or special requests, please contact our delivery
          support team.
        </p>
      </footer>
    </section>
  );
}
