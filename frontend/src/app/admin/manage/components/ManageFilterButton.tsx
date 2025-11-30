import { VscFilter } from "react-icons/vsc";

const ManageFilterButton = ({
    toggleSideView,
    hasNoti,
}: {
    toggleSideView: () => void;
    hasNoti: boolean;
}) => {
    return (
        <button
            className="relative flex justify-center items-center rounded-md border bg-[#f6f6f6] border-[#e7e7e8] gap-2 cursor-pointer
			w-9 sm:w-fit h-9 lg:h-10 px-0 sm:px-3
			hover:bg-[#dbe4ff] hover:border-[#dbe4ff] hover:text-[#4263eb] transition duration-200 ease-in-out"
            onClick={() => toggleSideView()}>
            <VscFilter className="icon-responsive flex" />
            <span className="hidden sm:block text-responsive">Tạo bộ lọc</span>
            {hasNoti && (
                <div className="absolute top-0 right-0 w-2.5 h-2.5 translate-x-1.25 -translate-y-1.25 rounded-full bg-[#4263eb]"></div>
            )}
        </button>
    );
};

export default ManageFilterButton;
