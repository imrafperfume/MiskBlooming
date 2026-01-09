"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { format } from "date-fns";
import Image from "next/image";

interface MembershipCardProps {
  cardNumber: string;
  cardHolderName: string;
  expirationDate: string | Date;
  membershipType: "Mmbebr" | "VIP" | "PREMIUM" | "GOLD" | "PLATINUM";
  className?: string;
}

const CardFront = ({ cardNumber, cardHolderName, expirationDate }: any) => (
  <div
    className="w-full h-full rounded-2xl p-6 shadow-2xl flex flex-col justify-between"
    style={{
      background: "linear-gradient(135deg, #FFD700 0%, #B8860B 100%)", // Gold Gradient
    }}
  >
    {/* Header */}
    <div className="flex justify-between items-start">
       <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center font-serif text-2xl font-bold border-2 border-white/30">
            M
          </div>
          <div>
             <h2 className="text-black font-bold text-lg leading-none">MISK BLOOMING</h2>
             <p className="text-black/70 text-xs font-medium tracking-wider">PREMIUM MEMBERSHIP</p>
          </div>
       </div>
       <div className="text-right">
          <p className="text-black/60 text-[10px] font-bold tracking-widest">MEMBER SINCE</p>
          <p className="text-black font-bold text-sm">2026</p>
       </div>
    </div>

    {/* Chip visual (optional) */}
    <div className="mt-4 w-12 h-9 rounded bg-gradient-to-br from-yellow-200 to-yellow-600 border border-yellow-700/30 opacity-80" />

    {/* Card Details */}
    <div className="mt-auto">
       <div className="flex justify-between items-end mb-2">
           <p className="text-black font-mono text-xl tracking-widest drop-shadow-sm">{cardNumber}</p>
       </div>
       
       <div className="flex justify-between items-end">
          <div>
              <p className="text-black/60 text-[10px] font-bold tracking-widest uppercase mb-0.5">MEMBER NAME</p>
              <p className="text-black font-bold uppercase tracking-wide text-sm">{cardHolderName}</p>
          </div>
           <div className="text-right">
              <p className="text-black/60 text-[10px] font-bold tracking-widest uppercase mb-0.5">EXPIRES</p>
              <p className="text-black font-bold text-sm">{format(new Date(expirationDate), "MM/yy")}</p>
          </div>
       </div>
    </div>

  </div>
);

const CardBack = ({ cardHolderName, membershipType }: any) => (
  <div
    className="w-full h-full rounded-2xl shadow-2xl flex flex-col overflow-hidden"
    style={{
      background: "#1a1a1a",
      // Removed transform rotateY for reusable component, parent handles rotation if needed
    }}
  >
     {/* Magnetic Stripe */}
     <div className="w-full h-12 bg-black mt-6 mb-4"></div>

     <div className="px-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start">
            <div>
                <p className="text-white/50 text-[10px] uppercase tracking-wider mb-1">Membership Type</p>
                <div className="px-3 py-1 bg-yellow-600/20 border border-yellow-600/50 rounded text-yellow-500 font-bold text-xs inline-block">
                    {membershipType}
                </div>
            </div>
            {/* QR Code Placeholder */}
             <div className="w-16 h-16 bg-white p-1 rounded-sm">
                 <div className="w-full h-full bg-black/10 flex items-center justify-center text-[8px] text-center text-black/50">
                     QR CODE
                 </div>
             </div>
        </div>

         <div className="mt-auto mb-6">
             <p className="text-white/50 text-[10px] uppercase tracking-wider mb-1">Authorized Signature</p>
             <div className="w-3/4 h-8 bg-white/10 rounded flex items-center px-4">
                 <p className="text-white/80 font-handwriting italic text-sm opacity-70">{cardHolderName}</p>
             </div>
         </div>
         
         <p className="text-white/30 text-[8px] text-center mb-4 px-4 leading-tight">
             This card is non-transferable. Terms and conditions apply. Visit miskblooming.com for details.
         </p>
     </div>
  </div>
);

const MembershipCard: React.FC<MembershipCardProps & { variant?: "default" | "front" | "back" }> = ({
  cardNumber,
  cardHolderName,
  expirationDate,
  membershipType,
  className,
  variant = "default",
}) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  if (variant === "front") {
    return (
      <div className={cn("w-[400px] h-[250px]", className)}>
        <CardFront 
            cardNumber={cardNumber} 
            cardHolderName={cardHolderName} 
            expirationDate={expirationDate} 
        />
      </div>
    );
  }

  // Back variant if needed later
  if (variant === "back") {
     return (
        <div className={cn("w-[400px] h-[250px]", className)}>
           <CardBack cardHolderName={cardHolderName} membershipType={membershipType} />
        </div>
     );
  }

  return (
    <div className={cn("perspective-1000 w-[400px] h-[250px] cursor-pointer", className)} onClick={handleFlip}>
      <motion.div
        className="relative w-full h-full transition-all duration-500 transform-style-3d"
        initial={false}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Side */}
        <div
            className="absolute w-full h-full backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
        >
            <CardFront 
                cardNumber={cardNumber} 
                cardHolderName={cardHolderName} 
                expirationDate={expirationDate} 
            />
        </div>

        {/* Back Side */}
        <div
          className="absolute w-full h-full backface-hidden"
          style={{
            transform: "rotateY(180deg)",
            backfaceVisibility: "hidden",
          }}
        >
            <CardBack cardHolderName={cardHolderName} membershipType={membershipType} />
        </div>
      </motion.div>
    </div>
  );
};

// Helper removed as we use raw codes now
export default MembershipCard;
