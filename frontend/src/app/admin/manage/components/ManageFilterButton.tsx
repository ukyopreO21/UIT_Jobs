import { VscFilter } from "react-icons/vsc";

const ManageFilterButton = () => {
    return (
        <button className="flex items-center rounded-md border border-[#e7e7e8] bg-white h-10 px-2 gap-3 cursor-pointer hover:bg-[#f6f6f6] transition duration-200 ease-in-out">
            <VscFilter size={20} />
            <span>Tạo bộ lọc</span>
        </button>
    );
};

export default ManageFilterButton;
