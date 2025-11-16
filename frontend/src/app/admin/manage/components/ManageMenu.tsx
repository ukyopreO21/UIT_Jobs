import { AiOutlineForm, AiOutlineHome } from "react-icons/ai";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { usePathname } from "next/navigation";
import LoadingLink from "@/components/LoadingLink";

const ManageMenu = () => {
    const pathname = usePathname();

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
    ];

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

    return (
        <div className="flex flex-1 flex-col gap-2">
            {menuItems.map((item) => {
                const active = isActive(item.path);
                return (
                    <LoadingLink
                        key={item.path}
                        href={item.path}
                        className={`flex items-center p-4 w-72 h-10 rounded-lg cursor-pointer transition
                            ${
                                active
                                    ? "bg-[#dbe4ff] text-[#4263eb]"
                                    : "hover:bg-[#f6f6f6] text-[#535458]"
                            }
                        `}>
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                    </LoadingLink>
                );
            })}
        </div>
    );
};

export default ManageMenu;
