import ManageFilterButton from "../../components/ManageFilterButton";
import TableRows from "./TableRows";
import ManageSearchBar from "../../components/ManageSearchBar";
import ManagePagination from "../../components/ManagePagination";
import useAdminJobStore from "@/stores/admin-job.store";
import Job from "@/types/Job";

const ComplexTable = ({
    toggleDetailsView,
    toggleFiltersView,
}: {
    toggleDetailsView: (value: boolean) => void;
    toggleFiltersView: (value: boolean) => void;
}) => {
    const jobs = useAdminJobStore((state) => state.jobs);
    const resultPerPage = useAdminJobStore((state) => state.resultPerPage);
    const currentPage = useAdminJobStore((state) => state.currentPage);
    const totalPages = useAdminJobStore((state) => state.totalPages);

    const setJobDetail = useAdminJobStore((state) => state.setJobDetail);
    const setSearchValue = useAdminJobStore((state) => state.setSearchValue);
    const setResultPerPage = useAdminJobStore((state) => state.setResultPerPage);
    const setCurrentPage = useAdminJobStore((state) => state.setCurrentPage);

    const isFieldsEmpty = useAdminJobStore((state) => state.isFieldsEmpty());

    const colsToShow = [
        "Mã việc làm",
        "Vị trí",
        "Đơn vị",
        "Bộ môn",
        "Số lượng",
        "Bằng cấp",
        "Hạn chót",
        "Chi tiết",
    ];

    const colsToFill: Array<keyof Job> = [
        "id",
        "position",
        "faculty",
        "discipline",
        "quantity",
        "degree",
        "deadline",
    ];

    return (
        <div className="flex-1 flex flex-col min-h-0 h-full border border-[#e7e7e8] bg-white rounded-md overflow-hidden">
            <div className="px-4 h-17 lg:h-18 w-full flex justify-between items-center border-b border-[#e7e7e8]">
                <ManageFilterButton
                    toggleSideView={() => toggleFiltersView(true)}
                    hasNoti={!isFieldsEmpty}
                />
                <ManageSearchBar handleSearch={setSearchValue} placeholder="Tìm kiếm việc làm..." />
            </div>

            {jobs && jobs.length > 0 ? (
                <div className="flex-1 overflow-auto">
                    <table className="w-full">
                        <thead className="sticky top-0">
                            <tr className="h-12 bg-[#f1f1f2]">
                                {colsToShow.map((col, index) => (
                                    <th key={index} className="font-normal">
                                        <div className="px-4 text-[#535458] text-responsive">
                                            {col}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <TableRows
                            data={jobs}
                            colsToFill={colsToFill}
                            toggleSideView={() => toggleDetailsView(true)}
                            handleLoadData={setJobDetail}
                        />
                    </table>
                </div>
            ) : (
                <div className="w-full h-full flex-1 flex items-center justify-center text-responsive">
                    Không tìm thấy việc làm nào.
                </div>
            )}

            <ManagePagination
                resultPerPage={resultPerPage}
                currentPage={currentPage}
                totalPages={totalPages}
                handleResultPerPage={(size) => setResultPerPage(size)}
                handleFirstPage={() => setCurrentPage(1)}
                handlePrevPage={() => setCurrentPage(currentPage - 1)}
                handleCurrentPage={(page) => setCurrentPage(page)}
                handleNextPage={() => setCurrentPage(currentPage + 1)}
                handleLastPage={() => setCurrentPage(totalPages)}
            />
        </div>
    );
};

export default ComplexTable;
