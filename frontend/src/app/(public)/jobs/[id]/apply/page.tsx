"use client";

import { useState, useEffect, Fragment } from "react";
import { Transition } from "@headlessui/react";
import { useParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import Modal from "@/components/Modal";
import ApplyForm from "./components/ApplyForm";
import LocationCard from "../components/LocationCard";
import RecruitingUnitCard from "../components/RecruitingUnitCard";
import usePublicJobStore from "@/stores/public-job.store";
import getListStyle from "@/utils/get-list-style";

const Apply = () => {
    const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
    const params = useParams();
    const jobDetail = usePublicJobStore((state) => state.jobDetail);
    const findById = usePublicJobStore((state) => state.findById);

    useEffect(() => {
        if (params?.id) {
            findById(Number(params.id));
        }
    }, [findById, params.id]);

    const handleSubmitSuccess = () => {
        setIsSubmitSuccessful(true);
        document.body.style.overflow = "hidden";
    };

    const navigateToJobs = () => {
        window.location.href = "/jobs";
    };

    return (
        <div className="px-4 text-default">
            <div className="mx-auto max-w-360 mt-4">
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
                            <ApplyForm jobId={Number(params.id)} setSuccess={handleSubmitSuccess} />
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
            <Transition
                as={Fragment}
                show={isSubmitSuccessful}
                enter="transition-opacity duration-200"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0">
                <div className="fixed inset-0 bg-primary-backdrop"></div>
            </Transition>
            <Transition
                as={Modal}
                show={isSubmitSuccessful}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 -translate-y-2 scale-95"
                enterTo="opacity-100 translate-y-0 scale-100"
                leave="transition ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 scale-100"
                leaveTo="opacity-0 -translate-y-2 scale-95"
                title="Ứng tuyển thành công"
                content={`Cảm ơn vì bạn đã nộp đơn!\nMã hồ sơ đã được gửi vào email bạn đã đăng ký.\nVui lòng kiểm tra email để tra cứu trạng thái hồ sơ.`}
                onClick={navigateToJobs}
            />
        </div>
    );
};

export default Apply;
