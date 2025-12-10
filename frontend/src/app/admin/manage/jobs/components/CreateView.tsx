import { useState, useEffect, Fragment } from "react";
import ManageViewHeader from "../../components/ManageViewHeader";
import ManageViewFooter from "../../components/ManageViewFooter";
import { formatDate } from "@/utils/format-date";
import { Transition } from "@headlessui/react";
import useAdminJobStore from "@/stores/admin-job.store";

interface JobCreateForm {
    title: string | null;
    location: string;
    faculty: string | null;
    discipline: string | null;
    position: string | null;
    descriptions: string | null;
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
    descriptions: "Mô tả",
    quantity: "Số lượng",
    salary: "Mức lương",
    degree: "Bằng cấp",
    deadline: "Hạn nộp",
};

const CreateView = ({
    toggleSideView,
    isSideViewShowing,
}: {
    toggleSideView: (value: boolean) => void;
    isSideViewShowing: boolean;
}) => {
    const jobDetail = useAdminJobStore((state) => state.jobDetail);
    const create = useAdminJobStore((state) => state.create);

    const [createForm, setCreateForm] = useState<JobCreateForm>({
        title: null,
        location:
            "Trường Đại học Công nghệ Thông tin - Đại học Quốc gia TP.HCM, Khu phố 34, Phường Linh Xuân, Thành phố Hồ Chí Minh",
        faculty: null,
        discipline: null,
        position: null,
        descriptions: null,
        quantity: null,
        salary: "Xem trong Thông báo tuyển dụng",
        degree: null,
        deadline: null,
    });

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setCreateForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (jobDetail) {
            setCreateForm({
                title: jobDetail.title,
                location: jobDetail.location,
                faculty: jobDetail.faculty,
                discipline: jobDetail.discipline,
                position: jobDetail.position,
                descriptions: jobDetail.descriptions,
                quantity: jobDetail.quantity,
                salary: jobDetail.salary,
                degree: jobDetail.degree,
                deadline: formatDate(jobDetail.deadline, "YYYY-MM-DD"),
            });
        }
    }, [jobDetail, toggleSideView]);

    const formKeys = Object.keys(createForm) as (keyof JobCreateForm)[];

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
                    title="Việc làm"
                    subTitle="Thêm mới"
                    toggleSideView={toggleSideView}
                />

                <div className="flex flex-col grow overflow-y-auto">
                    <div className="flex flex-col p-4 pl-0 ml-4 gap-3 shrink-0">
                        {formKeys.map((key) => {
                            const value = createForm[key] ?? "";
                            const fieldName = fieldNamesMap[key] || key;

                            if (key === "descriptions") {
                                return (
                                    <div key={key} className="flex">
                                        <span className="admin-page-side-view-row-title-default">
                                            {fieldName}
                                        </span>
                                        <textarea
                                            name={key}
                                            className="flex-2 input-container-outline-default h-64 rounded-md px-3 py-2 transition-default resize-none"
                                            value={value}
                                            onChange={handleOnChange}
                                        />
                                    </div>
                                );
                            }

                            if (key === "deadline") {
                                return (
                                    <div key={key} className="flex items-center">
                                        <span className="admin-page-side-view-row-title-default">
                                            {fieldName}
                                        </span>
                                        <input
                                            name={key}
                                            type="date"
                                            className="flex-2 input-container-default input-container-outline-default transition-default no-calendar-icon"
                                            value={value}
                                            onChange={handleOnChange}
                                        />
                                    </div>
                                );
                            }

                            return (
                                <div key={key} className="flex items-center">
                                    <span className="admin-page-side-view-row-title-default">
                                        {fieldName}
                                    </span>
                                    <input
                                        name={key}
                                        type={key === "quantity" ? "number" : "text"}
                                        className="flex-2 input-container-default input-container-outline-default transition-default"
                                        value={value}
                                        onChange={handleOnChange}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <ManageViewFooter
                    toggleSideView={toggleSideView}
                    handleChange={() => {
                        create(createForm);
                    }}
                    handleChangeTitle="Thêm việc làm"
                />
            </div>
        </Transition>
    );
};

export default CreateView;
