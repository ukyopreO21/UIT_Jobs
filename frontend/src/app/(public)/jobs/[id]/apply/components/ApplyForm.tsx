import usePublicApplicationStore from "@/stores/public-application.store";
import { AiOutlineForm } from "react-icons/ai";
import { useState } from "react";
import Input from "./Input";
import Textarea from "./Textarea";

const sections = [
    {
        section: "Thông tin cá nhân",
        fields: [
            {
                label: "Họ và tên",
                name: "applicant_name",
                required: true,
            },
            {
                label: "CCCD/CMND",
                name: "applicant_id",
                required: true,
            },
            {
                label: "Ngày sinh",
                name: "applicant_dob",
                type: "date",
                required: true,
            },
            {
                label: "Giới tính",
                name: "applicant_gender",
                required: true,
            },
        ],
    },
    {
        section: "Thông tin liên hệ",
        fields: [
            {
                label: "Email",
                name: "applicant_email",
                required: true,
            },
            {
                label: "Số điện thoại",
                name: "applicant_phone",
                required: true,
            },
            {
                label: "Địa chỉ thường trú",
                name: "applicant_permanent_address",
                inputType: "textarea",
                required: true,
            },
            {
                label: "Địa chỉ liên hệ",
                name: "applicant_contact_address",
                inputType: "textarea",
                required: true,
            },
        ],
    },
    {
        section: "Học vấn",
        fields: [
            {
                label: "Trình độ chuyên môn cao nhất",
                name: "applicant_degree",
                required: true,
            },
            {
                label: "Cơ sở đào tạo",
                name: "applicant_inst_name",
                inputType: "textarea",
                required: true,
            },
            {
                label: "Ngành, chuyên ngành",
                name: "applicant_major",
                required: true,
            },
            {
                label: "Năm tốt nghiệp",
                name: "applicant_grad_year",
                required: true,
            },
            {
                label: "Xếp loại",
                name: "applicant_grad_grade",
                required: true,
            },
        ],
    },
    {
        section: "Trình độ Ngoại ngữ, Tin học",
        fields: [
            {
                label: "Ngoại ngữ",
                name: "applicant_lang_lvl",
                inputType: "textarea",
                required: true,
            },
            {
                label: "Tin học",
                name: "applicant_it_prof_lvl",
                inputType: "textarea",
                required: true,
            },
        ],
    },
    {
        section: "Nộp CV & Ghi chú",
        fields: [
            {
                label: "CV",
                type: "text",
                inputType: "textarea",
                name: "applicant_cv",
            },
            {
                label: "Ghi chú",
                inputType: "textarea",
                name: "applicant_note",
            },
        ],
    },
];

const ApplyForm = ({ jobId }: { jobId: Number }) => {
    const submitApplication = usePublicApplicationStore((state) => state.submitApplication);

    const [formData, setFormData] = useState<{ [key: string]: any }>({});

    const renderNode = (node: any, key: number, isLast?: boolean) => {
        if (node.fields) {
            return (
                <div
                    key={key}
                    className={`flex flex-col gap-2 ${!isLast && "border-b border-primary-border pb-8"}`}>
                    <label className="text-lg font-semibold text-primary-text">
                        {node.section.toUpperCase()}
                    </label>

                    <div
                        className={`grid grid-cols-1 ${!isLast && "md:grid-cols-2"} gap-x-12 gap-y-4`}>
                        {node.fields.map((child: any, idx: number) => renderNode(child, idx))}
                    </div>
                </div>
            );
        }

        if (node.inputType === "textarea") {
            return (
                <Textarea
                    key={key}
                    label={node.label}
                    name={node.name}
                    value={formData[node.name] ?? ""}
                    onChange={(e) => updateField(node.name, e.target.value)}
                />
            );
        }

        if (node.inputType === "select") {
        }

        return (
            <Input
                key={key}
                label={node.label}
                name={node.name}
                type={node.type ?? "text"}
                value={formData[node.name] ?? ""}
                onChange={(e) => {
                    if (node.type == "file") updateField(node.name, e.target.files?.[0] ?? null);
                    else updateField(node.name, e.target.value);
                }}
            />
        );
    };

    const updateField = (name: string, value: any) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        console.log("Updated Field: ", name, value);
    };

    const handleApply = () => {
        submitApplication(formData, jobId);
        console.log("Form Data Submitted: ", formData);
    };

    return (
        <div className="flex flex-col gap-8">
            {sections.map((section, index) =>
                renderNode(section, index, index === sections.length - 1)
            )}
            <button
                onClick={handleApply}
                className="w-fit button-default transition-default self-center h-fit shrink-0 rounded-lg transition-default font-medium
						px-6 lg:px-7 py-3 lg:py-4
						text-secondary-blue-dark bg-secondary-blue-light hover:text-secondary-blue-dark-extra hover:bg-secondary-blue-light-extra">
                <div className="flex-center gap-2">
                    <AiOutlineForm className="icon-default" />
                    <span>Nộp hồ sơ</span>
                </div>
            </button>
        </div>
    );
};

export default ApplyForm;
