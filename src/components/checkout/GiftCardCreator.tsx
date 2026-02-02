"use client";

import { useState, useEffect } from "react";
import { useFormContext } from "react-hook-form";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Gift } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../ui/button";

interface GiftCardCreatorProps {
    isOpen: boolean;
    onClose: () => void;
    // We can use useFormContext or pass form. 
    // Since we are likely using this inside a FormProvider? 
    // CheckoutPage does NOT wrap in FormProvider, it passes form manually.
    // So we should accept form as prop or register methods.
    form: any; // Using any for ease with hook-form types, or generic
}

const SIZES = [
    { id: "A4", label: "A4", dims: "210×297mm" },
    { id: "A5", label: "A5", dims: "148×210mm" },
    { id: "A6", label: "A6", dims: "105×148mm" },
];

const THEMES = [
    { id: "Soft", label: "Soft", color: "from-pink-50 to-white" },
    { id: "Rich", label: "Rich", color: "from-amber-50 to-orange-50" },
    { id: "Elegant", label: "Elegant", color: "from-slate-50 to-gray-100" },
    { id: "Royal", label: "Royal", color: "from-purple-50 to-indigo-50" },
];

export function GiftCardCreator({ isOpen, onClose, form }: GiftCardCreatorProps) {
    const { register, watch, setValue, formState: { errors } } = form;

    // Watch values for preview
    const size = watch("giftCardSize") || "A6";
    const theme = watch("giftCardTheme") || "Rich";
    const recipient = watch("giftRecipient") || "";
    const sender = watch("giftSender") || "";
    const message = watch("giftMessage") || "";

    // Set defaults on mount if needed
    useEffect(() => {
        if (isOpen) {
            if (!watch("giftCardSize")) setValue("giftCardSize", "A6");
            if (!watch("giftCardTheme")) setValue("giftCardTheme", "Rich");
        }
    }, [isOpen, setValue, watch]);

    const getThemeStyles = (themeName: string) => {
        switch (themeName) {
            case "Soft": return "bg-gradient-to-br from-pink-100 via-white to-pink-50 border-pink-200 text-pink-900";
            case "Rich": return "bg-gradient-to-br from-[#1a1a1a] via-[#2a2a2a] to-[#000] border-amber-500/30 text-amber-50"; // Dark luxury as per screenshot?
            // Wait, screenshot shows "Rich" selected but preview is Dark/Gold. 
            // Let's make "Rich" the dark luxury one.
            case "Elegant": return "bg-white border-gray-200 text-gray-900";
            case "Royal": return "bg-gradient-to-br from-indigo-900 to-purple-900 border-indigo-500/30 text-white";
            default: return "bg-white border-gray-200 text-gray-900";
        }
    };

    // Override for the specific screenshot look
    // The screenshot shows "Rich" selected. The preview is Dark background with Gold text.
    // Let's align "Rich" with that look.

    return (
        <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[999]" />
                <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[90vh] bg-background rounded-xl shadow-2xl z-[1000] overflow-hidden flex flex-col md:flex-row border border-border outline-none">
                    <Dialog.Title className="sr-only">Gift Card Creator</Dialog.Title>

                    {/* Header (Mobile only) */}
                    <div className="md:hidden p-4 border-b border-border flex justify-between items-center bg-card">
                        <h2 className="font-cormorant text-xl font-bold flex items-center gap-2">
                            <Gift className="w-5 h-5 text-primary" />
                            Gift Card Creator
                        </h2>
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Left Panel - Controls */}
                    <div className="w-full md:w-1/2 p-6 overflow-y-auto bg-card">
                        <div className="hidden md:flex justify-between items-center mb-8">
                            <div className="flex items-center gap-2 text-primary">
                                <Gift className="w-5 h-5" />
                                <span className="font-cormorant font-bold text-xl text-foreground">Luxury Gift Card Creator</span>
                            </div>
                            <button onClick={onClose} className="p-2 hover:bg-muted rounded-full transition-colors">
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Size Selection */}
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-3">Card Size</label>
                                <div className="grid grid-cols-3 gap-3">
                                    {SIZES.map((s) => (
                                        <label
                                            key={s.id}
                                            className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${size === s.id
                                                ? "border-primary bg-primary/5 ring-1 ring-primary text-primary"
                                                : "border-border hover:border-primary/50 text-muted-foreground"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                value={s.id}
                                                {...register("giftCardSize")}
                                                className="sr-only"
                                            />
                                            <div className="font-medium text-sm">{s.label}</div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Theme Selection */}
                            <div>
                                <label className="block text-sm font-medium text-muted-foreground mb-3">Color Theme</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {THEMES.map((t) => (
                                        <label
                                            key={t.id}
                                            className={`cursor-pointer border rounded-lg p-3 text-center transition-all ${theme === t.id
                                                ? "border-amber-500 bg-amber-500/5 ring-1 ring-amber-500 text-amber-600"
                                                : "border-border hover:border-amber-500/30 text-muted-foreground"
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                value={t.id}
                                                {...register("giftCardTheme")}
                                                className="sr-only"
                                            />
                                            <div className="font-medium text-sm">{t.label}</div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Fields */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Recipient Name</label>
                                    <input
                                        {...register("giftRecipient")}
                                        placeholder="e.g. Sarah Johnson"
                                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:ring-1 focus:ring-primary outline-none transition-shadow"
                                    />
                                    {/* Error display if we had touched state */}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Sender Name</label>
                                    <input
                                        {...register("giftSender")}
                                        placeholder="e.g. Michael Chen"
                                        className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:ring-1 focus:ring-primary outline-none transition-shadow"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-muted-foreground mb-1">Personal Message</label>
                                    <div className="relative">
                                        <textarea
                                            {...register("giftMessage")}
                                            placeholder="Wishing you moments of sweetness and beauty..."
                                            maxLength={300}
                                            rows={4}
                                            className="w-full bg-background border border-border rounded-lg px-4 py-2 text-foreground focus:ring-1 focus:ring-primary outline-none transition-shadow resize-none"
                                        />
                                        <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                                            {message.length}/300
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <Button onClick={onClose} className="w-full py-6 font-cormorant text-lg">
                                    Save Gift Card
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel - Live Preview */}
                    <div className="w-full md:w-1/2 bg-muted/30 p-8 flex flex-col items-center justify-center border-l border-border relative">
                        <div className="absolute top-6 left-6 font-cormorant font-bold text-lg text-foreground">Live Preview</div>

                        {/* The Card */}
                        <motion.div
                            layout
                            className={`relative shadow-2xl flex flex-col items-center text-center justify-center p-8 md:p-12 transition-all duration-500
                 ${theme === 'Rich' ? 'bg-[#1a1a1a] text-[#cda45e] border border-[#cda45e]/30' : ''}
                 ${theme === 'Soft' ? 'bg-[#fff5f7] text-[#8a4b58] border border-pink-200' : ''}
                 ${theme === 'Elegant' ? 'bg-white text-gray-800 border border-gray-200' : ''}
                 ${theme === 'Royal' ? 'bg-[#1e1b4b] text-indigo-100 border border-indigo-500/30' : ''}
                 ${size === 'A4' ? 'aspect-[210/297] w-[400px]' : ''}
                 ${size === 'A5' ? 'aspect-[148/210] w-[320px]' : ''}
                 ${size === 'A6' ? 'aspect-[105/148] w-[280px]' : ''}
               `}
                            style={{
                                aspectRatio: size === 'A4' ? '210/297' : size === 'A5' ? '148/210' : '105/148'
                            }}
                        >
                            {/* Decorative Elements */}
                            <Gift className="w-12 h-12 mb-6 opacity-80" />

                            <h3 className="font-cormorant text-2xl md:text-3xl font-bold uppercase tracking-widest mb-2">
                                Luxury Gift Card
                            </h3>

                            <p className="font-serif italic opacity-70 mb-6 text-sm">Chocolate & Flowers Boutique</p>

                            {/* Divider */}
                            <div className={`w-16 h-px mb-8 opacity-50 ${theme === 'Rich' ? 'bg-[#cda45e]' : 'bg-current'}`}></div>

                            <div className="mb-2 font-serif text-sm opacity-60">To</div>
                            <div className="font-cormorant text-2xl font-bold mb-6">{recipient || "Recipient Name"}</div>

                            <p className="font-sans text-sm leading-relaxed opacity-90 mb-8 max-w-[80%] break-words">
                                "{message || "Wishing you moments of sweetness and beauty. May this gift bring joy to your special day."}"
                            </p>

                            <div className="mb-2 font-serif text-sm opacity-60">From</div>
                            <div className="font-cormorant text-xl font-bold mb-12">{sender || "Sender Name"}</div>

                            {/* Footer on Card */}
                            <div className="mt-auto opacity-50 text-[10px] tracking-widest uppercase">
                                www.miskblooming.com | +971 123 4567
                            </div>

                        </motion.div>

                        <div className="mt-8 text-center text-sm text-muted-foreground">
                            <p className="font-medium">Print Quality</p>
                            <p className="text-xs">Exports at 300 DPI for professional printing</p>
                            <p className="mt-2 font-medium">Paper Recommendation</p>
                            <p className="text-xs">300-350 GSM premium cardstock</p>
                        </div>
                    </div>

                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
