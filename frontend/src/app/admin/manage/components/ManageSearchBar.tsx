import { useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

const ManageSearchBar = ({ handleSearch }: { handleSearch: (query: string) => void }) => {
    const [searchQuery, setSearchQuery] = useState<string>("");

    return (
        <div className="flex items-center outline outline-[#e7e7e8] rounded-md w-fit h-10 p-2 gap-3 focus-within:outline-2 focus-within:outline-[#4263eb] transition duration-200 ease-in-out">
            <HiMagnifyingGlass size={20} />
            <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.currentTarget.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch(e.currentTarget.value);
                }}
                onBlur={(e) => {
                    handleSearch(e.currentTarget.value);
                }}
                type="text"
                placeholder="Tìm kiếm hồ sơ..."
                className="w-64 outline-none"
            />
        </div>
    );
};

export default ManageSearchBar;
