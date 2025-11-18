import { useState, useEffect } from "react";
import { HiArrowLongLeft, HiArrowLongRight } from "react-icons/hi2";

const ManagePagination = ({
    resultPerPage,
    currentPage,
    totalPages,
    handleFirstPage,
    handlePrevPage,
    handleCurrentPage,
    handleNextPage,
    handleLastPage,
}: {
    resultPerPage: number;
    currentPage: number;
    totalPages: number;
    handleFirstPage: () => void;
    handlePrevPage: () => void;
    handleCurrentPage: (page: number) => void;
    handleNextPage: () => void;
    handleLastPage: () => void;
}) => {
    const [tempCurrentPage, setTempCurrentPage] = useState<number>(1);

    useEffect(() => {
        setTempCurrentPage(currentPage);
    }, [currentPage]);

    return (
        <div className="px-4 h-18 w-full flex justify-between items-center border-t border-[#e7e7e8]">
            <div>Số kết quả mỗi trang: {resultPerPage}</div>
            <div className="flex gap-2 items-center">
                <button
                    onClick={handleFirstPage}
                    className="bg-[#f6f6f6] border border-[#e7e7e8] hover:bg-[#dbe4ff] hover:border-[#dbe4ff] hover:text-[#4263eb] transition duration-200 ease-in-out  h-10 flex justify-center items-center w-26 rounded-md cursor-pointer">
                    Trang đầu
                </button>
                <button
                    onClick={handlePrevPage}
                    className="bg-[#f6f6f6] border border-[#e7e7e8] hover:bg-[#dbe4ff] hover:border-[#dbe4ff] hover:text-[#4263eb] transition duration-200 ease-in-out  w-10 h-10 flex justify-center items-center rounded-md cursor-pointer">
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
                    className="w-10 h-10 text-center rounded-md border border-[#e7e7e8] outline-none focus:border-2 focus:border-[#4263eb] transition duration-200 ease-in-out"
                />
                <span>/</span>
                <input
                    disabled
                    value={totalPages}
                    className="w-10 h-10 text-center rounded-md bg-[#f6f6f6] border border-[#e7e7e8] outline-none cursor-not-allowed"
                />
                <button
                    onClick={handleNextPage}
                    className="bg-[#f6f6f6] border border-[#e7e7e8] hover:bg-[#dbe4ff] hover:border-[#dbe4ff] hover:text-[#4263eb] transition duration-200 ease-in-out  w-10 h-10 flex justify-center items-center rounded-md cursor-pointer">
                    <HiArrowLongRight size={20} />
                </button>
                <button
                    onClick={handleLastPage}
                    className="bg-[#f6f6f6] border border-[#e7e7e8] hover:bg-[#dbe4ff] hover:border-[#dbe4ff] hover:text-[#4263eb] transition duration-200 ease-in-out h-10 flex justify-center items-center w-26 rounded-md cursor-pointer">
                    Trang cuối
                </button>
            </div>
        </div>
    );
};

export default ManagePagination;
