import ManageFilterButton from "../../components/ManageFilterButton";
import TableRows from "./TableRows";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import useAdminJobStore from "@/stores/admin-job.store";
import Job from "@/types/Job";

const ComplexTable = ({ toggleFiltersView }: { toggleFiltersView: (value: boolean) => void }) => {
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
        "Hình thức",
        "Vị trí",
        "Phòng/ban",
        "Tiểu phòng/ban",
        "Số lượng",
        "Bằng cấp",
        "Hạn chót",
        "Chi tiết",
    ];

    const colsToFill: Array<keyof Job> = [
        "id",
        "type",
        "position_name",
        "department_name",
        "sub_department_name",
        "quantity",
        "degree",
        "deadline",
    ];

    return (
        <div className="flex-1 flex flex-col min-h-0 h-full border border-primary-border bg-white rounded-md overflow-hidden">
            <div className="px-4 h-17 bp4:h-18 w-full flex-between-center border-b border-primary-border">
                <ManageFilterButton
                    toggleSideView={() => toggleFiltersView(true)}
                    hasNoti={!isFieldsEmpty}
                />
                <SearchBar handleSearch={setSearchValue} placeholder="Tìm kiếm việc làm..." />
            </div>

            {jobs && jobs.length > 0 ? (
                <div className="flex-1 overflow-auto">
                    <table className="w-full">
                        <thead className="sticky top-0">
                            <tr className="h-11 bp4:h-12 bg-primary-bg-100">
                                {colsToShow.map((col, index) => (
                                    <th key={index} className="font-normal">
                                        <div className="px-4 text-primary-text text-default">
                                            {col}
                                        </div>
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <TableRows data={jobs} colsToFill={colsToFill} />
                    </table>
                </div>
            ) : (
                <div className="w-full h-full flex-1 flex-center text-default">
                    Không tìm thấy việc làm nào.
                </div>
            )}

            <div className="px-4 border-t border-primary-border">
                <Pagination
                    pageSizes={[5, 10, 15, 20]}
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
        </div>
    );
};

export default ComplexTable;
