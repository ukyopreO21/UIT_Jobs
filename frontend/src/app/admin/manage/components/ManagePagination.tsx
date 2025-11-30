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

const pageSizes = [5, 10, 15, 20];

const ManagePagination = ({
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
    const [isOpen, setIsOpen] = useState<boolean>(false);
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
        <div className="px-4 h-17 lg:h-18 w-full flex justify-between items-center border-t border-[#e7e7e8]">
            <div className="flex items-center gap-3">
                <span className="text-responsive hidden md:block">Số kết quả mỗi trang:</span>
                <Combobox<number>
                    value={Number(tempResultPerPage)}
                    onChange={(size) => {
                        if (size == null) return;
                        setTempResultPerPage(String(size));
                        handleResultPerPage(size);
                    }}
                    immediate>
                    <div className="relative">
                        <div className="flex w-16 h-10 rounded-sm border-none outline-1 outline-[#e7e7e8] focus-within:outline-2 focus-within:outline-[#4263eb] transition duration-200 ease-in-out">
                            <ComboboxInput
                                ref={resultPerPageInputRef}
                                displayValue={() => tempResultPerPage}
                                value={tempResultPerPage}
                                className="w-full text-center outline-none"
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
                            <ComboboxOptions className="absolute bottom-full mb-2 w-16 overflow-auto rounded-sm bg-white focus:border-none z-10 border border-[#e7e7e8]">
                                {pageSizes.map((size) => (
                                    <ComboboxOption
                                        key={size}
                                        value={size}
                                        className="cursor-pointer hover:bg-[#dbe4ff] px-3 py-1">
                                        {size}
                                    </ComboboxOption>
                                ))}
                            </ComboboxOptions>
                        </Transition>
                    </div>
                </Combobox>
            </div>
            <div className="flex gap-2 items-center text-responsive">
                <button
                    onClick={handleFirstPage}
                    className="bg-[#f6f6f6] border border-[#e7e7e8] hover:bg-[#dbe4ff] hover:border-[#dbe4ff] hover:text-[#4263eb] transition duration-200 ease-in-out justify-center items-center rounded-md cursor-pointer
								hidden md:flex h-9 lg:h-10 w-23 lg:w-26">
                    Trang đầu
                </button>
                <button
                    onClick={handlePrevPage}
                    className="bg-[#f6f6f6] border border-[#e7e7e8] hover:bg-[#dbe4ff] hover:border-[#dbe4ff] hover:text-[#4263eb] transition duration-200 ease-in-out flex justify-center items-center rounded-md cursor-pointer
								 w-9 h-9 lg:w-10 lg:h-10">
                    <HiArrowLongLeft size={20} />
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
                    className="w-9 h-9 lg:w-10 lg:h-10 text-center rounded-md border border-[#e7e7e8] outline-none focus:border-2 focus:border-[#4263eb] transition duration-200 ease-in-out"
                />
                <span>/</span>
                <input
                    disabled
                    value={totalPages}
                    className="w-9 h-9 lg:w-10 lg:h-10 text-center rounded-md bg-[#f6f6f6] border border-[#e7e7e8] outline-none cursor-not-allowed"
                />
                <button
                    onClick={handleNextPage}
                    className="bg-[#f6f6f6] border border-[#e7e7e8] hover:bg-[#dbe4ff] hover:border-[#dbe4ff] hover:text-[#4263eb] transition duration-200 ease-in-out flex justify-center items-center rounded-md cursor-pointer
								w-9 h-9 lg:w-10 lg:h-10">
                    <HiArrowLongRight size={20} />
                </button>
                <button
                    onClick={handleLastPage}
                    className="bg-[#f6f6f6] border border-[#e7e7e8] hover:bg-[#dbe4ff] hover:border-[#dbe4ff] hover:text-[#4263eb] transition duration-200 ease-in-out justify-center items-center rounded-md cursor-pointer
								hidden md:flex h-9 lg:h-10 w-23 lg:w-26">
                    Trang cuối
                </button>
            </div>
        </div>
    );
};

export default ManagePagination;
