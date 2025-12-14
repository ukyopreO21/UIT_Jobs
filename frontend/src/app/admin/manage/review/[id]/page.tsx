"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Select from "@/components/Select";
import useAdminApplicationStore from "@/stores/admin-application.store";
import { formatDatetime } from "@/utils/format-date";

const statusOptions = [
    { value: "Đã ghi nhận", label: "Đã ghi nhận", color: "text-secondary-blue-dark" },
    { value: "Đang phỏng vấn", label: "Đang phỏng vấn", color: "text-secondary-yellow-dark" },
    { value: "Được tuyển dụng", label: "Được tuyển dụng", color: "text-secondary-green-dark" },
    { value: "Bị từ chối", label: "Bị từ chối", color: "text-secondary-red-dark" },
];

const ReviewApplication = () => {
    const params = useParams();
    const [selectedStatus, setSelectedStatus] = useState(Object || null);
    const applicationDetail = useAdminApplicationStore((state) => state.applicationDetail);
    const findById = useAdminApplicationStore((state) => state.findById);
    const updateById = useAdminApplicationStore((state) => state.updateById);

    useEffect(() => {
        setSelectedStatus({
            label: applicationDetail?.status,
            color: statusOptions.find((status) => status.label === applicationDetail?.status)
                ?.color,
        });
    }, [applicationDetail]);

    useEffect(() => {
        if (params?.id) {
            findById(String(params.id));
        }
    }, [params?.id]);

    return (
        <div className="admin-page-layout-default">
            <div className="admin-page-first-container-default">
                <Breadcrumb
                    items={[
                        { label: "Hồ sơ", href: "/admin/manage/review" },
                        { label: "Chi tiết hồ sơ" },
                    ]}
                />

                <button
                    className="flex items-center gap-3 rounded-md button-default transition-default
					bg-[#0080ff] hover:bg-blue-600 text-white"
                    onClick={() => {
                        updateById(selectedStatus.label);
                    }}>
                    <span className="text-default">Lưu hồ sơ</span>
                </button>
            </div>

            <div className="flex flex-col bp8:flex-row flex-1 gap-4 h-fit bp8:min-h-0 bp8:h-full bp8:overflow-hidden">
                <div className="flex-1 flex flex-col border border-primary-border bg-white rounded-md p-4 gap-6 overflow-y-auto">
                    <label className="text-xl bp4:text-2xl font-semibold">
                        MÃ HỒ SƠ: #{params?.id}
                    </label>
                    <div className="flex flex-col gap-4">
                        <label className="text-lg font-semibold">THÔNG TIN VIỆC LÀM</label>
                        <div className="grid grid-cols-1 bp5:grid-cols-2 bp8:grid-cols-1 bp9:grid-cols-2 gap-x-12 gap-y-4">
                            <Input
                                value={applicationDetail?.position_name ?? ""}
                                label="Vị trí ứng tuyển"
                                name="position"
                                disabled={true}
                            />
                            <Input
                                value={applicationDetail?.department_name ?? ""}
                                label="Phòng/ban"
                                name="department"
                                disabled={true}
                            />
                            <Input
                                value={applicationDetail?.sub_department_name ?? ""}
                                label="Tiểu phòng/ban"
                                name="sub_department"
                                disabled={true}
                            />
                        </div>
                        <div className="grid grid-cols-1 bp5:grid-cols-2 bp13:grid-cols-4 gap-x-12 gap-y-4">
                            <Input
                                value={
                                    applicationDetail?.salary_type == "range"
                                        ? "Theo khoảng"
                                        : "Thỏa thuận"
                                }
                                label="Kiểu lương"
                                name="salary_type"
                                disabled={true}
                            />
                            <Input
                                value={applicationDetail?.salary_min ?? ""}
                                label="Lương tối thiểu (triệu đồng)"
                                name="salary_min"
                                disabled={true}
                            />
                            <Input
                                value={applicationDetail?.salary_max ?? ""}
                                label="Lương tối đa (triệu đồng)"
                                name="salary_max"
                                disabled={true}
                            />
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <label className="text-lg font-semibold">THÔNG TIN CÁ NHÂN</label>
                        <div className="grid grid-cols-1 bp5:grid-cols-2 bp8:grid-cols-1 bp9:grid-cols-2 bp13:grid-cols-4 gap-x-12 gap-y-4">
                            <Input
                                value={applicationDetail?.applicant_name ?? ""}
                                label="Họ và tên"
                                name="applicant_name"
                                disabled={true}
                            />
                            <Input
                                value={applicationDetail?.applicant_gender ?? ""}
                                label="Giới tính"
                                name="applicant_gender"
                                disabled={true}
                            />
                            <Input
                                type="date"
                                value={applicationDetail?.applicant_dob ?? ""}
                                label="Ngày sinh"
                                name="applicant_dob"
                                disabled={true}
                            />
                            <Input
                                value={applicationDetail?.applicant_id ?? ""}
                                label="CCCD/CMND"
                                name="applicant_id"
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <label className="text-lg font-semibold">THÔNG TIN LIÊN HỆ</label>
                        <div className="grid grid-cols-1 bp5:grid-cols-2 bp8:grid-cols-1 bp9:grid-cols-2 gap-x-12 gap-y-4">
                            <Input
                                value={applicationDetail?.applicant_email ?? ""}
                                label="Email"
                                name="applicant_email"
                                disabled={true}
                            />
                            <Input
                                value={applicationDetail?.applicant_phone ?? ""}
                                label="Số điện thoại"
                                name="applicant_phone"
                                disabled={true}
                            />
                            <Textarea
                                value={applicationDetail?.applicant_permanent_address ?? ""}
                                label="Địa chỉ thường trú"
                                name="applicant_permanent_address"
                                disabled={true}
                            />
                            <Textarea
                                value={applicationDetail?.applicant_contact_address ?? ""}
                                label="Địa chỉ liên hệ"
                                name="applicant_contact_address"
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <label className="text-lg font-semibold">HỌC VẤN</label>
                        <div className="grid grid-cols-1 bp5:grid-cols-2 bp8:grid-cols-1 bp9:grid-cols-2 gap-x-12 gap-y-4">
                            <Input
                                value={applicationDetail?.applicant_degree ?? ""}
                                label="Trình độ chuyên môn cao nhất"
                                name="applicant_degree"
                                disabled={true}
                            />
                            <Textarea
                                value={applicationDetail?.applicant_inst_name ?? ""}
                                label="Cơ sở đào tạo"
                                name="applicant_inst_name"
                                disabled={true}
                            />
                            <Input
                                value={applicationDetail?.applicant_major ?? ""}
                                label="Ngành, chuyên ngành"
                                name="applicant_major"
                                disabled={true}
                            />
                        </div>
                        <div className="grid grid-cols-1 bp5:grid-cols-2 bp13:grid-cols-4 gap-x-12 gap-y-4">
                            <Input
                                value={applicationDetail?.applicant_grad_year ?? ""}
                                label="Năm tốt nghiệp"
                                name="applicant_grad_year"
                                disabled={true}
                            />
                            <Input
                                value={applicationDetail?.applicant_grad_grade ?? ""}
                                label="Xếp loại"
                                name="applicant_grad_grade"
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <label className="text-lg font-semibold">TRÌNH ĐỘ NGOẠI NGỮ, TIN HỌC</label>
                        <div className="grid grid-cols-1 bp5:grid-cols-2 bp8:grid-cols-1 bp9:grid-cols-2 gap-x-12 gap-y-4">
                            <Input
                                value={applicationDetail?.applicant_lang_lvl ?? ""}
                                label="Ngoại ngữ"
                                name="applicant_lang_lvl"
                                disabled={true}
                            />
                            <Textarea
                                value={applicationDetail?.applicant_it_prof_lvl ?? ""}
                                label="Tin học"
                                name="applicant_it_prof_lvl"
                                disabled={true}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <label className="text-lg font-semibold">GHI CHÚ</label>
                        <div className="grid grid-cols-1 gap-y-4">
                            <Textarea
                                value={applicationDetail?.applicant_note ?? ""}
                                name="applicant_note"
                                disabled={true}
                            />
                        </div>
                    </div>
                </div>
                <div className="bp8:w-2xl flex flex-col gap-4">
                    <div className="flex flex-col border border-primary-border bg-white rounded-md overflow-hidden p-4 gap-4">
                        <label className="text-lg font-semibold">TRẠNG THÁI HỒ SƠ</label>
                        <div className="grid grid-cols-1 bp2:grid-cols-3 gap-x-12 gap-y-4">
                            <Input
                                value={formatDatetime(applicationDetail?.created_at ?? "")}
                                label="Thời gian nộp"
                                name="created_at"
                                disabled={true}
                            />
                            <Input
                                value={formatDatetime(applicationDetail?.updated_at ?? "")}
                                label="Cập nhật mới nhất"
                                name="updated_at"
                                disabled={true}
                            />
                            <Select
                                label="Trạng thái"
                                name="application_status"
                                options={statusOptions}
                                selected={selectedStatus}
                                onChange={(value) => {
                                    setSelectedStatus({
                                        label: value,
                                        value: value,
                                        color: statusOptions.find(
                                            (status) => status.value === value
                                        )?.color,
                                    });
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex flex-1 flex-col border border-primary-border bg-white rounded-md overflow-hidden p-4 gap-4">
                        <label className="text-lg font-semibold">CV</label>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReviewApplication;
