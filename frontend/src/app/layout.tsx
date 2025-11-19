import { ReactNode } from "react";
import type { Metadata } from "next";
import { Lexend, Montserrat } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

import GlobalLoader from "@/components/GlobalLoader";

const lexendFont = Lexend({
    variable: "--font-lexend",
    subsets: ["latin"],
});

const montserratFont = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Cổng thông tin tuyển dụng - UIT",
    description: "",
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
                <Toaster position="top-right" />
                <GlobalLoader />
            </body>
        </html>
    );
};

export default RootLayout;
