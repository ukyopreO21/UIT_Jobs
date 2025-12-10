import { Fragment, useState, useEffect } from "react";
import ManageViewHeader from "../../components/ManageViewHeader";
import ManageViewFooter from "../../components/ManageViewFooter";
import { formatDatetime } from "@/utils/format-date";
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Transition,
} from "@headlessui/react";
import { HiMiniChevronUpDown } from "react-icons/hi2";
import useAdminApplicationStore from "@/stores/admin-application.store";

const fieldNamesMap: { [key: string]: string } = {
    applicant_id: "CCCD/CMND",
    applicant_name: "Họ và tên",
    applicant_dob: "Ngày sinh",
    applicant_gender: "Giới tính",
    applicant_email: "Email",
    applicant_phone: "Số điện thoại",
    applicant_permanent_address: "Địa chỉ thường trú",
    applicant_contact_address: "Địa chỉ liên hệ",
    second_choice_position: "Vị trí ứng tuyển",
    second_choice_faculty: "Đơn vị",
    second_choice_discipline: "Bộ môn",
    applicant_degree: "Trình độ chuyên môn cao nhất",
    applicant_inst_name: "Cơ sở đào tạo",
    applicant_major: "Ngành, chuyên ngành",
    applicant_grad_year: "Năm tốt nghiệp",
    applicant_grad_grade: "Xếp loại",
    applicant_lang_lvl: "Ngoại ngữ",
    applicant_it_prof_lvl: "Tin học",
    applicant_cv: "Link CV",
    applicant_note: "Ghi chú",
    status: "Cập nhật trạng thái hồ sơ",
    created_at: "Thời gian nộp",
    updated_at: "Cập nhật mới nhất",
    position: "Vị trí ứng tuyển",
    faculty: "Đơn vị",
    discipline: "Bộ môn",
};

const viewParts = [
    {
        label: "CV",
        fields: ["created_at", "position", "faculty", "discipline", "applicant_cv"],
    },
    {
        label: "Nguyện vọng 2",
        fields: ["second_choice_position", "second_choice_faculty", "second_choice_discipline"],
    },
    {
        label: "Hành động",
        fields: ["updated_at", "status"],
    },
    {
        label: "Thông tin cá nhân",
        fields: ["applicant_name", "applicant_gender", "applicant_dob", "applicant_id"],
    },
    {
        label: "Thông tin liên hệ",
        fields: [
            "applicant_email",
            "applicant_phone",
            "applicant_permanent_address",
            "applicant_contact_address",
        ],
    },
    {
        label: "Học vấn",
        fields: [
            "applicant_degree",
            "applicant_inst_name",
            "applicant_major",
            "applicant_grad_year",
            "applicant_grad_grade",
        ],
    },
    {
        label: "Trình độ Ngoại ngữ, Tin học",
        fields: ["applicant_lang_lvl", "applicant_it_prof_lvl"],
    },
    {
        label: "Ghi chú",
        fields: ["applicant_note"],
    },
];

const statusOptions = [
    { label: "Đã ghi nhận", color: "text-secondary-blue-dark" },
    { label: "Đang phỏng vấn", color: "text-secondary-yellow-dark" },
    { label: "Được tuyển dụng", color: "text-secondary-green-dark" },
    { label: "Bị từ chối", color: "text-secondary-red-dark" },
];

const DetailsView = ({
    toggleSideView,
    isSideViewShowing,
}: {
    toggleSideView: (value: boolean) => void;
    isSideViewShowing: boolean;
}) => {
    const applicationDetail = useAdminApplicationStore((state) => state.applicationDetail);
    const updateById = useAdminApplicationStore((state) => state.updateById);

    const [selectedStatus, setSelectedStatus] = useState(Object || null);

    useEffect(() => {
        setSelectedStatus({
            label: applicationDetail?.status,
            color: statusOptions.find((status) => status.label === applicationDetail?.status)
                ?.color,
        });
    }, [applicationDetail]);

    return (
        <Transition
            as={Fragment}
            show={isSideViewShowing}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-x-2 scale-95"
            enterTo="opacity-100 translate-x-0 scale-100"
            leave="transition ease-in duration-200"
            leaveFrom="opacity-100 translate-x-0 scale-100"
            leaveTo="opacity-0 translate-x-2 scale-95">
            <div className="admin-page-side-view-default text-default">
                <ManageViewHeader
                    title={`#${applicationDetail?.id}`}
                    subTitle="Mã hồ sơ"
                    toggleSideView={toggleSideView}
                />

                {/* đặt border-none cho cái part cuối */}
                <div className="flex flex-col grow overflow-y-auto">
                    {viewParts.map((part, index) => (
                        <div key={index} className="admin-page-side-view-part-default">
                            <span className="font-medium text-base lg:text-lg">{part.label}</span>
                            {part.fields.map((field) => (
                                <div key={field} className="flex gap-2">
                                    <span className="flex-1 text-primary-text">
                                        {fieldNamesMap[field] || field}
                                    </span>
                                    <span className="flex-1">
                                        {field === "applicant_dob" ||
                                        field === "created_at" ||
                                        field === "updated_at" ? (
                                            applicationDetail ? (
                                                formatDatetime(
                                                    applicationDetail[
                                                        field as keyof typeof applicationDetail
                                                    ]
                                                )
                                            ) : (
                                                ""
                                            )
                                        ) : field === "status" ? (
                                            applicationDetail ? (
                                                <Listbox
                                                    value={selectedStatus}
                                                    onChange={setSelectedStatus}>
                                                    <ListboxButton className="flex justify-between items-center p-2 w-35 sm:w-46 text-left border border-primary-border rounded-md cursor-pointer">
                                                        <span className={`${selectedStatus.color}`}>
                                                            {selectedStatus.label}
                                                        </span>
                                                        <HiMiniChevronUpDown size={20} />
                                                    </ListboxButton>

                                                    <Transition
                                                        as={Fragment}
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="opacity-0 scale-95"
                                                        enterTo="opacity-100 scale-100"
                                                        leave="transition ease-in duration-100"
                                                        leaveFrom="opacity-100 scale-100"
                                                        leaveTo="opacity-0 scale-95">
                                                        <ListboxOptions className="z-10 mt-2 w-35 sm:w-46 overflow-auto rounded-md bg-white text-base border border-primary-border outline-none">
                                                            {statusOptions.map((status, index) => (
                                                                <ListboxOption
                                                                    key={index}
                                                                    value={status}
                                                                    className="text-default p-2 data-focus:bg-gray-100">
                                                                    <span
                                                                        className={`${status.color}`}>
                                                                        {status.label}
                                                                    </span>
                                                                </ListboxOption>
                                                            ))}
                                                        </ListboxOptions>
                                                    </Transition>
                                                </Listbox>
                                            ) : null
                                        ) : applicationDetail ? (
                                            applicationDetail[
                                                field as keyof typeof applicationDetail
                                            ]
                                        ) : null}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <ManageViewFooter
                    toggleSideView={toggleSideView}
                    handleChange={() => updateById(selectedStatus.label)}
                    handleChangeTitle="Cập nhật hồ sơ"
                />
            </div>
        </Transition>
    );
};

export default DetailsView;
