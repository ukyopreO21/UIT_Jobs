import { useState, useEffect, useRef, Fragment } from "react";
import {
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOption,
    ComboboxOptions,
    Transition,
} from "@headlessui/react";
import { HiArrowLongLeft, HiArrowLongRight, HiMiniChevronUpDown } from "react-icons/hi2";

const ManagePagination = ({
    pageSizes,
    resultPerPage,
    currentPage,
    totalPages,
    handleResultPerPage,
    handleFirstPage,
    handlePrevPage,
    handleCurrentPage,
    handleNextPage,
    handleLastPage,
}: {
    pageSizes: number[];
    resultPerPage: number;
    currentPage: number;
    totalPages: number;
    handleResultPerPage: (size: number) => void;
    handleFirstPage: () => void;
    handlePrevPage: () => void;
    handleCurrentPage: (page: number) => void;
    handleNextPage: () => void;
    handleLastPage: () => void;
}) => {
    const [tempCurrentPage, setTempCurrentPage] = useState<number>(1);
    const [tempResultPerPage, setTempResultPerPage] = useState<string>(String(resultPerPage));

    const resultPerPageInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setTempCurrentPage(currentPage);
    }, [currentPage]);

    useEffect(() => {
        setTempResultPerPage(String(resultPerPage));
    }, [resultPerPage]);

    const commitResultPerPage = (raw: string) => {
        const trimmed = raw.trim();
        if (trimmed === "") return;
        const n = Number(trimmed);
        if (!Number.isInteger(n)) return;
        if (n < 1 || n > 100) return;
        if (n === resultPerPage) return;
        handleResultPerPage(n);
    };

    return (
        <div className="h-17 lg:h-18 w-full flex-between-center">
            <div className="flex-center gap-3">
                <span className="text-default hidden xl:block">Số kết quả mỗi trang:</span>
                <Combobox<number>
                    value={Number(tempResultPerPage)}
                    onChange={(size) => {
                        if (size == null) return;
                        setTempResultPerPage(String(size));
                        handleResultPerPage(size);
                    }}
                    immediate>
                    <div className="relative">
                        <div className="flex h-9 lg:h-10 w-14 lg:w-16 rounded-md input-container-outline-default transition-default">
                            <ComboboxInput
                                ref={resultPerPageInputRef}
                                displayValue={() => tempResultPerPage}
                                value={tempResultPerPage}
                                className="w-full text-center text-default outline-none"
                                onChange={(e) => {
                                    const raw = e.currentTarget.value;
                                    if (/^\d*$/.test(raw)) {
                                        setTempResultPerPage(raw);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                        resultPerPageInputRef.current?.blur();
                                    }
                                }}
                                onBlur={(e) => {
                                    commitResultPerPage(e.currentTarget.value);
                                }}
                            />
                            <ComboboxButton className="flex items-center cursor-pointer z-2">
                                <HiMiniChevronUpDown size={20} />
                            </ComboboxButton>
                        </div>

                        <Transition
                            as={Fragment}
                            enter="transition ease-out duration-200"
                            enterFrom="opacity-0 translate-y-2 scale-95"
                            enterTo="opacity-100 translate-y-0 scale-100"
                            leave="transition ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 scale-100"
                            leaveTo="opacity-0 translate-y-2 scale-95">
                            <ComboboxOptions className="absolute bottom-full mb-2 w-14 lg:w-16 overflow-auto rounded-md bg-white focus:border-none z-10 border border-primary-border">
                                {pageSizes.map((size) => (
                                    <ComboboxOption
                                        key={size}
                                        value={size}
                                        className="cursor-pointer hover:bg-secondary-blue-light transition-default px-3 py-1 text-default">
                                        {size}
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        </Transition>
                    </div>
                </Combobox>
            </div>
            <div className="flex gap-2 items-center text-default">
                <button
                    onClick={handleFirstPage}
                    className="bg-primary-bg border border-primary-border hover:bg-secondary-blue-light hover:border-secondary-blue-light hover:text-secondary-blue-dark-extra
								transition-default button-default text-default rounded-md
								not-md:hidden md:flex-center">
                    Trang đầu
                </button>
                <button
                    onClick={handlePrevPage}
                    className="bg-primary-bg border border-primary-border hover:bg-secondary-blue-light hover:border-secondary-blue-light hover:text-secondary-blue-dark-extra
								transition-default rounded-md
								flex-center w-9 h-9 lg:w-10 lg:h-10">
                    <HiArrowLongLeft className="icon-default" />
                </button>
                <input
                    value={tempCurrentPage}
                    onChange={(e) => setTempCurrentPage(Number(e.currentTarget.value))}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleCurrentPage(Number(e.currentTarget.value));
                    }}
                    onBlur={(e) => {
                        handleCurrentPage(Number(e.currentTarget.value));
                    }}
                    className="w-9 h-9 lg:w-10 lg:h-10 text-center rounded-md input-container-outline-default transition-default"
                />
                <span>/</span>
                <input
                    disabled
                    value={totalPages}
                    className="w-9 h-9 lg:w-10 lg:h-10 text-center rounded-md input-container-outline-default transition-default cursor-not-allowed"
                />
                <button
                    onClick={handleNextPage}
                    className="bg-primary-bg border border-primary-border hover:bg-secondary-blue-light hover:border-secondary-blue-light hover:text-secondary-blue-dark-extra
								transition-default rounded-md
								flex-center w-9 h-9 lg:w-10 lg:h-10">
                    <HiArrowLongRight className="icon-default" />
                </button>
                <button
                    onClick={handleLastPage}
                    className="bg-primary-bg border border-primary-border hover:bg-secondary-blue-light hover:border-secondary-blue-light hover:text-secondary-blue-dark-extra
								transition-default button-default text-default rounded-md
								not-md:hidden md:flex-center">
                    Trang cuối
                </button>
            </div>
        </div>
    );
};

export default ManagePagination;
