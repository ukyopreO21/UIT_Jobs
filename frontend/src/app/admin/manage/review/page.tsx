"use client";
import { useEffect } from "react";
import ManageList from "../components/ManageList";
import ManageFilterButton from "../components/ManageFilterButton";
import ManageSearchBar from "../components/ManageSearchBar";

import useAdminApplicationStore from "@/stores/admin-application.store";
import useLoadingStore from "@/stores/loading.store";

const ReviewPage = () => {
    const applications = useAdminApplicationStore((state) => state.applications);
    const getApplications = useAdminApplicationStore((state) => state.getApplications);

    const showLoading = useLoadingStore((state) => state.showLoading);
    const hideLoading = useLoadingStore((state) => state.hideLoading);

    useEffect(() => {
        const fetchApplications = async () => {
            showLoading();
            try {
                await getApplications();
            } catch (error) {
                console.error("Failed to get applications", error);
            } finally {
                hideLoading();
            }
        };

        fetchApplications();
    }, [getApplications]);

    return (
        <div className="flex flex-col gap-6">
            <span>Hồ sơ</span>
            <div className="flex-1 h-full bg-white border border-[#e7e7e8] rounded-md">
                <div className="p-4 w-full flex justify-between items-center border-b border-[#e7e7e8]">
                    <ManageFilterButton />
                    <ManageSearchBar />
                </div>
                <table className="w-full">
                    <thead className="bg-[#fafcfe]">
                        <tr className="h-12">
                            <th className="font-normal px-4">Mã hồ sơ</th>
                            <th className="font-normal px-4">Thời gian nộp</th>
                            <th className="font-normal px-4">Họ và tên</th>
                            <th className="font-normal px-4">Đơn vị</th>
                            <th className="font-normal px-4">Trạng thái</th>
                            <th className="font-normal px-4">Chi tiết</th>
                        </tr>
                    </thead>
                    <ManageList
                        data={applications}
                        colToFill={[
                            "id",
                            "created_at",
                            "applicant_name",
                            "applicant_inst_name",
                            "status",
                        ]}
                    />
                </table>
            </div>
        </div>
    );
};

export default ReviewPage;
