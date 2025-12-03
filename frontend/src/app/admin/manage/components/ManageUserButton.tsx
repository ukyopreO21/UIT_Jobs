import { Fragment } from "react";
import useLoadingRouter from "@/hooks/useLoadingRouter";
import { AiOutlineEdit } from "react-icons/ai";
import { HiOutlineArrowLeftOnRectangle, HiOutlineEllipsisVertical } from "react-icons/hi2";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import useUserStore from "@/stores/user.store";
import User from "@/types/User";

const UserButton = ({ user }: { user: User | null }) => {
    const accountMenu = [
        {
            name: "Cập nhật thông tin",
            onClick: () => handleChangeInfo(),
            icon: <AiOutlineEdit size={20} />,
            textColor: "text-secondary-blue-dark",
        },
        {
            name: "Đăng xuất",
            onClick: () => handleLogout(),
            icon: <HiOutlineArrowLeftOnRectangle size={20} />,
            textColor: "text-secondary-red-dark",
        },
    ];

    const router = useLoadingRouter();
    const logout = useUserStore((state) => state.logout);

    const handleChangeInfo = () => {
        router.push("/admin/manage/account");
    };

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/admin/login");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <Popover className="relative">
            {({ close }) => (
                <>
                    <PopoverButton className="w-full h-15 bg-primary-bg-50 rounded-md border border-primary-border flex items-center px-4 outline-none transition-default hover:bg-primary-bg-100">
                        <div className="rounded-full w-9 h-9 bg-gray-500"></div>
                        <div className="ml-3 flex-1 flex flex-col">
                            <span className="text-left text-sm">{user?.full_name}</span>
                            <span className="text-left text-sm text-primary-text">
                                @{user?.username}
                            </span>
                        </div>

                        <HiOutlineEllipsisVertical size={20} className="flex-center" />
                    </PopoverButton>

                    <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="opacity-0 translate-y-2 scale-95"
                        enterTo="opacity-100 translate-y-0 scale-100"
                        leave="transition ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 scale-100"
                        leaveTo="opacity-0 translate-y-2 scale-95">
                        <PopoverPanel className="absolute w-72 bottom-full mb-1 flex flex-col border border-primary-border bg-white rounded-lg overflow-hidden">
                            {accountMenu.map((item) => (
                                <button
                                    key={item.name}
                                    onClick={() => {
                                        item.onClick();
                                        close();
                                    }}
                                    className={`w-72 h-10 flex items-center px-2 transition-default hover:bg-primary-bg ${
                                        item.textColor ? item.textColor : "text-primary-text"
                                    }`}>
                                    {item.icon}
                                    <span className="ml-3">{item.name}</span>
                                </button>
                            ))}
                        </PopoverPanel>
                    </Transition>
                </>
            )}
        </Popover>
    );
};

export default UserButton;
