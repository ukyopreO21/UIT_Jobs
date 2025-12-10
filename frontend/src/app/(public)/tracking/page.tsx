"use client";
import { useState } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import usePublicApplicationStore from "@/stores/public-application.store";
import { formatDatetime } from "@/utils/format-date";

const Tracking = () => {
    const [appplicationId, setApplicationId] = useState("");
    const updated_at = usePublicApplicationStore((state) => state.updated_at);
    const status = usePublicApplicationStore((state) => state.status);
    const findById = usePublicApplicationStore((state) => state.findById);

    return (
        <div className="px-4">
            <div className="mx-auto max-w-7xl mt-4">
                <Breadcrumb
                    items={[{ label: "Trang chủ", href: "/" }, { label: "Tra cứu hồ sơ" }]}
                />
                <div className="flex-center text-default gap-12 mt-10">
                    <div className="flex flex-col gap-4 w-full max-w-200">
                        <div
                            className="flex items-center h-16 w-full
							input-container-default input-container-outline-default transition-default">
                            <input
                                onChange={(e) => setApplicationId(e.target.value)}
                                placeholder="Nhập mã hồ sơ ứng tuyển cần tra cứu..."
                                className="input-text-default text-default"
                                onKeyDown={(e) => {
                                    if (e.key == "Enter") {
                                        findById(appplicationId);
                                    }
                                }}
                            />
                            <button
                                onClick={() => findById(appplicationId)}
                                className="button-default shrink-0 rounded-md transition-default
								text-secondary-blue-dark hover:text-secondary-blue-dark-extra bg-secondary-blue-light hover:bg-secondary-blue-light-extra">
                                Tra cứu
                            </button>
                        </div>
                        {status !== "" && (
                            <div className="w-full bg-primary-bg rounded-md p-3">
                                <div className="flex flex-col gap-3">
                                    <div className="text-xl lg:text-2xl font-medium self-center">
                                        Mã hồ sơ: #{appplicationId}
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex gap-2 text-primary-text">
                                            <div>Cập nhật lần cuối:</div>
                                            <div>{formatDatetime(updated_at)}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div>Trạng thái:</div>
                                            <div className="p-2 bg-secondary-green-light text-secondary-green-dark rounded-md">
                                                {status}
                                            </div>
                                        </div>
                                        <div>
                                            Chúc mừng bạn đã vượt qua tất cả các vòng phỏng vấn và
                                            được tuyển dụng vào vị trí ứng tuyển.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tracking;
