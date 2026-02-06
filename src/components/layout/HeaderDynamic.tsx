"use client";

import dynamic from "next/dynamic";
import React from "react";

const HeaderLoader = () => (
    <div className="h-16 bg-background border-b animate-pulse">
        <div className="container mx-auto h-full flex items-center px-4">
            <div className="w-32 h-8 bg-gray-200 rounded-md"></div>
        </div>
    </div>
);

const HeaderFallback: React.FC = () => (
    <header className="h-16 bg-background border-b flex items-center px-4">
        <div className="container mx-auto text-center">
            <span className="text-foreground ">Header failed to load</span>
        </div>
    </header>
);

const Header = dynamic(
    () => import("./Header").catch(() => HeaderFallback),
    {
        loading: () => <HeaderLoader />,
        ssr: false,
    }
);

export default Header;
