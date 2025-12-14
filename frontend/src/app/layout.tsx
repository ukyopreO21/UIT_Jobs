import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Lexend, Montserrat } from "next/font/google";
import "@/styles/globals.css";

import GlobalLoader from "@/components/GlobalLoader";
import NavigationEvents from "@/components/NavigationEvents";
import ToastProvider from "@/components/ToastProvider";

const lexendFont = Lexend({
    variable: "--font-lexend",
    subsets: ["latin"],
});

export const montserratFont = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Cổng thông tin tuyển dụng - UIT",
    description: "",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    viewportFit: "cover",
    themeColor: "#ffffff",
};

const RootLayout = ({ children }: Readonly<{ children: ReactNode }>) => {
    return (
        <html lang="vi">
            <head>
                <meta charSet="UTF-8" />
                <link rel="icon" href="https://www.uit.edu.vn/sites/vi/files/favicon.ico" />
            </head>

            <body className={`${lexendFont.variable} antialiased`}>
                {children}
                <ToastProvider />
                <GlobalLoader />
                <NavigationEvents />
            </body>
        </html>
    );
};

export default RootLayout;
