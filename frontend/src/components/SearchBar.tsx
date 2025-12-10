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
        <div className="flex-center rounded-md w-fit input-container-default input-container-outline-default transition-default">
            <HiMagnifyingGlass className="icon-default" />
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
                className="input-text-default text-default lg:w-64"
            />
        </div>
    );
};

export default ManageSearchBar;
