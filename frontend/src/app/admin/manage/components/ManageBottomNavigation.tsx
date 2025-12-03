import { AiOutlineForm, AiOutlineHome } from "react-icons/ai";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import Link from "@/components/LoadingLink";

const ManageBottomNavigation = () => {
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

    const menuItems = [
        {
            label: "Dashboard",
            path: "/admin/manage/dashboard",
            icon: <AiOutlineHome size={20} />,
        },
        {
            label: "Việc làm",
            path: "/admin/manage/jobs",
            icon: <HiOutlineBriefcase size={20} />,
        },
        {
            label: "Hồ sơ",
            path: "/admin/manage/review",
            icon: <AiOutlineForm size={20} />,
        },
        {
            label: "Tài khoản",
            path: "/admin/manage/account",
            icon: <div className="w-5 h-5 rounded-full bg-gray-400" />,
        },
    ];

    return (
        <div className="flex w-full border-t border-primary-border bg-white h-16 pt-2 pb-4 px-4 lg:hidden">
            {menuItems.map((item) => {
                const active = isActive(item.path);
                return (
                    <Link
                        key={item.path}
                        href={item.path}
                        className={`flex-1 flex-center flex-col gap-1 text-xs transition
                            ${active ? "text-secondary-blue-dark font-medium" : "text-primary-text"}
                        `}>
                        <span className={active ? "text-secondary-blue-dark" : "text-primary-text"}>
                            {item.icon}
                        </span>
                        <span>{item.label}</span>
                    </Link>
                );
            })}
        </div>
    );
};

export default ManageBottomNavigation;
