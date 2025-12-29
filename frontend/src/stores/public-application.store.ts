import { create } from "zustand";
import toast from "react-hot-toast";
import useLoadingStore from "./loading.store";
import ApplicationService from "@/services/application.service";
import handleError from "@/utils/handle-error";

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

    submitApplication: async (applicationData: any, jobId: Number) => {
        try {
            showLoading();
            const formData = new FormData();
            formData.append("job_id", jobId.toString());
            formData.append("status", "Đã ghi nhận");

            Object.keys(applicationData).forEach((key) => {
                const value = applicationData[key];

                if (value === null || value === undefined) return;
                if (value instanceof File) {
                    formData.append(key, value);
                } else {
                    formData.append(key, value.toString());
                }
            });

            await ApplicationService.create(formData);
        } catch (error: unknown) {
            handleError(error);
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
            handleError(error);
        } finally {
            hideLoading();
        }
    },
}));

export default usePublicApplicationStore;
