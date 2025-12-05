"use client";
import { useState } from "react";
import MobileMenu from "./MobileMenu";
import Link from "@/components/LoadingLink";

const pages = [
    { name: "Trang chủ", href: "/" },
    { name: "Việc làm", href: "/jobs" },
    { name: "Tin tức", href: "/news" },
    { name: "Tra cứu hồ sơ", href: "/tracking" },
    { name: "Liên hệ", href: "/contact" },
];

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    return (
        <>
            <header className="sticky top-0 border-b border-primary-border bg-white px-4">
                <div className="mx-auto max-w-7xl flex-between-center h-24 p-4">
                    <Link href="/">
                        <img src="/logo.png" alt="logo" className="max-h-12 w-auto" />
                    </Link>
                    <div className="hidden lg:flex gap-8">
                        {pages.map((page) => (
                            <Link
                                key={page.name}
                                href={page.href}
                                className="flex-center rounded-md px-3 py-2 transition-default hover:bg-secondary-blue-light-extra hover:text-secondary-blue-dark-extra">
                                {page.name}
                            </Link>
                        ))}
                    </div>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden">
                        Menu
                    </button>
                </div>
            </header>
            {isMenuOpen && <MobileMenu pages={pages} close={() => setIsMenuOpen(false)} />}
        </>
    );
};

export default Header;
