// app/terms/page.tsx
import React from "react";

export const metadata = {
  title: "Terms & Conditions",
  description:
    "Terms of Service outlining rules, responsibilities, and acceptable usage of our website.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background mt-14 text-slate-900 antialiased py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mb-2">Terms & Conditions</h1>
        <p className="text-sm text-foreground  mb-8">
          Last updated: November 5, 2025
        </p>

        <div className="prose prose-slate max-w-none">
          <section>
            <h2 className="text-2xl mt-14 font-semibold">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using our website or services, you agree to be
              bound by these Terms & Conditions. If you do not agree, you may
              not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mt-14 font-semibold">
              2. Use of Our Services
            </h2>
            <p>
              You agree to use our website only for legal and authorized
              purposes. You are responsible for ensuring your use complies with
              applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mt-14 font-semibold">
              3. Account Responsibilities
            </h2>
            <ul>
              <li>
                You are responsible for maintaining the confidentiality of your
                account credentials.
              </li>
              <li>
                You must provide accurate and complete information when creating
                an account.
              </li>
              <li>
                You are fully responsible for activities that occur under your
                account.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl mt-14 font-semibold">
              4. Purchases & Payments
            </h2>
            <p>
              If you order products or services, you agree to provide valid
              payment details. All payments are processed through secure
              third-party platforms.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mt-14 font-semibold">
              5. Refund & Cancellation
            </h2>
            <p>
              Refund eligibility depends on product/service type. Digital
              products (like files, downloadable content, PDFs, memberships,
              etc.) are generally non-refundable once delivered.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mt-14 font-semibold">
              6. Prohibited Activities
            </h2>
            <p>You agree NOT to:</p>
            <ul>
              <li>Hack, modify, or disrupt our website or servers.</li>
              <li>
                Copy, distribute, or resell our content without written
                permission.
              </li>
              <li>Use automated bots or scrapers without authorization.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl mt-14 font-semibold">
              7. Intellectual Property
            </h2>
            <p>
              All content, logo, graphics, design, text, software, and media are
              owned by us and protected under copyright law. Reproduction or
              distribution without permission is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mt-14 font-semibold">
              8. Limitation of Liability
            </h2>
            <p>
              We are not responsible for any direct or indirect damages caused
              by your use or inability to use the website.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mt-14 font-semibold">
              9. Changes to Terms
            </h2>
            <p>
              We may update these Terms & Conditions at any time. Changes will
              be posted with the updated date at the top of this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl mt-14 font-semibold">10. Contact Us</h2>
            <p>
              If you have any questions regarding these terms, contact us at:
              <br />
              <a
                href="mailto:support@example.com"
                className="text-primary hover:underline"
              >
                support@miskblooming.com
              </a>
            </p>
          </section>

          <footer className="mt-8 text-sm text-foreground ">
            © {new Date().getFullYear()} Miskblooming. All rights reserved.
          </footer>
        </div>
      </div>
    </main>
  );
}
