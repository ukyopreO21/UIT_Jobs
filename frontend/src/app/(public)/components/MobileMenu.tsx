import Link from "@/components/LoadingLink";

const MobileMenu = ({
    pages,
    close,
}: {
    pages: { name: string; href: string }[];
    close: () => void;
}) => {
    return (
        <div className="absolute right-0 top-0 h-full w-70 max-w-full bg-white shadow-xl transition-transform duration-300 text-default bp4:hidden">
            <div className="flex flex-col h-full">
                {/* Header của Sidebar (Chứa nút đóng) */}
                <div className="flex items-center justify-end p-4 border-b">
                    <button
                        onClick={close}
                        className="p-2 rounded-md hover:bg-red-50 hover:text-red-500 transition-default">
                        {/* Icon X (Close) */}
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                {/* Danh sách Links (Vertical) */}
                <nav className="flex flex-col p-4 gap-2">
                    {pages.map((page) => (
                        <Link
                            key={page.name}
                            href={page.href}
                            onClick={close}
                            className="block px-4 py-3 font-medium rounded-md transition-default hover:bg-secondary-blue-light-extra hover:text-secondary-blue-dark-extra">
                            {page.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default MobileMenu;
