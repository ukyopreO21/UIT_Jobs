import { Fragment, useState, useEffect } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { formatDate, formatDatetime } from "@/utils/format-date";
import {
    Listbox,
    ListboxButton,
    ListboxOption,
    ListboxOptions,
    Transition,
} from "@headlessui/react";
import { HiMiniChevronUpDown } from "react-icons/hi2";
import useAdminApplicationStore from "@/stores/admin-application.store";

const DetailsView = ({
    toggleSideView,
    isSideViewShowing,
}: {
    toggleSideView: (value: boolean) => void;
    isSideViewShowing: boolean;
}) => {
    const applicationDetail = useAdminApplicationStore((state) => state.applicationDetail);

    const [selectedStatus, setSelectedStatus] = useState(Object || null);

    const statusOptions = [
        { label: "Đã ghi nhận", color: "text-sky-700" },
        { label: "Đang phỏng vấn", color: "text-yellow-700" },
        { label: "Được tuyển dụng", color: "text-green-700" },
        { label: "Bị từ chối", color: "text-red-700" },
    ];

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
            <div className="absolute z-20 flex flex-col bg-white border border-[#e7e7e8] bottom-4 top-16 right-4 w-160 rounded-lg overflow-hidden">
                <div className="flex justify-between p-4 pl-0 ml-4 border-b border-[#e7e7e8] shrink-0">
                    <div className="flex flex-col gap-1">
                        <span className="text-xl font-medium">#{applicationDetail?.id}</span>
                        <span className="text-[#535458]">Mã hồ sơ</span>
                    </div>
                    <button className="cursor-pointer" onClick={() => toggleSideView(false)}>
                        <AiOutlineClose
                            size={20}
                            className="transition duration-200 ease-in-out hover:text-[#4263eb]"
                        />
                    </button>
                </div>

                <div className="flex flex-col grow overflow-y-auto">
                    <div className="flex flex-col p-4 pl-0 ml-4 gap-3 border-b border-[#e7e7e8] shrink-0">
                        <span className="font-medium text-lg">CV</span>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Thời gian nộp</span>
                            <span className="flex-1">
                                {applicationDetail
                                    ? formatDatetime(applicationDetail.created_at)
                                    : ""}
                            </span>
                        </div>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Vị trí ứng tuyển</span>
                            <span className="flex-1">{applicationDetail?.position}</span>
                        </div>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Đơn vị</span>
                            <span className="flex-1">{applicationDetail?.faculty}</span>
                        </div>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Bộ môn</span>
                            <span className="flex-1">{applicationDetail?.discipline}</span>
                        </div>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Link CV</span>
                            <span className="flex-1">{applicationDetail?.applicant_cv}</span>
                        </div>
                    </div>

                    <div className="flex flex-col p-4 pl-0 ml-4 gap-3 border-b border-[#e7e7e8] shrink-0">
                        <span className="font-medium text-lg">Nguyện vọng 2</span>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Vị trí ứng tuyển</span>
                            <span className="flex-1">
                                {applicationDetail?.second_choice_position}
                            </span>
                        </div>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Đơn vị</span>
                            <span className="flex-1">
                                {applicationDetail?.second_choice_faculty}
                            </span>
                        </div>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Bộ môn</span>
                            <span className="flex-1">
                                {applicationDetail?.second_choice_discipline}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col p-4 pl-0 ml-4 gap-3 border-b border-[#e7e7e8] shrink-0">
                        <span className="font-medium text-lg">Hành động</span>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Cập nhật mới nhất</span>
                            <span className="flex-1">
                                {applicationDetail
                                    ? formatDatetime(applicationDetail.updated_at)
                                    : ""}
                            </span>
                        </div>
                        <div className="flex items-center">
                            <span className="flex-1 text-[#535458]">Cập nhật trạng thái hồ sơ</span>
                            <span className="flex-1">
                                <Listbox value={selectedStatus} onChange={setSelectedStatus}>
                                    <ListboxButton className="flex justify-between items-center p-2 w-46 text-left border border-[#e7e7e8] rounded-md cursor-pointer">
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
                                        <ListboxOptions className="z-10 mt-2 w-46 overflow-auto rounded-md bg-white text-base border border-[#e7e7e8] outline-none">
                                            {statusOptions.map((status, index) => (
                                                <ListboxOption
                                                    key={index}
                                                    value={status}
                                                    className="cursor-pointer p-2 data-focus:bg-gray-100">
                                                    <span className={`${status.color}`}>
                                                        {status.label}
                                                    </span>
                                                </ListboxOption>
                                            ))}
                                        </ListboxOptions>
                                    </Transition>
                                </Listbox>
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col p-4 pl-0 ml-4 gap-3 border-b border-[#e7e7e8] shrink-0">
                        <span className="font-medium text-lg">Thông tin cá nhân</span>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Họ và tên</span>
                            <span className="flex-1">{applicationDetail?.applicant_name}</span>
                        </div>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Giới tính</span>
                            <span className="flex-1">{applicationDetail?.applicant_gender}</span>
                        </div>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Ngày sinh</span>
                            <span className="flex-1">
                                {applicationDetail
                                    ? formatDate(applicationDetail.applicant_dob)
                                    : ""}
                            </span>
                        </div>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">CCCD/CMND</span>
                            <span className="flex-1">{applicationDetail?.applicant_id}</span>
                        </div>
                    </div>

                    <div className="flex flex-col p-4 pl-0 ml-4 gap-3 border-b border-[#e7e7e8] shrink-0">
                        <span className="font-medium text-lg">Thông tin liên lạc</span>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Email</span>
                            <span className="flex-1">{applicationDetail?.applicant_email}</span>
                        </div>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Số điện thoại</span>
                            <span className="flex-1">{applicationDetail?.applicant_phone}</span>
                        </div>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Địa chỉ thường trú</span>
                            <span className="flex-1">
                                {applicationDetail?.applicant_permanent_address}
                            </span>
                        </div>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Địa chỉ liên hệ</span>
                            <span className="flex-1">
                                {applicationDetail?.applicant_contact_address}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col p-4 pl-0 ml-4 gap-3 border-b border-[#e7e7e8] shrink-0">
                        <span className="font-medium text-lg">Học vấn</span>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">
                                Trình độ chuyên môn cao nhất
                            </span>
                            <span className="flex-1">{applicationDetail?.applicant_degree}</span>
                        </div>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Cơ sở đào tạo</span>
                            <span className="flex-1">{applicationDetail?.applicant_inst_name}</span>
                        </div>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Ngành, chuyên ngành</span>
                            <span className="flex-1">{applicationDetail?.applicant_major}</span>
                        </div>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Năm tốt nghiệp</span>
                            <span className="flex-1">{applicationDetail?.applicant_grad_year}</span>
                        </div>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Xếp loại</span>
                            <span className="flex-1">
                                {applicationDetail?.applicant_grad_grade}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col p-4 pl-0 ml-4 gap-3 border-b border-[#e7e7e8] shrink-0">
                        <span className="font-medium text-lg">Trình độ Ngoại ngữ, Tin học</span>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Ngoại ngữ</span>
                            <span className="flex-1">{applicationDetail?.applicant_lang_lvl}</span>
                        </div>
                        <div className="flex">
                            <span className="flex-1 text-[#535458]">Tin học</span>
                            <span className="flex-1">
                                {applicationDetail?.applicant_it_prof_lvl}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col p-4 pl-0 ml-4 gap-3 shrink-0">
                        <span className="font-medium text-lg">Ghi chú</span>
                        <span>{applicationDetail?.applicant_note || "Không có"}</span>
                    </div>
                </div>

                <div className="flex justify-between border-t border-[#e7e7e8] p-4 shrink-0">
                    <button
                        className="px-4 h-10 bg-red-200/75 text-red-700 rounded-lg transition duration-200 ease-in-out cursor-pointer"
                        onClick={() => {
                            toggleSideView(false);
                        }}>
                        Thoát
                    </button>
                    <button className="px-4 h-10 bg-[#dbe4ff] text-[#4263eb] rounded-lg transition duration-200 ease-in-out cursor-pointer">
                        Cập nhật hồ sơ
                    </button>
                </div>
            </div>
        </Transition>
    );
};

export default DetailsView;
