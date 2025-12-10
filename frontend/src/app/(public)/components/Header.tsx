"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import MobileMenu from "./MobileMenu";
import Link from "@/components/LoadingLink";
import { AiOutlineMenu } from "react-icons/ai";

const pages = [
    { name: "Trang chủ", href: "/" },
    { name: "Việc làm", href: "/jobs" },
    { name: "Tin tức", href: "/news" },
    { name: "Tra cứu hồ sơ", href: "/tracking" },
    { name: "Nhà tuyển dụng", href: "/admin/login" },
];

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();
    return (
        <>
            <header className="sticky top-0 border-b border-primary-border bg-white px-4">
                <div className="mx-auto max-w-7xl flex-between-center h-24 py-4">
                    <Link href="/">
                        <img src="/logo.png" alt="logo" className="max-h-12 w-auto" />
                    </Link>
                    <div className="hidden lg:flex gap-8">
                        {pages.map((page) => {
                            const isActive =
                                page.href === "/"
                                    ? pathname === "/"
                                    : pathname.startsWith(page.href);

                            return (
                                <Link
                                    key={page.name}
                                    href={page.href}
                                    className={`flex-center rounded-md px-3 py-2 transition-default hover:bg-secondary-blue-light-extra hover:text-secondary-blue-dark-extra 
                                    ${isActive ? "text-secondary-blue-dark font-medium" : "text-primary-text"}`}>
                                    {page.name}
                                </Link>
                            );
                        })}
                    </div>
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="lg:hidden">
                        <AiOutlineMenu size={20} />
                    </button>
                </div>
            </header>
            {isMenuOpen && <MobileMenu pages={pages} close={() => setIsMenuOpen(false)} />}
        </>
    );
};

export default Header;
