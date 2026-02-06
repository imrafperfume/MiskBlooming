"use client";

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
import Image from "next/image";

interface FooterLink {
    name: string;
    href: string;
}

interface FooterSection {
    title: string;
    links: FooterLink[];
}

interface FooterData {
    brandDesc: string;
    phone: string;
    email: string;
    address: string;
    facebook: string | null;
    instagram: string | null;
    twitter: string | null;
    newsletterTitle: string;
    newsletterDesc: string;
    copyrightText: string;
    footerLinks: FooterSection[];
    logoUrl?: string | null;
    storeName?: string;
}

interface FooterClientProps {
    data: FooterData;
}

const FooterClient = ({ data }: FooterClientProps) => {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        {
            name: "Facebook",
            icon: Facebook,
            href: data.facebook!,
        },
        {
            name: "Instagram",
            icon: Instagram,
            href: data.instagram!,
        },
        {
            name: "Twitter",
            icon: Twitter,
            href: data.twitter!,
        },
    ].filter((link) => link.href && link.href.trim() !== "");

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
                                {data.logoUrl ? (
                                    <div className="relative w-40 h-14 lg:w-48 lg:h-20">
                                        <Image
                                            src={data.logoUrl}
                                            alt={data.storeName || "Store Logo"}
                                            fill
                                            className="object-contain object-left"
                                            sizes="(max-width: 768px) 160px, 192px"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-3xl font-cormorant font-bold">
                                        {data.storeName || "Misk"}
                                        {!data.storeName && <span className="luxury-text">Blooming</span>}
                                    </div>
                                )}
                            </Link>
                            <p className="text-cream-200 mb-6 leading-relaxed">
                                {data.brandDesc}
                            </p>

                            {/* Contact Info */}
                            <div className="space-y-3">
                                <div className="flex items-center">
                                    <Phone className="w-4 h-4 mr-3 text-luxury-400" />
                                    <span className="text-cream-200">{data.phone}</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="w-4 h-4 mr-3 text-luxury-400" />
                                    <span className="text-cream-200">{data.email}</span>
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-3 text-luxury-400" />
                                    <span className="text-cream-200">
                                        {data.address}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Links Sections */}
                    {data.footerLinks.map((section, index) => (
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
                                {section.links.map((link) => (
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
                                {data.newsletterTitle}
                            </h3>
                            <p className="text-cream-200">
                                {data.newsletterDesc}
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="flex-1 px-4 py-3 bg-charcoal-800 border border-charcoal-600 rounded-lg text-cream-50 placeholder-cream-400 focus:ring-2 focus:ring-ring focus:border-transparent"
                            />
                            <button className="px-6 py-3 luxury-gradient text-foreground font-semibold rounded-lg hover:scale-105 transition-transform duration-300">
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
                                © {currentYear} {data.copyrightText} <span className="mx-2">|</span> <a href="https://enoytech.com" target="_blank" rel="noopener noreferrer" className="text-luxury-400 hover:text-luxury-500 transition-colors duration-300">Enoy Tech</a>
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
                                    <social.icon className="w-5 h-5 text-cream-200 hover:text-foreground" />
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

export default FooterClient;
