import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { persist, createJSONStorage } from "zustand/middleware";
import UserService from "@/services/user.service";
import useLoadingStore from "./loading.store";
import User from "@/types/User";

const { showLoading, hideLoading } = useLoadingStore.getState();

interface UserState {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            user: null,

            login: async (username: string, password: string) => {
                try {
                    showLoading();
                    const result = await UserService.login(username, password);
                    toast.success("Đăng nhập thành công");
                    set({ user: result });
                } catch (error: unknown) {
                    if (axios.isAxiosError(error) && error.response) {
                        const errorMessage =
                            error.response.data?.message ||
                            "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.";
                        toast.error(errorMessage);
                    } else toast.error("Lỗi không xác định");
                } finally {
                    hideLoading();
                }
            },

            logout: async () => {
                try {
                    showLoading();
                    await UserService.logout();
                    toast.success("Đăng xuất thành công");
                    set({ user: null });
                } catch (error: unknown) {
                    if (axios.isAxiosError(error) && error.response) {
                        const errorMessage =
                            error.response.data?.message ||
                            "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.";
                        toast.error(errorMessage);
                    } else toast.error("Lỗi không xác định");
                } finally {
                    hideLoading();
                }
            },
        }),
        {
            name: "user-storage",
            storage: createJSONStorage(() => localStorage),
        }
    )
);

export default useUserStore;
