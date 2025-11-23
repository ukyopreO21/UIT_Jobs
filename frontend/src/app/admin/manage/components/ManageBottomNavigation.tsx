import { AiOutlineForm, AiOutlineHome } from "react-icons/ai";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import LoadingLink from "@/components/LoadingLink";

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
        <div className="flex w-full border-t border-[#e7e7e8] bg-white h-16 pt-2 pb-4 px-4 lg:hidden">
            {menuItems.map((item) => {
                const active = isActive(item.path);
                return (
                    <LoadingLink
                        key={item.path}
                        href={item.path}
                        className={`flex-1 flex flex-col gap-1 justify-center items-center text-xs transition-colors
                            ${active ? "text-blue-600 font-medium" : "text-gray-500"}
                        `}>
                        <span className={active ? "text-blue-600" : "text-gray-500"}>
                            {item.icon}
                        </span>
                        <span>{item.label}</span>
                    </LoadingLink>
                );
            })}
        </div>
    );
};

export default ManageBottomNavigation;
