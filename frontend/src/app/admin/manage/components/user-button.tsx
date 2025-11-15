import { useRouter } from "next/navigation";
import { AiOutlineEdit } from "react-icons/ai";
import { HiOutlineArrowLeftOnRectangle, HiOutlineEllipsisVertical } from "react-icons/hi2";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";

const UserButton = () => {
    const accountMenu = [
        { name: "Cập nhật thông tin", onClick: () => {}, icon: <AiOutlineEdit size={20} /> },
        {
            name: "Đăng xuất",
            onClick: () => handleLogout(),
            icon: <HiOutlineArrowLeftOnRectangle size={20} />,
        },
    ];

    const router = useRouter();

    const handleLogout = () => {
        router.push("/admin/login");
    };
    return (
        <Popover>
            <PopoverButton className="w-full h-12 bg-[#f9fafa] rounded-md border border-[#e7e7e8] flex items-center px-4 outline-none cursor-pointer transition duration-200 ease-in-out hover:bg-[#f1f1f2]">
                <div className="rounded-full w-7 h-7 bg-gray-500"></div>
                <span className="ml-3 flex-1 text-left">Họ và tên</span>
                <HiOutlineEllipsisVertical
                    size={24}
                    className="flex justify-center items-center outline-none"
                />
            </PopoverButton>
            <PopoverPanel
                anchor="top"
                className="flex flex-col border border-[#e7e7e8] rounded-lg -translate-y-1">
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
        </Popover>
    );
};

export default UserButton;
