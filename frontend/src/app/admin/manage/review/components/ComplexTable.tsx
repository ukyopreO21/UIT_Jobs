import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import ManageFilterButton from "../../components/ManageFilterButton";
import TableRows from "./TableRows";
import ManageSearchBar from "../../components/ManageSearchBar";
import ManagePagination from "../../components/ManagePagination";
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

    const colsToShow = [
        "Mã hồ sơ",
        "Thời gian nộp",
        "Họ và tên",
        "Vị trí",
        "Đơn vị",
        "Bộ môn",
        "Trạng thái",
        "Chi tiết",
    ];

    const colsToFill: Array<keyof Application> = [
        "id",
        "created_at",
        "applicant_name",
        "position",
        "faculty",
        "discipline",
        "status",
    ];

    const status = ["Đã ghi nhận", "Đang phỏng vấn", "Được tuyển dụng", "Bị từ chối"];

    return (
        <div className="flex-1 min-h-0 h-full border border-[#e7e7e8] bg-white rounded-md overflow-hidden">
            <TabGroup
                onChange={(index) => {
                    const selectedStatus = status[index];
                    setFields({ status: selectedStatus });
                }}
                defaultIndex={0}
                className="flex flex-col h-full">
                <TabList className="flex gap-4 border-b border-[#e7e7e8] px-4 outline-none">
                    {status.map((name) => (
                        <Tab
                            key={name}
                            className="h-12 px-4 cursor-pointer tab-underline text-[#535458] data-selected:text-black">
                            {name} ({quantityPerStatus[name]})
                        </Tab>
                    ))}
                </TabList>
                <TabPanels className="flex-1 min-h-0 overflow-auto">
                    {status.map((name) => (
                        <TabPanel className="h-full flex flex-1 flex-col" key={name}>
                            <div className="px-4 h-18 w-full flex justify-between items-center border-b border-[#e7e7e8]">
                                <ManageFilterButton
                                    toggleSideView={() => toggleFiltersView(true)}
                                />
                                <ManageSearchBar
                                    handleSearch={setSearchValue}
                                    placeholder="Tìm kiếm hồ sơ..."
                                />
                            </div>
                            {applications && applications.length > 0 ? (
                                <div className="flex-1 overflow-auto">
                                    <table className="w-full">
                                        <thead className="sticky top-0">
                                            <tr className="h-12 bg-[#f1f1f2]">
                                                {colsToShow.map((col, index) => (
                                                    <th key={index} className="font-normal">
                                                        <div className="px-4 text-[#535458]">
                                                            {col}
                                                        </div>
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>

                                        <TableRows
                                            data={applications}
                                            colsToFill={colsToFill}
                                            toggleSideView={() => toggleDetailsView(true)}
                                            handleLoadData={setApplicationDetail}
                                        />
                                    </table>
                                </div>
                            ) : (
                                <div className="w-full h-full flex-1 flex items-center justify-center">
                                    Không tìm thấy hồ sơ nào.
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
                        </TabPanel>
                    ))}
                </TabPanels>
            </TabGroup>
        </div>
    );
};

export default ComplexTable;
