"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import {
    AiOutlineUser,
    AiOutlineSolution,
    AiOutlineClockCircle,
    AiOutlineFieldNumber,
    AiOutlineDollarCircle,
    AiOutlineBulb,
} from "react-icons/ai";
import NavigateApplyButton from "./components/NavigateApplyButton";
import Breadcrumb from "@/components/Breadcrumb";
import LocationCard from "./components/LocationCard";
import RecruitingUnitCard from "./components/RecruitingUnitCard";
import usePublicJobStore from "@/stores/public-job.store";
import { formatDate } from "@/utils/format-date";
import getListStyle from "@/utils/get-list-style";

const JobDetail = () => {
    const jobDetail = usePublicJobStore((state) => state.jobDetail);
    const findById = usePublicJobStore((state) => state.findById);

    const params = useParams();

    const gridItems = [
        {
            label: "Vị trí",
            icon: <AiOutlineUser className="icon-default" />,
            value: jobDetail?.position,
        },
        {
            label: "Bằng cấp",
            icon: <AiOutlineSolution className="icon-default" />,
            value: jobDetail?.degree,
        },
        {
            label: "Số lượng",
            icon: <AiOutlineFieldNumber className="icon-default" />,
            value: jobDetail?.quantity,
        },
        {
            label: "Hình thức",
            icon: <AiOutlineBulb className="icon-default" />,
            value: "Bán thời gian",
        },
        {
            label: "Mức lương",
            icon: <AiOutlineDollarCircle className="icon-default" />,
            value: jobDetail?.salary,
        },
        {
            label: "Hạn chót",
            icon: <AiOutlineClockCircle className="icon-default" />,
            value: formatDate(jobDetail?.deadline || ""),
        },
    ];

    const mainItems = [
        {
            label: "MÔ TẢ CÔNG VIỆC",
            values: jobDetail?.descriptions,
        },
        {
            label: "YÊU CẦU",
            values: jobDetail?.requirements,
        },
        {
            label: "QUYỀN LỢI",
            values: jobDetail?.benefits,
        },
        {
            label: "THÔNG TIN THAM KHẢO",
            values: null,
        },
    ];

    const renderUnorderedList = (item: any, index: number, level: number = 0) => {
        if (Array.isArray(item)) {
            return (
                <ul key={index} className={`${getListStyle(level)} pl-8 space-y-2`}>
                    {item.map((subItem, subIndex) =>
                        renderUnorderedList(subItem, subIndex, level + 1)
                    )}
                </ul>
            );
        }

        return (
            item && (
                <li className="text-justify" key={index}>
                    {item}
                </li>
            )
        );
    };

    useEffect(() => {
        if (params?.id) {
            findById(Number(params.id));
        }
    }, [findById, params.id]);

    return (
        <div className="px-4 text-default">
            <div className="mx-auto max-w-7xl mt-4">
                <Breadcrumb
                    items={[
                        { label: "Trang chủ", href: "/" },
                        { label: "Việc làm", href: "/jobs" },
                        { label: `${params?.id}` },
                    ]}
                />
                <div className="flex flex-col mt-10">
                    <div className="flex flex-col xl:flex-row gap-4 xl:gap-8 pb-6 mb-6 border-b border-primary-border">
                        <div className="text-xl lg:text-2xl font-bold uppercase">
                            {jobDetail?.title}
                        </div>
                        <div className="xl:w-96 shrink-0 flex xl:justify-end">
                            <NavigateApplyButton />
                        </div>
                    </div>
                    <div className="flex gap-8 flex-col-reverse lg:flex-row">
                        <div className="flex-1 flex flex-col gap-6 p-4 border border-primary-border rounded-lg">
                            <div className="flex flex-col gap-3">
                                <label className="text-lg lg:text-xl font-medium text-black">
                                    THÔNG TIN TUYỂN DỤNG
                                </label>
                                <div className="grid gap-2 grid-cols-1 lg:grid-cols-2 border border-primary-border rounded-md p-4 bg-primary-bg">
                                    {gridItems.map((item, index) => (
                                        <div key={index} className="flex text-primary-text gap-4">
                                            <div className="flex items-center gap-2 flex-2 text-black">
                                                {item.icon}
                                                <span>{item.label}</span>
                                            </div>
                                            <span className="flex-3">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex flex-col gap-6 text-primary-text">
                                {mainItems.map((item, index) => (
                                    <div key={index} className="flex flex-col gap-1">
                                        <label className="text-lg lg:text-xl font-medium text-black">
                                            {item.label}
                                        </label>
                                        {renderUnorderedList(item.values, index)}
                                    </div>
                                ))}
                            </div>
                            <NavigateApplyButton />
                        </div>

                        <div className="lg:w-96 shrink-0 flex flex-col gap-6">
                            <LocationCard location={jobDetail?.location || ""} />
                            <RecruitingUnitCard
                                company={jobDetail?.location || ""}
                                department={jobDetail?.faculty || ""}
                                unit={jobDetail?.discipline || ""}
                                getListStyle={(level) => getListStyle(level)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetail;
