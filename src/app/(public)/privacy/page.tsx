// app/privacy/page.tsx
import React from "react";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Privacy policy detailing how we collect, use, and protect user data.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen mt-14 bg-background text-slate-900 antialiased py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold mt-3 mb-2">Privacy Policy</h1>
        <p className="text-sm text-foreground  mb-8">
          Last updated: November 5, 2025
        </p>

        <div className="prose prose-slate max-w-none">
          <section>
            <h2 className="text-2xl font-bold mt-3">1. Introduction</h2>
            <p>
              We value your privacy. This Privacy Policy explains how we
              collect, use, store, and protect your information when you use our
              website or services.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-3">
              2. Information We Collect
            </h2>
            <ul>
              <li>
                <strong>Personal Data:</strong> name, email, phone (only if you
                submit).
              </li>
              <li>
                <strong>Usage Data:</strong> IP address, browser type, device
                info, analytics data.
              </li>
              <li>
                <strong>Order/Transaction Data:</strong> billing & shipping
                details (if applicable).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-3">
              3. How We Use Your Information
            </h2>
            <ul>
              <li>To provide and improve our services.</li>
              <li>To process orders and transactions.</li>
              <li>
                To communicate updates, support, or promotions (only if you
                opt-in).
              </li>
              <li>For website analytics and performance improvement.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-3">4. Cookies & Tracking</h2>
            <p>
              We use cookies to enhance user experience and analyze site
              traffic. You may disable cookies through browser settings, but
              some features may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-3">5. Third-Party Services</h2>
            <p>
              We may use trusted third-party platforms (payment providers,
              analytics, hosting). They process data according to their
              respective privacy policies.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-3">6. Data Security</h2>
            <p>
              We implement industry-standard security measures to protect data,
              but no method of transmission over the internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-3">7. Your Rights</h2>
            <ul>
              <li>Request access or delete your personal data.</li>
              <li>Opt-out of marketing communications at any time.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-3">8. Children's Privacy</h2>
            <p>
              We do not knowingly collect information from children under 13.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-3">
              9. Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy. The updated version will
              include the revised date at the top.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mt-3">10. Contact</h2>
            <p>
              If you have questions, contact us at:
              <br />
              <a
                href="mailto:privacy@example.com"
                className="text-primary hover:underline"
              >
                privacy@miskblooming.com
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
