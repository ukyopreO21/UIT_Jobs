"use client";
import { Fragment } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels, Transition } from "@headlessui/react";
import Breadcrumb from "@/components/Breadcrumb";
import useAdminApplicationStore from "@/stores/admin-application.store";
import Application from "@/types/Application";
import { useState, useEffect } from "react";
import ManageFilterButton from "../components/ManageFilterButton";
import ManageList from "../components/ManageList";
import ManageSearchBar from "../components/ManageSearchBar";
import ViewDetail from "./components/ViewDetail";
import Pagination from "../components/Pagination";

const ReviewPage = () => {
    const applicationDetail = useAdminApplicationStore((state) => state.applicationDetail);
    const applications = useAdminApplicationStore((state) => state.applications);
    const findAll = useAdminApplicationStore((state) => state.findAll);
    const setApplicationDetail = useAdminApplicationStore((state) => state.setApplicationDetail);

    const colsToShow = [
        "Mã hồ sơ",
        "Thời gian nộp",
        "Họ và tên",
        "Vị trí",
        "Đơn vị",
        "Trạng thái",
        "Chi tiết",
    ];

    const colsToFill: Array<keyof Application> = [
        "id",
        "created_at",
        "applicant_name",
        "position",
        "department",
        "status",
    ];

    const [isDetailViewShowing, setIsDetailViewShowing] = useState<boolean>(false);

    const toggleViewDetail = () => {
        setIsDetailViewShowing(!isDetailViewShowing);
    };

    useEffect(() => {
        const fetchApplications = async () => {
            await findAll();
        };

        fetchApplications();
    }, [findAll]);

    const categories = ["Đã ghi nhận", "Đang phỏng vấn", "Được tuyển dụng", "Bị từ chối"];

    return (
        <div className="flex flex-col gap-6 h-full">
            <Breadcrumb items={[{ label: "Hồ sơ" }]} />

            <div className="flex-1 min-h-0 h-full border border-[#e7e7e8] bg-white rounded-md overflow-hidden">
                <TabGroup className="flex flex-col h-full">
                    <TabList className="flex gap-4 border-b border-[#e7e7e8] px-4 outline-none">
                        {categories.map((name) => (
                            <Tab
                                key={name}
                                className="h-12 px-4 cursor-pointer tab-underline text-[#535458] data-selected:text-black">
                                {name}
                            </Tab>
                        ))}
                    </TabList>
                    <TabPanels className="flex-1 min-h-0 overflow-auto">
                        {categories.map((name) => (
                            <TabPanel className="h-full flex flex-1 flex-col " key={name}>
                                <div className="px-4 h-18 w-full flex justify-between items-center border-b border-[#e7e7e8]">
                                    <ManageFilterButton />
                                    <ManageSearchBar />
                                </div>
                                {applications ? (
                                    <div className="flex-1 overflow-auto">
                                        <table className="w-full">
                                            <thead className="bg-[#fafcfe] sticky top-0 z-10 border-b border-[#e7e7e8]">
                                                <tr className="h-12">
                                                    {colsToShow.map((col, index) => (
                                                        <th key={index} className="font-normal">
                                                            <div className="px-4 text-[#535458]">
                                                                {col}
                                                            </div>
                                                        </th>
                                                    ))}
                                                </tr>
                                            </thead>

                                            <ManageList
                                                data={applications}
                                                colsToFill={colsToFill}
                                                toggleViewDetail={toggleViewDetail}
                                                handleLoadData={setApplicationDetail}
                                            />
                                        </table>
                                    </div>
                                ) : (
                                    <div className="w-full h-full flex-1 flex items-center justify-center">
                                        Không tìm thấy hồ sơ nào.
                                    </div>
                                )}
                                <Pagination />
                            </TabPanel>
                        ))}
                    </TabPanels>
                </TabGroup>
            </div>

            <Transition
                as={Fragment}
                show={isDetailViewShowing}
                enter="transition-opacity duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <div
                    className="absolute inset-0 z-10 bg-gray-400/50"
                    onClick={toggleViewDetail}></div>
            </Transition>

            <ViewDetail
                application={applicationDetail}
                toggleViewDetail={toggleViewDetail}
                isDetailViewShowing={isDetailViewShowing}
            />
        </div>
    );
};

export default ReviewPage;
