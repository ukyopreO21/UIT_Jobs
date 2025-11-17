import { useState, useEffect } from "react";
import { HiArrowLongLeft, HiArrowLongRight } from "react-icons/hi2";

const Pagination = () => {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(10);

    const handleFirstPage = () => {
        setCurrentPage(1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleLastPage = () => {
        setCurrentPage(totalPages);
    };

    return (
        <div className="px-4 h-18 w-full flex justify-between items-center border-t border-[#e7e7e8]">
            <div>Số kết quả mỗi trang</div>
            <div className="flex gap-2">
                <button
                    onClick={handleFirstPage}
                    className="bg-gray-200 h-10 flex justify-center items-center w-26 rounded-md cursor-pointer">
                    Trang đầu
                </button>
                <button
                    onClick={handlePrevPage}
                    className="bg-gray-200 w-10 h-10 flex justify-center items-center rounded-md cursor-pointer">
                    <HiArrowLongLeft size={20} />
                </button>
                <input
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="w-10 h-10 text-center rounded-md border border-gray-300 outline-none"
                />
                <button
                    onClick={handleNextPage}
                    className="bg-gray-200 w-10 h-10 flex justify-center items-center rounded-md cursor-pointer">
                    <HiArrowLongRight size={20} />
                </button>
                <button
                    onClick={handleLastPage}
                    className="bg-gray-200 h-10 flex justify-center items-center w-26 rounded-md cursor-pointer">
                    Trang cuối
                </button>
            </div>
        </div>
    );
};

export default Pagination;
