import { useState } from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";

const SearchBar = ({
    handleSearch,
    placeholder,
    width,
}: {
    handleSearch: (query: string) => void;
    placeholder?: string;
    width?: string;
}) => {
    const [searchQuery, setSearchQuery] = useState<string>("");

    return (
        <div
            className={`flex-center rounded-md ${width ?? "w-fit"} input-container-default input-container-outline-default transition-default`}>
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
                className="input-text-default text-default bp4:w-64"
            />
        </div>
    );
};

export default SearchBar;
