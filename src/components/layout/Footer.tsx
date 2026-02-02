import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Phone,
  Mail,
  MapPin,
  Heart,
} from "lucide-react";
import { motion } from "framer-motion";
import { gql, useQuery } from "@apollo/client";

const GET_FOOTER_CONTENT = gql`
  query GetFooterContent {
    getFooterContent {
      id
      brandDesc
      phone
      email
      address
      facebook
      instagram
      twitter
      newsletterTitle
      newsletterDesc
      copyrightText
      footerLinks {
        title
        links {
            name
            href
        }
      }
    }
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { data, loading } = useQuery(GET_FOOTER_CONTENT);

  const footerData = data?.getFooterContent;

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: footerData?.facebook || "https://facebook.com/miskblooming",
    },
    {
      name: "Instagram",
      icon: Instagram,
      href: footerData?.instagram || "https://instagram.com/miskblooming",
    },
    {
      name: "Twitter",
      icon: Twitter,
      href: footerData?.twitter || "https://twitter.com/miskblooming",
    },
  ].filter(link => link.href); // Only show if link exists

  // Default links if not loaded or empty
  const defaultLinks = [
    {
      title: "Shop",
      links: [
        { name: "Fresh Flowers", href: "/products?category=roses" },
        { name: "Premium Chocolates", href: "/products?category=chocolates" },
      ]
    },
    {
      title: "Support",
      links: [
        { name: "Contact Us", href: "/contact" },
      ]
    }
  ];

  const sections = footerData?.footerLinks && footerData?.footerLinks.length > 0
    ? footerData.footerLinks
    : defaultLinks;

  return (
    <footer className="bg-charcoal-900 text-cream-50">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Link href="/" className="inline-block mb-6">
                <div className="text-3xl font-cormorant font-bold">
                  Misk<span className="luxury-text">Blooming</span>
                </div>
              </Link>
              <p className="text-cream-200 mb-6 leading-relaxed">
                {footerData?.brandDesc || "Dubai's premier flower and gift delivery service. We bring beauty, joy, and sweetness to your special moments."}
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3 text-luxury-400" />
                  <span className="text-cream-200">{footerData?.phone || "+971 4 123 4567"}</span>
                </div>
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-3 text-luxury-400" />
                  <span className="text-cream-200">{footerData?.email || "info@miskblooming.ae"}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-3 text-luxury-400" />
                  <span className="text-cream-200">
                    {footerData?.address || "Dubai Marina, Dubai, UAE"}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Links Sections */}
          {sections.map((section: any, index: number) => (
            <motion.div
              key={section.title || index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-cormorant text-lg font-semibold mb-4 text-luxury-400">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link: any) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-cream-200 hover:text-luxury-400 transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Newsletter Section */}
        <motion.div
          className="mt-12 pt-8 border-t border-charcoal-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="font-cormorant text-2xl font-bold mb-2 text-luxury-400">
                {footerData?.newsletterTitle || "Stay in Bloom"}
              </h3>
              <p className="text-cream-200">
                {footerData?.newsletterDesc || "Subscribe to our newsletter for exclusive offers, seasonal collections, and flower care tips."}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 bg-charcoal-800 border border-charcoal-600 rounded-lg text-cream-50 placeholder-cream-400 focus:ring-2 focus:ring-ring focus:border-transparent"
              />
              <button className="px-6 py-3 luxury-gradient text-foreground  font-semibold rounded-lg hover:scale-105 transition-transform duration-300">
                Subscribe
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Footer */}
      <div className="border-t pb-14 sm:pb-0 border-charcoal-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <motion.div
            className="flex flex-col md:flex-row justify-between items-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center mb-4 md:mb-0">
              <p className="text-cream-300 text-sm">
                © {currentYear} {footerData?.copyrightText || "Misk Blooming. Made in Dubai, UAE"} <span className="mx-2">|</span> Enoy Tech
              </p>
            </div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-charcoal-800 hover:bg-primary rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="w-5 h-5 text-cream-200 hover:text-foreground " />
                </a>
              ))}
            </div>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            className="mt-4 pt-4 border-t border-charcoal-700 flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            <Link href="/privacy" className="text-cream-300 hover:text-luxury-400 text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-cream-300 hover:text-luxury-400 text-sm transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="text-cream-300 hover:text-luxury-400 text-sm transition-colors">
              Cookie Policy
            </Link>
            <Link href="/delivery" className="text-cream-300 hover:text-luxury-400 text-sm transition-colors">
              Delivery Information
            </Link>
          </motion.div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
