"use client";
import { useEffect } from "react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import ApplyForm from "./components/ApplyForm";
import LocationCard from "../components/LocationCard";
import RecruitingUnitCard from "../components/RecruitingUnitCard";
import usePublicJobStore from "@/stores/public-job.store";
import getListStyle from "@/utils/get-list-style";

const Apply = () => {
    const params = useParams();
    const jobDetail = usePublicJobStore((state) => state.jobDetail);
    const findById = usePublicJobStore((state) => state.findById);

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
                        { label: `${params?.id}`, href: `/jobs/${params?.id}` },
                        { label: "Nộp hồ sơ" },
                    ]}
                />
                <div className="flex flex-col mt-10 text-default gap-6">
                    <div className="flex-center flex-col gap-4 border border-primary-border rounded-lg p-4 bg-primary-bg">
                        <div className="text-base bp4:text-lg text-primary-text text-center">
                            Bạn đang nộp hồ sơ ứng tuyển cho vị trí&nbsp;
                            <span className="text-secondary-blue-dark-extra font-medium text-lg bp4:text-xl">
                                {jobDetail?.position_name.toUpperCase()}
                            </span>
                            &nbsp;của việc làm
                        </div>
                        <div className="text-lg bp4:text-xl font-medium uppercase text-secondary-blue-dark-extra text-center">
                            {jobDetail?.title}
                        </div>
                    </div>
                    <div className="flex gap-8 flex-col-reverse bp5:flex-row">
                        <div className="w-full h-fit border border-primary-border rounded-lg p-4">
                            <ApplyForm jobId={Number(params.id)} />
                        </div>

                        <div className="bp5:w-96 shrink-0 flex flex-col gap-6">
                            <LocationCard location={jobDetail?.location || ""} />
                            <RecruitingUnitCard
                                employer={jobDetail?.employer_name || ""}
                                department={jobDetail?.department_name || ""}
                                unit={jobDetail?.sub_department_name || ""}
                                getListStyle={(level) => getListStyle(level)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Apply;
