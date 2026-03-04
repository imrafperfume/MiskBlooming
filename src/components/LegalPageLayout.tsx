import React from 'react';
import { Mail, Phone, MapPin, Calendar, ArrowLeft, Store } from 'lucide-react';
import Link from 'next/link';

interface LegalPageLayoutProps {
    title: string;
    lastUpdated?: string;
    content: string | null;
    storeName?: string;
    email?: string;
    phone?: string;
    address?: string;
}

export default function LegalPageLayout({
    title,
    lastUpdated,
    content,
    storeName,
    email,
    phone,
    address,
}: LegalPageLayoutProps) {
    const currentYear = new Date().getFullYear();

    return (
        <main className="min-h-screen bg-[hsl(var(--background))] pt-24 pb-16 px-4 sm:px-6 lg:px-8 font-inter">
            <div className="max-w-4xl mx-auto">
                {/* Breadcrumb / Back button */}
                <div className="mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--primary))] transition-colors group"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                        Back to Home
                    </Link>
                </div>

                {/* Header Section */}
                <header className="mb-12 border-b border-[hsl(var(--border)/0.5)] pb-8">
                    <h1 className="text-4xl md:text-5xl font-cormorant font-bold text-[hsl(var(--foreground))] mb-4 leading-tight">
                        {title}
                    </h1>
                    {lastUpdated && (
                        <div className="flex items-center text-sm text-[hsl(var(--muted-foreground))]">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>Last Updated: {lastUpdated}</span>
                        </div>
                    )}
                </header>

                {/* Content Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Body Content */}
                    <div className="lg:col-span-2">
                        <div
                            className="prose prose-slate max-w-none 
                prose-headings:font-cormorant prose-headings:font-bold prose-headings:text-[hsl(var(--foreground))]
                prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-l-4 prose-h2:border-[hsl(var(--primary))] prose-h2:pl-4
                prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
                prose-p:text-[hsl(var(--foreground)/0.8)] prose-p:leading-relaxed prose-p:mb-6
                prose-li:text-[hsl(var(--foreground)/0.8)] prose-li:mb-2
                prose-strong:text-[hsl(var(--foreground))] prose-strong:font-semibold
                prose-a:text-[hsl(var(--primary))] prose-a:no-underline hover:prose-a:underline
                dark:prose-invert"
                            dangerouslySetInnerHTML={{ __html: content || '<p>Content is being updated. Please check back soon.</p>' }}
                        />
                    </div>

                    {/* Sidebar Info */}
                    <aside className="lg:col-span-1">
                        <div className="sticky top-32 space-y-8">
                            {/* Company Info Card */}
                            <div className="bg-[hsl(var(--card))] border border-[hsl(var(--border)/0.5)] rounded-2xl p-6 shadow-sm luxury-shadow">
                                <h3 className="font-cormorant text-xl font-bold text-[hsl(var(--foreground))] mb-6">Contact Information</h3>
                                <div className="space-y-4">
                                    {storeName && (
                                        <div className="flex items-start group">
                                            <div className="mt-1 p-2 bg-[hsl(var(--primary)/0.1)] rounded-lg group-hover:bg-[hsl(var(--primary)/0.2)] transition-colors">
                                                <Store className="w-4 h-4 text-[hsl(var(--primary))]" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Company</p>
                                                <p className="text-sm font-semibold text-[hsl(var(--foreground))]">{storeName}</p>
                                            </div>
                                        </div>
                                    )}
                                    {email && (
                                        <div className="flex items-start group">
                                            <div className="mt-1 p-2 bg-[hsl(var(--primary)/0.1)] rounded-lg group-hover:bg-[hsl(var(--primary)/0.2)] transition-colors">
                                                <Mail className="w-4 h-4 text-[hsl(var(--primary))]" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Email Us</p>
                                                <a href={`mailto:${email}`} className="text-sm font-semibold text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors">{email}</a>
                                            </div>
                                        </div>
                                    )}
                                    {phone && (
                                        <div className="flex items-start group">
                                            <div className="mt-1 p-2 bg-[hsl(var(--primary)/0.1)] rounded-lg group-hover:bg-[hsl(var(--primary)/0.2)] transition-colors">
                                                <Phone className="w-4 h-4 text-[hsl(var(--primary))]" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Call Us</p>
                                                <a href={`tel:${phone}`} className="text-sm font-semibold text-[hsl(var(--foreground))] hover:text-[hsl(var(--primary))] transition-colors">{phone}</a>
                                            </div>
                                        </div>
                                    )}
                                    {address && (
                                        <div className="flex items-start group">
                                            <div className="mt-1 p-2 bg-[hsl(var(--primary)/0.1)] rounded-lg group-hover:bg-[hsl(var(--primary)/0.2)] transition-colors">
                                                <MapPin className="w-4 h-4 text-[hsl(var(--primary))]" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-xs font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">Location</p>
                                                <p className="text-sm font-semibold text-[hsl(var(--foreground))] leading-snug">{address}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Trust Badge / Additional Info */}
                            <div className="bg-[hsl(var(--primary)/0.03)] rounded-2xl p-6 border border-[hsl(var(--primary)/0.1)]">
                                <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed text-center italic">
                                    &copy; {currentYear} {storeName || 'Misk Blooming'}. All rights reserved.
                                    This document is subject to change. We recommend checking back periodically for updates.
                                </p>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>
        </main>
    );
}
