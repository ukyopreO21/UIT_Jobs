import Link from "@/components/LoadingLink";

const Header = () => {
    return (
        <header className="sticky top-0 border-b border-primary-border bg-white">
            <div className="mx-auto max-w-7xl flex-between-center h-24 p-4 text-black">
                <Link href="/">
                    <img src="/logo.png" alt="Logo" className="h-16 w-auto" />
                </Link>
                <div className="flex gap-12">
                    <Link href="/">Trang chủ</Link>
                    <Link href="/tracking">Tra cứu hồ sơ</Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
