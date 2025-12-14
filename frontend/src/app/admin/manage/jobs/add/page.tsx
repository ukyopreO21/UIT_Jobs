"use client";
import { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import useAdminJobStore from "@/stores/admin-job.store";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Select from "@/components/Select";
import { JobCreate } from "@/types/Job";
import { parseTextToMixedJson } from "@/utils/json-text-helper";

const JobAdd = () => {
    const [createForm, setCreateForm] = useState<JobCreate>({
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

    const positions = useAdminJobStore((state) => state.positions);
    const departments = useAdminJobStore((state) => state.departments);
    const subDepartments = useAdminJobStore((state) => state.subDepartments);
    const findByFields = useAdminJobStore((state) => state.findByFields);
    const create = useAdminJobStore((state) => state.create);

    const handleOnChange = (
        eOrName: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | string,
        value?: string | number | boolean | null
    ) => {
        if (typeof eOrName !== "string") {
            const { name, value } = eOrName.target;
            setCreateForm((prev) => ({
                ...prev,
                [name]: value,
            }));
            return;
        }
        setCreateForm((prev) => ({
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
        setCreateForm((prev) => ({
            ...prev,
            [name]: parsedArray,
        }));
    };

    const handleSubmit = () => {
        create(createForm);
    };

    useEffect(() => {
        if (positions.length === 0) {
            findByFields();
        }
    }, []);

    return (
        <div className="admin-page-layout-default">
            <div className="admin-page-first-container-default">
                <Breadcrumb
                    items={[
                        { label: "Việc làm", href: "/admin/manage/jobs" },
                        { label: "Thêm mới" },
                    ]}
                />

                <button
                    className="flex items-center gap-3 rounded-md button-default transition-default
					bg-[#0080ff] hover:bg-blue-600 text-white"
                    onClick={handleSubmit}>
                    <span className="text-default">Xác nhận thêm mới</span>
                </button>
            </div>

            <div className="flex-1 flex flex-col min-h-0 h-full border border-primary-border bg-white rounded-md overflow-hidden p-4 gap-6 overflow-y-auto">
                <div className="flex flex-col gap-4">
                    <label className="text-lg font-semibold">THÔNG TIN CƠ BẢN</label>
                    <div className="grid grid-cols-1">
                        <Textarea
                            label="Tiêu đề"
                            placeholder="Nhập tiêu đề công việc..."
                            onChange={handleOnChange}
                            name="title"
                            value={createForm.title}
                        />
                    </div>
                    <div className="grid grid-cols-1 bp2:grid-cols-2 bp6:grid-cols-4 gap-x-12 gap-y-4">
                        <Select
                            label="Loại hình công việc"
                            onChange={(value) => handleOnChange("type", value)}
                            name="type"
                            selected={{
                                label:
                                    createForm.type === "part-time"
                                        ? "Bán thời gian"
                                        : createForm.type === "full-time"
                                          ? "Toàn thời gian"
                                          : createForm.type === "internship"
                                            ? "Thực tập"
                                            : "Chọn loại hình công việc",
                                value: createForm.type,
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
                                            pos.id.toString() === createForm.position_id.toString()
                                    )?.name || "Chọn vị trí",
                                value: createForm.position_id.toString(),
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
                            value={createForm.degree}
                        />
                    </div>
                    <div className="grid grid-cols-1 bp2:grid-cols-2 bp6:grid-cols-4 gap-x-12 gap-y-4">
                        <Input
                            label="Số lượng tuyển"
                            placeholder="Nhập số lượng..."
                            onChange={handleOnChange}
                            name="quantity"
                            type="number"
                            value={Number(createForm.quantity)}
                        />
                        <Input
                            label="Hạn chót"
                            placeholder="Nhập hạn chót..."
                            onChange={handleOnChange}
                            name="deadline"
                            type="date"
                            value={createForm.deadline}
                        />
                    </div>
                    <div className="grid grid-cols-1">
                        <div className="grid grid-cols-1">
                            <Textarea
                                label="Địa chỉ làm việc"
                                placeholder="Nhập địa chỉ làm việc..."
                                onChange={handleOnChange}
                                name="location"
                                value={createForm.location || ""}
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
                                            createForm.sub_department_id.toString()
                                    )?.name || "Chọn tiểu phòng/ban",
                                value: createForm.sub_department_id.toString(),
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
                                    createForm.salary_type == "range"
                                        ? "Khoảng tuỳ chọn"
                                        : createForm.salary_type == "negotiable"
                                          ? "Thoả thuận"
                                          : "Chọn kiểu lương",
                                value: createForm.salary_type,
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
                            value={createForm.salary_min ?? ""}
                            disabled={createForm.salary_type === "negotiable"}
                        />
                        <Input
                            label="Lương tối đa (triệu đồng)"
                            placeholder="Nhập lương tối đa..."
                            onChange={handleOnChange}
                            name="salary_max"
                            value={createForm.salary_max ?? ""}
                            disabled={createForm.salary_type === "negotiable"}
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

export default JobAdd;
