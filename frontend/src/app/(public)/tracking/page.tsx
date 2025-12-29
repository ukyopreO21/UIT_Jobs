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

    // Hàm bổ trợ để lấy class màu và nội dung dựa trên status
    const getStatusDetails = (status: string) => {
        switch (status) {
            case "Đã ghi nhận":
                return {
                    colorClass: "bg-secondary-blue-light text-secondary-blue-dark",
                    message:
                        "Hồ sơ của bạn đã được hệ thống ghi nhận thành công. Vui lòng chờ bộ phận nhân sự xem xét.",
                };
            case "Đang phỏng vấn":
                return {
                    colorClass: "bg-secondary-yellow-light text-secondary-yellow-dark",
                    message:
                        "Hồ sơ của bạn đang trong quá trình phỏng vấn. Chúng tôi sẽ cập nhật kết quả sớm nhất.",
                };
            case "Được tuyển dụng":
                return {
                    colorClass: "bg-secondary-green-light text-secondary-green-dark",
                    message:
                        "Chúc mừng bạn đã vượt qua tất cả các vòng phỏng vấn và chính thức được tuyển dụng vào vị trí này!",
                };
            case "Bị từ chối":
                return {
                    colorClass: "bg-secondary-red-light text-secondary-red-dark",
                    message:
                        "Rất tiếc, hồ sơ của bạn chưa phù hợp với tiêu chí của vị trí này. Hy vọng sẽ có cơ hội hợp tác với bạn trong tương lai.",
                };
            default:
                return {
                    colorClass: "bg-gray-100 text-gray-600",
                    message: "Trạng thái hồ sơ không xác định.",
                };
        }
    };

    const { colorClass, message } = getStatusDetails(status);

    return (
        <div className="px-4">
            <div className="mx-auto max-w-360 mt-4">
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
                                    <div className="text-xl bp4:text-2xl font-medium self-center">
                                        Mã hồ sơ: #{appplicationId}
                                    </div>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex gap-2 text-primary-text">
                                            <div>Cập nhật lần cuối:</div>
                                            <div>{formatDatetime(updated_at)}</div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div>Trạng thái:</div>
                                            {/* Áp dụng màu động ở đây */}
                                            <div
                                                className={`p-2 rounded-md font-medium ${colorClass}`}>
                                                {status}
                                            </div>
                                        </div>
                                        <div className="leading-relaxed">
                                            {/* Hiển thị message tương ứng */}
                                            {message}
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
