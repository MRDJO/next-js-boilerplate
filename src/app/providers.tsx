"use client";

import React from "react";
import { ProgressProvider } from "@bprogress/next/app";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <ProgressProvider
        height="2px"
        color="#000000"
        options={{ showSpinner: false }}
        shallowRouting
      >
        {children}
        <Toaster />
      </ProgressProvider>
    </ThemeProvider>
  );
};

export default Providers;
