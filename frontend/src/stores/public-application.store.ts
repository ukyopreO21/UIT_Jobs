import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import useLoadingStore from "./loading.store";
import ApplicationService from "@/services/application.service";

const { showLoading, hideLoading } = useLoadingStore.getState();

interface PublicApplicationState {
    updated_at: string;
    status: string;
    submitApplication: (applicationData: Object, jobId: Number) => Promise<void>;
    findById: (id: string) => Promise<void>;
}

const usePublicApplicationStore = create<PublicApplicationState>((set, get) => ({
    updated_at: "",
    status: "",

    submitApplication: async (applicationData: Object, jobId: Number) => {
        try {
            showLoading();
            const submitData = { ...applicationData, status: "Đã ghi nhận", job_id: jobId };
            const response = await ApplicationService.create(submitData);
            toast.success("Nộp hồ sơ thành công!");
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage =
                    error.response.data?.message ||
                    "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.";
                toast.error(errorMessage);
            } else {
                toast.error("Nộp hồ sơ thất bại. Vui lòng thử lại.");
            }
        } finally {
            hideLoading();
        }
    },

    findById: async (id: string) => {
        try {
            showLoading();
            const result = await ApplicationService.findById(id);
            set({ status: result.status, updated_at: result.updated_at });
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage =
                    error.response.data?.message ||
                    "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.";
                toast.error(errorMessage);
            } else toast.error("Lấy thông tin hồ sơ thất bại. Vui lòng thử lại.");
        } finally {
            hideLoading();
        }
    },
}));

export default usePublicApplicationStore;
