"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import useAdminJobStore from "@/stores/admin-job.store";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Select from "@/components/Select";
import { JobUpdate } from "@/types/Job";
import { formatMixedJsonToText, parseTextToMixedJson } from "@/utils/json-text-helper";

const JobView = () => {
    const params = useParams();

    const [updateForm, setUpdateForm] = useState<JobUpdate>({
        title: "",
        type: "",
        location: "",
        position_id: "",
        sub_department_id: "",
        quantity: 0,
        degree: "",
        deadline: "",
        descriptions: [],
        requirements: [],
        benefits: [],
        salary_min: null,
        salary_max: null,
        salary_type: "",
    });

    const [textState, setTextState] = useState({
        descriptions: "",
        requirements: "",
        benefits: "",
    });

    const [departmentId, setDepartmentId] = useState<string | number>("");

    const jobDetail = useAdminJobStore((state) => state.jobDetail);
    const positions = useAdminJobStore((state) => state.positions);
    const departments = useAdminJobStore((state) => state.departments);
    const subDepartments = useAdminJobStore((state) => state.subDepartments);
    const findById = useAdminJobStore((state) => state.findById);
    const findByFields = useAdminJobStore((state) => state.findByFields);
    const updateById = useAdminJobStore((state) => state.updateById);

    const handleOnChange = (
        eOrName: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
        value?: string | number | boolean | null
    ) => {
        if (typeof eOrName !== "string") {
            const { name, value } = eOrName.target;
            setUpdateForm((prev) => ({
                ...prev,
                [name]: value,
            }));
            return;
        }
        setUpdateForm((prev) => ({
            ...prev,
            [eOrName]: value,
        }));
    };

    const handleDepartmentChange = (value: string | number) => {
        setDepartmentId(value);
        handleOnChange("sub_department_id", "");
    };

    const handleMixedJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTextState((prev) => ({ ...prev, [name]: value }));
        const parsedArray = parseTextToMixedJson(value);
        setUpdateForm((prev) => ({
            ...prev,
            [name]: parsedArray,
        }));
    };

    const handleSubmit = () => {
        updateById(updateForm);
    };

    useEffect(() => {
        setUpdateForm({
            title: jobDetail?.title || "",
            type: jobDetail?.type || "",
            location: jobDetail?.location || "",
            position_id: jobDetail?.position_id || "",
            sub_department_id: jobDetail?.sub_department_id || "",
            quantity: Number(jobDetail?.quantity || 0),
            degree: jobDetail?.degree || "",
            deadline: jobDetail?.deadline || "",
            descriptions: jobDetail?.descriptions || [],
            requirements: jobDetail?.requirements || [],
            benefits: jobDetail?.benefits || [],
            salary_min: jobDetail?.salary_min || null,
            salary_max: jobDetail?.salary_max || null,
            salary_type: jobDetail?.salary_type || "",
        });

        setDepartmentId(
            jobDetail?.sub_department_id
                ? subDepartments.find(
                      (sd) => sd.id.toString() === jobDetail?.sub_department_id.toString()
                  )?.department_id || ""
                : ""
        );

        setTextState({
            descriptions: formatMixedJsonToText(jobDetail?.descriptions),
            requirements: formatMixedJsonToText(jobDetail?.requirements),
            benefits: formatMixedJsonToText(jobDetail?.benefits),
        });
    }, [jobDetail]);

    useEffect(() => {
        if (positions.length === 0) {
            findByFields();
        }
        findById(Number(params?.id));
    }, []);

    return (
        <div className="admin-page-layout-default">
            <div className="admin-page-first-container-default">
                <Breadcrumb
                    items={[
                        { label: "Việc làm", href: "/admin/manage/jobs" },
                        { label: "Thông tin chi tiết" },
                    ]}
                />

                <button
                    className="flex items-center gap-3 rounded-md button-default transition-default
					bg-[#0080ff] hover:bg-blue-600 text-white"
                    onClick={handleSubmit}>
                    <span className="text-default">Cập nhật việc làm</span>
                </button>
            </div>

            <div className="flex-1 flex flex-col min-h-0 h-full border border-primary-border bg-white rounded-md overflow-hidden p-4 gap-6 overflow-y-auto">
                <label className="text-xl bp4:text-2xl font-semibold">
                    MÃ VIỆC LÀM: #{params?.id}
                </label>
                <div className="flex flex-col gap-4">
                    <label className="text-lg font-semibold">THÔNG TIN CƠ BẢN</label>
                    <div className="grid grid-cols-1">
                        <Textarea
                            label="Tiêu đề"
                            placeholder="Nhập tiêu đề công việc..."
                            onChange={handleOnChange}
                            name="title"
                            value={updateForm.title}
                        />
                    </div>
                    <div className="grid grid-cols-1 bp2:grid-cols-2 bp6:grid-cols-4 gap-x-12 gap-y-4">
                        <Select
                            label="Loại hình công việc"
                            onChange={(value) => handleOnChange("type", value)}
                            name="type"
                            selected={{
                                label:
                                    updateForm.type === "part-time"
                                        ? "Bán thời gian"
                                        : updateForm.type === "full-time"
                                          ? "Toàn thời gian"
                                          : updateForm.type === "internship"
                                            ? "Thực tập"
                                            : "Chọn loại hình công việc",
                                value: updateForm.type,
                            }}
                            options={[
                                { value: "full-time", label: "Toàn thời gian" },
                                { value: "part-time", label: "Bán thời gian" },
                                { value: "internship", label: "Thực tập" },
                            ]}
                        />
                        <Select
                            label="Vị trí tuyển dụng"
                            onChange={(value) => handleOnChange("position_id", value)}
                            name="position_id"
                            selected={{
                                label:
                                    positions.find(
                                        (pos) =>
                                            pos.id.toString() === updateForm.position_id.toString()
                                    )?.name || "Chọn vị trí",
                                value: updateForm.position_id.toString(),
                            }}
                            options={positions.map((pos) => ({
                                value: pos.id,
                                label: pos.name,
                            }))}
                        />
                        <Input
                            label="Bằng cấp"
                            placeholder="Nhập bằng cấp..."
                            onChange={handleOnChange}
                            name="degree"
                            value={updateForm.degree}
                        />
                    </div>
                    <div className="grid grid-cols-1 bp2:grid-cols-2 bp6:grid-cols-4 gap-x-12 gap-y-4">
                        <Input
                            label="Số lượng tuyển"
                            placeholder="Nhập số lượng..."
                            onChange={handleOnChange}
                            name="quantity"
                            type="number"
                            value={Number(updateForm.quantity)}
                        />
                        <Input
                            label="Hạn chót"
                            placeholder="Nhập hạn chót..."
                            onChange={handleOnChange}
                            name="deadline"
                            type="date"
                            value={updateForm.deadline}
                        />
                    </div>
                    <div className="grid grid-cols-1">
                        <div className="grid grid-cols-1">
                            <Textarea
                                label="Địa chỉ làm việc"
                                placeholder="Nhập địa chỉ làm việc..."
                                onChange={handleOnChange}
                                name="location"
                                value={updateForm.location || ""}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <label className="text-lg font-semibold">ĐƠN VỊ TUYỂN DỤNG</label>
                    <div className="grid grid-cols-1 bp2:grid-cols-2 bp6:grid-cols-4 gap-x-12 gap-y-4">
                        <Select
                            label="Phòng/ban"
                            onChange={handleDepartmentChange}
                            name="department"
                            selected={{
                                label:
                                    departments.find(
                                        (dep) => dep.id.toString() === departmentId.toString()
                                    )?.name || "Chọn phòng/ban",
                                value: departmentId.toString(),
                            }}
                            options={departments.map((dep) => ({
                                value: dep.id,
                                label: dep.name,
                            }))}
                        />
                        <Select
                            label="Tiểu phòng/ban"
                            onChange={(value) => handleOnChange("sub_department_id", value)}
                            name="sub_department_id"
                            selected={{
                                label:
                                    subDepartments.find(
                                        (sd) =>
                                            sd.id.toString() ===
                                            updateForm.sub_department_id.toString()
                                    )?.name || "Chọn tiểu phòng/ban",
                                value: updateForm.sub_department_id.toString(),
                            }}
                            options={subDepartments
                                .filter(
                                    (sd) => departmentId.toString() === sd.department_id.toString()
                                )
                                .map((sd) => ({
                                    value: sd.id,
                                    label: sd.name,
                                }))}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <label className="text-lg font-semibold">MỨC LƯƠNG</label>
                    <div className="grid grid-cols-1 bp2:grid-cols-2 bp6:grid-cols-4 gap-x-12 gap-y-4">
                        <Select
                            label="Kiểu lương"
                            onChange={(value) => handleOnChange("salary_type", value)}
                            name="salary_type"
                            selected={{
                                label:
                                    updateForm.salary_type == "range"
                                        ? "Khoảng tuỳ chọn"
                                        : updateForm.salary_type == "negotiable"
                                          ? "Thoả thuận"
                                          : "Chọn kiểu lương",
                                value: updateForm.salary_type,
                            }}
                            options={[
                                { value: "range", label: "Khoảng tuỳ chọn" },
                                { value: "negotiable", label: "Thoả thuận" },
                            ]}
                        />
                        <Input
                            label="Lương tối thiểu (triệu đồng)"
                            placeholder="Nhập lương tối thiểu..."
                            onChange={handleOnChange}
                            name="salary_min"
                            value={updateForm.salary_min ?? ""}
                            disabled={updateForm.salary_type === "negotiable"}
                        />
                        <Input
                            label="Lương tối đa (triệu đồng)"
                            placeholder="Nhập lương tối đa..."
                            onChange={handleOnChange}
                            name="salary_max"
                            value={updateForm.salary_max ?? ""}
                            disabled={updateForm.salary_type === "negotiable"}
                        />
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <label className="text-lg font-semibold">NỘI DUNG CHI TIẾT</label>
                    <div className="grid grid-cols-1">
                        <Textarea
                            label="Mô tả công việc"
                            placeholder="Nhập mô tả công việc..."
                            onChange={handleMixedJsonChange}
                            name="descriptions"
                            value={textState.descriptions}
                        />
                    </div>
                    <div className="grid grid-cols-1">
                        <Textarea
                            label="Yêu cầu"
                            placeholder="Nhập yêu cầu công việc..."
                            onChange={handleMixedJsonChange}
                            name="requirements"
                            value={textState.requirements}
                        />
                    </div>
                    <div className="grid grid-cols-1">
                        <Textarea
                            label="Quyền lợi"
                            placeholder="Nhập quyền lợi công việc..."
                            onChange={handleMixedJsonChange}
                            name="benefits"
                            value={textState.benefits}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobView;
