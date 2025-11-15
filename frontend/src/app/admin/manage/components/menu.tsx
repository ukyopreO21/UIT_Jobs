import { AiOutlineForm, AiOutlineHome } from "react-icons/ai";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { usePathname, useRouter } from "next/navigation";

const ManageMenu = () => {
    const pathname = usePathname();
    const router = useRouter();

    const menuItems = [
        {
            label: "Dashboard",
            path: "/admin/manage",
            icon: <AiOutlineHome size={20} />,
            children: [
                {
                    label: "Việc làm",
                    path: "/admin/manage/jobs",
                    icon: <HiOutlineBriefcase size={20} />,
                },
                {
                    label: "Hồ sơ",
                    path: "/admin/manage/applications",
                    icon: <AiOutlineForm size={20} />,
                },
            ],
        },
    ];

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + "/");

    return (
        <div className="flex flex-1 flex-col gap-2">
            {menuItems.map((item) => {
                const parentActive = isActive(item.path);
                return (
                    <div key={item.path} className="flex flex-col gap-1">
                        <div
                            onClick={() => router.push(item.path)}
                            className={`flex items-center p-4 w-72 h-10 rounded-lg cursor-pointer transition
                                ${
                                    parentActive
                                        ? "bg-[#dbe4ff] text-[#4263eb]"
                                        : "hover:bg-[#f6f6f6] text-[#535458]"
                                }
                            `}>
                            {item.icon}
                            <span className="ml-3">{item.label}</span>
                        </div>

                        {item.children?.map((child) => {
                            const childActive = pathname === child.path;
                            return (
                                <div
                                    key={child.path}
                                    onClick={() => router.push(child.path)}
                                    className={`flex items-center p-4 w-72 h-10 rounded-lg cursor-pointer transition
                                        ${
                                            childActive
                                                ? "bg-[#dbe4ff] text-[#4263eb]"
                                                : "hover:bg-[#f6f6f6] text-[#535458]"
                                        }
                                    `}>
                                    {child.icon}
                                    <span className="ml-3">{child.label}</span>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default ManageMenu;
