import { useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

const ManageSearchBar = ({
    handleSearch,
    placeholder,
}: {
    handleSearch: (query: string) => void;
    placeholder?: string;
}) => {
    const [searchQuery, setSearchQuery] = useState<string>("");

    return (
        <div className="flex items-center outline outline-[#e7e7e8] rounded-md w-fit button-responsive gap-3 focus-within:outline-2 focus-within:outline-[#4263eb] transition duration-200 ease-in-out">
            <HiMagnifyingGlass className="icon-responsive" />
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
                placeholder={placeholder}
                className="w-full lg:w-64 outline-none text-responsive"
            />
        </div>
    );
};

export default ManageSearchBar;
