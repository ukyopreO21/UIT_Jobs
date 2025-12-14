import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import ManageFilterButton from "../../components/ManageFilterButton";
import TableRows from "./TableRows";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";
import useAdminApplicationStore from "@/stores/admin-application.store";
import Application from "@/types/Application";

const ComplexTable = ({
    toggleDetailsView,
    toggleFiltersView,
}: {
    toggleDetailsView: (value: boolean) => void;
    toggleFiltersView: (value: boolean) => void;
}) => {
    const applications = useAdminApplicationStore((state) => state.applications);
    const quantityPerStatus = useAdminApplicationStore((state) => state.quantityPerStatus);
    const resultPerPage = useAdminApplicationStore((state) => state.resultPerPage);
    const currentPage = useAdminApplicationStore((state) => state.currentPage);
    const totalPages = useAdminApplicationStore((state) => state.totalPages);

    const setApplicationDetail = useAdminApplicationStore((state) => state.setApplicationDetail);
    const setSearchValue = useAdminApplicationStore((state) => state.setSearchValue);
    const setFields = useAdminApplicationStore((state) => state.setFields);
    const setResultPerPage = useAdminApplicationStore((state) => state.setResultPerPage);
    const setCurrentPage = useAdminApplicationStore((state) => state.setCurrentPage);

    const isFieldsEmpty = useAdminApplicationStore((state) => state.isFieldsEmpty());

    const colsToShow = [
        "Mã hồ sơ",
        "Thời gian nộp",
        "Họ và tên",
        "Vị trí",
        "Phòng/ban",
        "Tiểu phòng/ban",
        "Trạng thái",
        "Chi tiết",
    ];

    const colsToFill: Array<keyof Application> = [
        "id",
        "created_at",
        "applicant_name",
        "position_name",
        "department_name",
        "sub_department_name",
        "status",
    ];

    const status = ["Đã ghi nhận", "Đang phỏng vấn", "Được tuyển dụng", "Bị từ chối"];

    return (
        <div className="flex-1 min-h-0 h-full border border-primary-border bg-white rounded-md overflow-hidden">
            <TabGroup
                onChange={(index) => {
                    const selectedStatus = status[index];
                    setFields({ status: selectedStatus });
                }}
                defaultIndex={0}
                className="flex flex-col h-full">
                <TabList className="flex gap-4 border-b border-primary-border px-4 outline-none">
                    {status.map((name) => (
                        <Tab
                            key={name}
                            className="h-11 bp4:h-12 px-4 tab-underline text-primary-text data-selected:text-black overflow-hidden text-default">
                            {name} ({quantityPerStatus[name]})
                        </Tab>
                    ))}
                </TabList>
                <TabPanels className="flex-1 min-h-0 overflow-auto">
                    {status.map((name) => (
                        <TabPanel className="h-full flex flex-1 flex-col" key={name}>
                            <div className="px-4 h-17 bp4:h-18 w-full flex-between-center border-b border-primary-border">
                                <ManageFilterButton
                                    hasNoti={!isFieldsEmpty}
                                    toggleSideView={() => toggleFiltersView(true)}
                                />

                                <SearchBar
                                    handleSearch={setSearchValue}
                                    placeholder="Tìm kiếm hồ sơ..."
                                />
                            </div>
                            {applications && applications.length > 0 ? (
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

                                        <TableRows data={applications} colsToFill={colsToFill} />
                                    </table>
                                </div>
                            ) : (
                                <div className="w-full h-full flex-1 flex-center text-default">
                                    Không tìm thấy hồ sơ nào.
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
                        </TabPanel>
                    ))}
                </TabPanels>
            </TabGroup>
        </div>
    );
};

export default ComplexTable;
