import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';
import dotenv from 'dotenv';

dotenv.config();
const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
    const settings = await prisma.storeSettings.findFirst();

    if (!settings) {
        console.error('No store settings found to update.');
        return;
    }

    const privacyPolicy = `
    <h2>1. Introduction</h2>
    <p>We value your privacy. This Privacy Policy explains how we collect, use, store, and protect your information when you use our website or services.</p>
    
    <h2>2. Information We Collect</h2>
    <ul>
      <li><strong>Personal Data:</strong> name, email, phone (only if you submit).</li>
      <li><strong>Usage Data:</strong> IP address, browser type, device info, analytics data.</li>
      <li><strong>Order/Transaction Data:</strong> billing & shipping details (if applicable).</li>
    </ul>

    <h2>3. How We Use Your Information</h2>
    <ul>
      <li>To provide and improve our services.</li>
      <li>To process orders and transactions.</li>
      <li>To communicate updates, support, or promotions (only if you opt-in).</li>
      <li>For website analytics and performance improvement.</li>
    </ul>

    <h2>4. Cookies & Tracking</h2>
    <p>We use cookies to enhance user experience and analyze site traffic. You may disable cookies through browser settings, but some features may not function properly.</p>

    <h2>5. Third-Party Services</h2>
    <p>We may use trusted third-party platforms (payment providers, analytics, hosting). They process data according to their respective privacy policies.</p>

    <h2>6. Data Security</h2>
    <p>We implement industry-standard security measures to protect data, but no method of transmission over the internet is 100% secure.</p>

    <h2>7. Your Rights</h2>
    <ul>
      <li>Request access or delete your personal data.</li>
      <li>Opt-out of marketing communications at any time.</li>
    </ul>

    <h2>8. Children's Privacy</h2>
    <p>We do not knowingly collect information from children under 13.</p>

    <h2>9. Changes to This Policy</h2>
    <p>We may update this Privacy Policy. The updated version will include the revised date at the top.</p>

    <h2>10. Contact</h2>
    <p>If you have questions, contact us at our support email provided on the website.</p>
  `;

    const cookiePolicy = `
    <h2>1. What Are Cookies?</h2>
    <p>Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They help websites run efficiently, remember your preferences, and provide a more personalized shopping experience.</p>
    <ul>
      <li>Keep your shopping cart and checkout secure</li>
      <li>Understand how customers browse our product collections</li>
      <li>Show you relevant offers through remarketing campaigns</li>
      <li>Improve website performance and loading speed</li>
    </ul>

    <h2>2. Types of Cookies We Use</h2>
    <h3>2.1 Essential Cookies</h3>
    <p>Required for the website to function properly.</p>
    <h3>2.2 Performance & Analytics Cookies</h3>
    <p>Used to analyze visitor behavior and improve website performance.</p>
    <h3>2.3 Functionality Cookies</h3>
    <p>Enhance personalization by remembering preferences.</p>
    <h3>2.4 Advertising & Targeting Cookies</h3>
    <p>Used for personalized promotions and remarketing campaigns.</p>

    <h2>3. Managing & Disabling Cookies</h2>
    <p>You can manage or disable cookies anytime through your browser settings or Google Analytics Opt‑Out tools.</p>

    <h2>4. Why Cookies Matter</h2>
    <ul>
      <li>Ensure faster page loading</li>
      <li>Provide secure payment & checkout</li>
      <li>Enable personalized product suggestions</li>
    <li>Improve seasonal campaign performance</li>
    </ul>

    <h2>5. Updates to This Cookie Policy</h2>
    <p>We may update this policy to reflect changes in technology, legal requirements, or our business practices.</p>
  `;

    const termsConditions = `
    <h2>1. Acceptance of Terms</h2>
    <p>By accessing or using our website or services, you agree to be bound by these Terms & Conditions. If you do not agree, you may not use our services.</p>

    <h2>2. Use of Our Services</h2>
    <p>You agree to use our website only for legal and authorized purposes. You are responsible for ensuring your use complies with applicable laws.</p>

    <h2>3. Account Responsibilities</h2>
    <ul>
      <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
      <li>You must provide accurate and complete information when creating an account.</li>
      <li>You are fully responsible for activities that occur under your account.</li>
    </ul>

    <h2>4. Purchases & Payments</h2>
    <p>If you order products or services, you agree to provide valid payment details. All payments are processed through secure third-party platforms.</p>

    <h2>5. Refund & Cancellation</h2>
    <p>Refund eligibility depends on product/service type. Digital products are generally non-refundable once delivered.</p>

    <h2>6. Prohibited Activities</h2>
    <p>You agree NOT to hack, modify, or disrupt our website or servers, or copy our content without permission.</p>

    <h2>7. Intellectual Property</h2>
    <p>All content, logo, graphics, design, text, software, and media are owned by us and protected under copyright law.</p>

    <h2>8. Limitation of Liability</h2>
    <p>We are not responsible for any direct or indirect damages caused by your use or inability to use the website.</p>

    <h2>9. Changes to Terms</h2>
    <p>We may update these Terms & Conditions at any time.</p>
  `;

    const shippingPolicy = `
    <h2>1. Same-Day Delivery</h2>
    <p>We offer same-day delivery for eligible flower, chocolate, and gift orders placed before our daily cut-off times.</p>
    
    <h2>2. Service Areas & Delivery Charges</h2>
    <p>We deliver across Ajman, Dubai, Sharjah, and other Emirates in the UAE.</p>
    
    <h2>3. Delivery Timeframes</h2>
    <p>Regular Delivery Window: 10:00 AM – 10:00 PM. Cut-off times vary by Emirate.</p>

    <h2>4. How We Handle Your Flowers & Gifts</h2>
    <ul>
      <li>Fresh flowers daily from professional florists.</li>
      <li>Chocolates with moisture and temperature protection.</li>
      <li>Luxury packaging for all gifts.</li>
      <li>Climate-controlled delivery vehicles.</li>
    </ul>

    <h2>5. Order Accuracy</h2>
    <p>To ensure smooth and timely delivery, please provide complete and accurate address details and a valid recipient phone number.</p>

    <h2>6. Delivery Exceptions</h2>
    <p>We currently do not deliver to P.O. Box addresses or certain restricted zones.</p>
  `;

    await prisma.storeSettings.update({
        where: { id: settings.id },
        data: {
            privacyPolicy,
            cookiePolicy,
            termsConditions,
            shippingPolicy,
        },
    });

    console.log('Store settings updated with legal policies successfully');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
