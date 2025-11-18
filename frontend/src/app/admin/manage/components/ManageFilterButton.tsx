import { VscFilter } from "react-icons/vsc";

const ManageFilterButton = ({ toggleSideView }: { toggleSideView: () => void }) => {
    return (
        <button
            className="flex items-center rounded-md border bg-[#f6f6f6] border-[#e7e7e8] h-10 px-2 gap-3 cursor-pointer hover:bg-[#dbe4ff] hover:border-[#dbe4ff] hover:text-[#4263eb] transition duration-200 ease-in-out"
            onClick={() => toggleSideView()}>
            <VscFilter size={20} />
            <span>Tạo bộ lọc</span>
        </button>
    );
};

export default ManageFilterButton;
