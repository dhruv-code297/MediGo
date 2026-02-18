"use client";

import React from "react";
import { Card, CardContent } from "./ui/card";
import { PricingTable } from "@clerk/nextjs";

const Pricing = () => {
  return (
    <Card className="
      bg-slate-900 
      border border-slate-800 
      shadow-2xl 
      hover:border-blue-600/40 
      transition-all 
      duration-300
      rounded-2xl
    ">
      <CardContent className="p-8">

        {/* Optional subtle top glow */}
        <div className="absolute inset-0 bg-blue-600/5 blur-3xl rounded-2xl pointer-events-none"></div>

        <div className="relative z-10">
          <PricingTable
            checkoutProps={{
              appearance: {
                elements: {
                  drawerRoot: {
                    zIndex: 2000,
                  },
                },
                variables: {
                  colorPrimary: "#2563EB", // blue-600
                  colorBackground: "#0F172A", // slate-900
                  colorText: "#ffffff",
                  colorTextSecondary: "#94A3B8",
                },
              },
            }}
          />
        </div>

      </CardContent>
    </Card>
  );
};

export default Pricing;
