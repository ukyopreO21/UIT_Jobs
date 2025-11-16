import { Fragment } from "react";
import useLoadingRouter from "@/hooks/useLoadingRouter";
import { AiOutlineEdit } from "react-icons/ai";
import { HiOutlineArrowLeftOnRectangle, HiOutlineEllipsisVertical } from "react-icons/hi2";
import { Popover, PopoverButton, PopoverPanel, Transition } from "@headlessui/react";
import useUserStore, { User } from "@/stores/user.store";

const UserButton = ({ user }: { user: User | null }) => {
    const accountMenu = [
        { name: "Cập nhật thông tin", onClick: () => {}, icon: <AiOutlineEdit size={20} /> },
        {
            name: "Đăng xuất",
            onClick: () => handleLogout(),
            icon: <HiOutlineArrowLeftOnRectangle size={20} />,
        },
    ];

    const router = useLoadingRouter();
    const logout = useUserStore((state) => state.logout);

    const handleLogout = async () => {
        try {
            await logout();
            router.push("/admin/login");
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <Popover className="relative">
            <PopoverButton className="w-full h-15 bg-[#f9fafa] rounded-md border border-[#e7e7e8] flex items-center px-4 outline-none cursor-pointer transition duration-200 ease-in-out hover:bg-[#f1f1f2]">
                <div className="rounded-full w-9 h-9 bg-gray-500"></div>
                <div className="ml-3 flex-1 flex flex-col">
                    <span className="text-left text-sm">{user?.full_name}</span>
                    <span className="text-left text-sm text-[#535458]">@{user?.username}</span>
                </div>

                <HiOutlineEllipsisVertical
                    size={20}
                    className="flex justify-center items-center outline-none"
                />
            </PopoverButton>

            <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-2 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 translate-y-2 scale-95">
                <PopoverPanel className="absolute w-72 bottom-full mb-1 flex flex-col border border-[#e7e7e8] bg-white rounded-lg overflow-hidden">
                    {accountMenu.map((item) => (
                        <button
                            key={item.name}
                            onClick={item.onClick}
                            className="w-72 h-10 flex items-center px-2 cursor-pointer transition duration-200 ease-in-out hover:bg-[#f6f6f6]">
                            {item.icon}
                            <span className="ml-3 text-[#535458]">{item.name}</span>
                        </button>
                    ))}
                </PopoverPanel>
            </Transition>
        </Popover>
    );
};

export default UserButton;
