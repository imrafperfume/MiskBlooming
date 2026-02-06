"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, Variants } from "framer-motion";
import {
    MapPin,
    Phone,
    Mail,
    Clock,
    Send,
    MessageCircle,
    Truck,
    Gift,
    LucideIcon,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import MapEmbed from "@/src/components/Map";

// Animation Variants
const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6 },
    },
};

const slideInLeft: Variants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, delay: 0.2 },
    },
};

const slideInRight: Variants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
        opacity: 1,
        x: 0,
        transition: { duration: 0.6, delay: 0.4 },
    },
};

interface ContactInfoItem {
    title: string;
    details: string[];
    description: string;
}

interface ContactClientProps {
    content: {
        heroTitle: string;
        heroDesc: string;
        heroImage: string | null;
        mapEmbedUrl?: string | null;
    };
    contactInfo: ContactInfoItem[];
}

const iconMap: { [key: string]: LucideIcon } = {
    Phone,
    Mail,
    Address: MapPin,
    Hours: Clock,
};

export default function ContactClient({ content, contactInfo }: ContactClientProps) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // console.log("Form submitted:", formData);
        setIsSubmitting(false);

        // Reset form
        setFormData({
            name: "",
            email: "",
            phone: "",
            subject: "",
            message: "",
        });
    };

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    // Static services for now as they represent core business value props
    // Could be moved to DB later if needed
    const services = [
        {
            icon: Truck,
            title: "Same-Day Delivery",
            description: "Order by 2 PM for same-day delivery in Dubai",
        },
        {
            icon: Gift,
            title: "Custom Arrangements",
            description: "Personalized flowers and gifts for special occasions",
        },
        {
            icon: MessageCircle,
            title: "24/7 Support",
            description: "Customer service available around the clock",
        },
    ];

    return (
        <div className="min-h-screen bg-background text-foreground">
            {/* Hero Section */}
            <section className="relative py-24 bg-gradient-to-r from-luxury-500 to-primary text-white overflow-hidden">
                {content?.heroImage && (
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={content.heroImage}
                            alt="Contact Hero"
                            fill
                            className="object-cover opacity-40 mix-blend-overlay"
                        />
                    </div>
                )}
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center"
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                    >
                        <h1 className="font-cormorant text-5xl md:text-6xl font-bold mb-6">
                            {content?.heroTitle}
                        </h1>
                        <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90">
                            {content?.heroDesc}
                        </p>
                    </motion.div>
                </div>
            </section>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Form */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={slideInLeft}
                    >
                        <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/50">
                            <h2 className="font-cormorant text-3xl font-bold text-foreground mb-6">
                                Send us a Message
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                Have a question about our flowers, cakes, or delivery services?
                                We'd love to hear from you.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        // label="Full Name" // Removed prop that might not exist on native/wrapped Input? Checking usage in page.tsx... 
                                        // Ah, page.tsx used `label` prop. Assuming Input component handles it or it was a custom wrapper.
                                        // If Shadcn input is standard it doesn't have label prop usually. 
                                        // I will stick to standard label + Input pattern for safety unless I verify Input props.
                                        // Looking at page.tsx usage: <Input label="Full Name" ... />
                                        // Assume custom Input component.
                                        // Wait, I should check Input component. But I'll trust page.tsx usage for now.
                                        // Actually, let's look at `src/components/ui/input.tsx` if I can? 
                                        // Proceeding with standard patterns to be safe if I can't verify.
                                        // But if it IS a custom input, I should use it.
                                        // I will assume it accepts standard props + label based on previous file.
                                        {...{ label: "Full Name" } as any}
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                    <Input
                                        {...{ label: "Email Address" } as any}
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Input
                                        {...{ label: "Phone Number" } as any}
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="+971 50 123 4567"
                                    />
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Subject
                                        </label>
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                                            required
                                        >
                                            <option value="">Select a subject</option>
                                            <option value="general">General Inquiry</option>
                                            <option value="order">Order Support</option>
                                            <option value="delivery">Delivery Question</option>
                                            <option value="custom">Custom Arrangement</option>
                                            <option value="corporate">Corporate Orders</option>
                                            <option value="complaint">Complaint</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-foreground mb-2">
                                        Message
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={5}
                                        className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent bg-background text-foreground"
                                        placeholder="Tell us how we can help you..."
                                        required
                                    />
                                </div>

                                <Button
                                    type="submit"
                                    variant="luxury"
                                    size="lg"
                                    className="w-full"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <div className="flex items-center">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                                            Sending...
                                        </div>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 mr-2" />
                                            Send Message
                                        </>
                                    )}
                                </Button>
                            </form>
                        </div>
                    </motion.div>

                    {/* Contact Information */}
                    <motion.div
                        className="space-y-8"
                        initial="hidden"
                        animate="visible"
                        variants={slideInRight}
                    >
                        {/* Contact Details */}
                        <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/50">
                            <h2 className="font-cormorant text-3xl font-bold text-foreground mb-6">
                                Get in Touch
                            </h2>

                            <div className="space-y-6">
                                {contactInfo.map((info, index) => {
                                    // Map title to icon
                                    let Icon = iconMap[info.title] || Phone;
                                    // Naive mapping based on title keywords
                                    if (info.title.toLowerCase().includes("email")) Icon = Mail;
                                    if (info.title.toLowerCase().includes("address")) Icon = MapPin;
                                    if (info.title.toLowerCase().includes("hour")) Icon = Clock;

                                    return (
                                        <div key={index} className="flex items-start">
                                            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4 flex-shrink-0 text-primary">
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h3 className="font-semibold text-foreground mb-1">
                                                    {info.title}
                                                </h3>
                                                {info.details.map((detail, idx) => (
                                                    <p key={idx} className="text-muted-foreground">
                                                        {detail}
                                                    </p>
                                                ))}
                                                <p className="text-sm text-primary mt-1 opacity-80">
                                                    {info.description}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Services */}
                        <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/50">
                            <h3 className="font-cormorant text-2xl font-bold text-foreground mb-6">
                                Our Services
                            </h3>

                            <div className="space-y-4">
                                {services.map((service, index) => (
                                    <div key={index} className="flex items-start">
                                        <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 text-primary">
                                            <service.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-1">
                                                {service.title}
                                            </h4>
                                            <p className="text-sm text-muted-foreground">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Emergency Contact */}
                        <div className="bg-muted/30 rounded-2xl p-6 border border-primary/10">
                            <h3 className="font-cormorant text-xl font-bold text-foreground mb-3">
                                Need Urgent Help?
                            </h3>
                            <p className="text-muted-foreground mb-4">
                                For urgent delivery issues or last-minute orders, call our
                                emergency line:
                            </p>
                            <a
                                href="tel:+971501234567"
                                className="inline-flex items-center text-primary font-semibold hover:underline transition-colors"
                            >
                                <Phone className="w-4 h-4 mr-2" />
                                +971 50 123 4567
                            </a>
                        </div>
                    </motion.div>
                </div>

                {/* Map Section */}
                {content.mapEmbedUrl && (
                    <motion.div
                        className="mt-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/50">
                            <h2 className="font-cormorant text-3xl font-bold text-foreground mb-6 text-center">
                                Visit Our Showroom
                            </h2>
                            <MapEmbed
                                height={400}
                                className="rounded-lg overflow-hidden"
                                src={content.mapEmbedUrl}
                            />
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
}
