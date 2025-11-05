// app/cookies/page.tsx
import React from "react";

export const metadata = {
  title: "Cookie Policy | YourWebsite",
  description:
    "Learn how we use cookies and similar tracking technologies on our website.",
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen mt-6 bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-10 border border-gray-200">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-semibold text-gray-800">
            Cookie Policy
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Last updated: November 5, 2025
          </p>
        </div>

        {/* CONTENT */}
        <div className="space-y-10 text-gray-700 leading-relaxed">
          {/* SECTION */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              1. What Are Cookies?
            </h2>
            <p>
              Cookies are small text files stored on your device (computer,
              mobile, tablet) when you visit a website. They help websites
              remember your preferences, improve performance, and enhance user
              experience.
            </p>
          </section>

          {/* SECTION */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              2. Types of Cookies We Use
            </h2>
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <ul className="list-disc pl-6 space-y-2">
                <li>
                  <strong>Essential Cookies</strong>: Required for core
                  functionality (security, authentication, access to protected
                  pages).
                </li>
                <li>
                  <strong>Analytics & Performance Cookies</strong>: Help us
                  understand how visitors use our website (Google Analytics,
                  etc.).
                </li>
                <li>
                  <strong>Functional Cookies</strong>: Store your preferences
                  (language, theme, UI settings).
                </li>
                <li>
                  <strong>Advertising/Tracking Cookies</strong>: Track browsing
                  habits to show personalized ads.
                </li>
              </ul>
            </div>
          </section>

          {/* SECTION */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              3. Third-Party Cookies
            </h2>
            <p>
              We may use third-party services such as Google Analytics, Facebook
              Pixel, Hotjar, etc. These services may use their own cookies to
              track and analyze behavior on our website.
            </p>
          </section>

          {/* SECTION */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              4. How to Manage Cookies
            </h2>
            <p>
              You can control or delete cookies anytime through your browser
              settings.
            </p>

            <div className="mt-4 bg-gray-50 rounded-xl p-6 border border-gray-200">
              <p className="font-medium mb-2">Links to manage cookies:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>
                  Chrome:{" "}
                  <a
                    className="text-blue-600 underline"
                    href="https://support.google.com/chrome/answer/95647"
                    target="_blank"
                  >
                    https://support.google.com/chrome/answer/95647
                  </a>
                </li>
                <li>
                  Firefox:{" "}
                  <a
                    className="text-blue-600 underline"
                    href="https://support.mozilla.org/en-US/kb/clear-cookies-and-site-data-firefox"
                    target="_blank"
                  >
                    https://support.mozilla.org
                  </a>
                </li>
                <li>
                  Edge:{" "}
                  <a
                    className="text-blue-600 underline"
                    href="https://support.microsoft.com/en-us/microsoft-edge/delete-cookies"
                    target="_blank"
                  >
                    https://support.microsoft.com
                  </a>
                </li>
              </ul>
            </div>
          </section>

          {/* SECTION */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              5. Changes to This Cookie Policy
            </h2>
            <p>
              We may update this Cookie Policy from time to time. Any changes
              will be posted on this page with a new updated date.
            </p>
          </section>

          {/* SECTION */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              6. Contact Us
            </h2>
            <p>
              If you have any questions regarding this Cookie Policy, contact us
              at:
            </p>
            <p className="mt-2 font-medium text-gray-800">
              support@miskblooming.com
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
