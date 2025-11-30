import { useState, useEffect, Fragment } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { formatDate } from "@/utils/format-date";
import { Transition } from "@headlessui/react";
import useAdminJobStore from "@/stores/admin-job.store";

interface JobUpdateForm {
    title: string | null;
    location: string;
    faculty: string | null;
    discipline: string | null;
    position: string | null;
    description: string | null;
    quantity: string | number | null;
    salary: string;
    degree: string | null;
    deadline: string | null;
}

const fieldNamesMap: { [key: string]: string } = {
    title: "Tiêu đề",
    location: "Địa điểm",
    faculty: "Đơn vị",
    discipline: "Bộ môn",
    position: "Vị trí",
    description: "Mô tả",
    quantity: "Số lượng",
    salary: "Mức lương",
    degree: "Bằng cấp",
    deadline: "Hạn nộp",
};

const DetailsView = ({
    toggleSideView,
    isSideViewShowing,
}: {
    toggleSideView: (value: boolean) => void;
    isSideViewShowing: boolean;
}) => {
    const jobDetail = useAdminJobStore((state) => state.jobDetail);
    const updateById = useAdminJobStore((state) => state.updateById);

    const [updateForm, setUpdateForm] = useState<JobUpdateForm>({
        title: null,
        location:
            "Trường Đại học Công nghệ Thông tin - Đại học Quốc gia TP.HCM, Khu phố 34, Phường Linh Xuân, Thành phố Hồ Chí Minh",
        faculty: null,
        discipline: null,
        position: null,
        description: null,
        quantity: null,
        salary: "Xem trong Thông báo tuyển dụng",
        degree: null,
        deadline: null,
    });

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUpdateForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (jobDetail) {
            setUpdateForm({
                title: jobDetail.title,
                location: jobDetail.location,
                faculty: jobDetail.faculty,
                discipline: jobDetail.discipline,
                position: jobDetail.position,
                description: jobDetail.description,
                quantity: jobDetail.quantity,
                salary: jobDetail.salary,
                degree: jobDetail.degree,
                deadline: formatDate(jobDetail.deadline, "YYYY-MM-DD"),
            });
        }
    }, [jobDetail, toggleSideView]);

    const formKeys = Object.keys(updateForm) as (keyof JobUpdateForm)[];

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
            <div className="absolute z-20 flex flex-col bg-white border border-[#e7e7e8] bottom-4 top-18 right-4 not-md:left-4 md:w-140 h-fit max-h-[calc(100dvh-9.5rem)] lg:max-h-[calc(100dvh-5.5rem)] rounded-lg overflow-hidden shadow-md text-responsive">
                <div className="flex justify-between p-4 pl-0 ml-4 border-b border-[#e7e7e8] shrink-0">
                    <div className="flex flex-col gap-1">
                        <span className="text-lg lg:text-xl font-medium">#{jobDetail?.id}</span>
                        <span className="text-[#535458]">Mã việc làm</span>
                    </div>
                    <button className="cursor-pointer" onClick={() => toggleSideView(false)}>
                        <AiOutlineClose
                            size={20}
                            className="transition duration-200 ease-in-out hover:text-[#4263eb]"
                        />
                    </button>
                </div>

                <div className="flex flex-col grow overflow-y-auto">
                    <div className="flex flex-col p-4 pl-0 ml-4 gap-3 shrink-0">
                        {formKeys.map((key) => {
                            const value = updateForm[key] ?? "";
                            const fieldName = fieldNamesMap[key] || key;

                            if (key === "description") {
                                return (
                                    <div key={key} className="flex items-center">
                                        <span className="flex-1 text-[#535458]">{fieldName}</span>
                                        <textarea
                                            name={key}
                                            className="flex-2 h-64 outline outline-[#e7e7e8] rounded-md p-2 focus-within:outline-2 focus-within:outline-[#4263eb] transition duration-200 ease-in-out resize-none"
                                            value={value}
                                            onChange={handleOnChange}
                                        />
                                    </div>
                                );
                            }

                            if (key === "deadline") {
                                return (
                                    <div key={key} className="flex items-center">
                                        <span className="flex-1 text-[#535458]">{fieldName}</span>
                                        <input
                                            name={key}
                                            type="date"
                                            className="flex-2 h-10 outline outline-[#e7e7e8] rounded-md px-2 focus-within:outline-2 focus-within:outline-[#4263eb] transition duration-200 ease-in-out"
                                            value={value}
                                            onChange={handleOnChange}
                                        />
                                    </div>
                                );
                            }

                            return (
                                <div key={key} className="flex items-center">
                                    <span className="flex-1 text-[#535458]">{fieldName}</span>
                                    <input
                                        name={key}
                                        type={key === "quantity" ? "number" : "text"}
                                        className="flex-2 h-10 outline outline-[#e7e7e8] rounded-md px-2 focus-within:outline-2 focus-within:outline-[#4263eb] transition duration-200 ease-in-out"
                                        value={value}
                                        onChange={handleOnChange}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-between items-center border-t border-[#e7e7e8] ml-4 pr-4 h-18 shrink-0">
                    <button
                        className="px-3 h-10 bg-red-200/75 text-red-700 rounded-lg transition duration-200 ease-in-out cursor-pointer"
                        onClick={() => {
                            toggleSideView(false);
                        }}>
                        Thoát
                    </button>
                    <button
                        className="px-3 h-10 bg-[#dbe4ff] text-[#4263eb] rounded-lg transition duration-200 ease-in-out cursor-pointer"
                        onClick={() => {
                            updateById(updateForm);
                        }}>
                        Cập nhật việc làm
                    </button>
                </div>
            </div>
        </Transition>
    );
};

export default DetailsView;
