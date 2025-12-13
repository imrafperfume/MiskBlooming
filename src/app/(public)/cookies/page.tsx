// app/cookies/page.tsx
import React from "react";

export const metadata = {
  title: "Cookie Policy | YourWebsite",
  description:
    "Learn how we use cookies and similar tracking technologies on our website.",
};

export default function CookiePolicy({
  effectiveDate = "November 1, 2025",
  lastUpdated = "October 10, 2025",
}) {
  return (
    <section className="max-w-4xl mx-auto mt-16 p-6 bg-background shadow-lg rounded-2xl border border-gray-100">
      <header className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Cookie Policy – Misk Blooming UAE
        </h1>
        <p className="mt-1 text-sm text-foreground ">
          Effective Date:{" "}
          <span className="font-medium text-gray-700">{effectiveDate}</span>
        </p>
        <p className="text-sm text-foreground ">
          Last Updated:{" "}
          <span className="font-medium text-gray-700">{lastUpdated}</span>
        </p>
        <p className="mt-3 text-foreground ">
          Welcome to Misk Blooming UAE. This Cookie Policy explains how and why
          we use cookies and similar tracking technologies when you visit or
          shop on our website.
        </p>
      </header>

      <div className="space-y-6">
        <article className="bg-background p-4 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            1. About Misk Blooming UAE
          </h2>
          <p className="mt-2 text-gray-700">
            Misk Blooming is a premium online flower and chocolate gifting brand
            offering luxury flower arrangements, handcrafted chocolates, and
            curated gifts with same-day delivery across Ajman, Dubai, Sharjah,
            and the UAE.
          </p>
          <address className="not-italic mt-3 text-gray-700">
            <p className="font-medium">Business Name: MISK BLOOMING</p>
            <p className="text-sm">
              Location: مويهات جنب نستو - هایبرماركت 2 شارع التلة - Ajman, UAE
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

        <article className="bg-background p-4 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            2. What Are Cookies?
          </h2>
          <p className="mt-2 text-gray-700">
            Cookies are small text files stored on your device (computer,
            tablet, or mobile) when you visit a website. They help websites run
            efficiently, remember your preferences, and provide a more
            personalized shopping experience.
          </p>
          <ul className="mt-3 list-disc pl-5 text-gray-700 space-y-1">
            <li>Keep your shopping cart and checkout secure</li>
            <li>Understand how customers browse our product collections</li>
            <li>Show you relevant offers through remarketing campaigns</li>
            <li>Improve website performance and loading speed</li>
          </ul>
          <p className="mt-2 text-foreground  text-sm">
            Cookies do not give us access to your personal device or private
            data.
          </p>
        </article>

        <article className="bg-background p-4 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            3. Types of Cookies We Use
          </h2>

          <h3 className="mt-4 font-medium text-gray-900">
            3.1 Essential Cookies
          </h3>
          <p className="text-gray-700 mt-1">
            Required for the website to function properly.
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1 mt-1">
            <li>Enable secure login and checkout</li>
            <li>Keep cart contents saved during browsing</li>
            <li>Support basic website navigation</li>
          </ul>
          <p className="text-sm text-foreground mt-1">
            These cookies cannot be disabled.
          </p>

          <h3 className="mt-4 font-medium text-gray-900">
            3.2 Performance & Analytics Cookies
          </h3>
          <p className="text-gray-700 mt-1">
            Used to analyze visitor behavior and improve website performance. We
            use Google Analytics to collect anonymous usage data.
          </p>

          <h3 className="mt-4 font-medium text-gray-900">
            3.3 Functionality Cookies
          </h3>
          <p className="text-gray-700 mt-1">
            Enhance personalization by remembering preferences such as language,
            region, and recently viewed products.
          </p>

          <h3 className="mt-4 font-medium text-gray-900">
            3.4 Advertising & Targeting Cookies
          </h3>
          <p className="text-gray-700 mt-1">
            Used for personalized promotions and remarketing campaigns on
            platforms like Google and Meta.
          </p>
        </article>

        <article className="bg-background p-4 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            4. Managing & Disabling Cookies
          </h2>
          <p className="mt-2 text-gray-700">
            You can manage or disable cookies anytime through your browser
            settings or Google Analytics Opt‑Out tools.
          </p>
          <p className="mt-2 text-sm text-foreground ">
            Disabling essential cookies may affect our checkout and order
            placement features.
          </p>
        </article>

        <article className="bg-background p-4 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            5. Why Cookies Matter
          </h2>
          <ul className="mt-2 list-disc pl-5 text-gray-700 space-y-1">
            <li>Ensure faster page loading</li>
            <li>Provide secure payment & checkout</li>
            <li>Enable personalized product suggestions</li>
            <li>Improve seasonal campaign performance</li>
          </ul>
        </article>

        <article className="bg-background p-4 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            6. Updates to This Cookie Policy
          </h2>
          <p className="mt-2 text-gray-700">
            We may update this policy to reflect changes in technology, legal
            requirements, or our business practices.
          </p>
        </article>

        <article className="bg-background p-4 rounded-lg border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">7. Contact Us</h2>
          <address className="not-italic mt-2 text-gray-700">
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
    </section>
  );
}
