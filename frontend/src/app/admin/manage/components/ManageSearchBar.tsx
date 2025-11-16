import { HiMagnifyingGlass } from "react-icons/hi2";

const ManageSearchBar = () => {
    return (
        <div className="flex items-center border border-[#e7e7e8] rounded-md w-fit h-10 p-2 gap-3">
            <HiMagnifyingGlass size={20} />
            <input type="text" placeholder="Tìm kiếm hồ sơ..." className="w-64 outline-none" />
        </div>
    );
};

export default ManageSearchBar;
