import { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import { Lexend, Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "@/styles/globals.css";

import GlobalLoader from "@/components/GlobalLoader";
import NavigationEvents from "@/components/NavigationEvents";

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
                <Toaster position="top-right" containerClassName="text-default" />
                <GlobalLoader />
                <NavigationEvents />
            </body>
        </html>
    );
};

export default RootLayout;
