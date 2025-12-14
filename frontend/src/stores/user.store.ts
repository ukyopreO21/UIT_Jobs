import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { persist, createJSONStorage } from "zustand/middleware";
import UserService from "@/services/user.service";
import useLoadingStore from "./loading.store";
import User from "@/types/User";
import handleError from "@/utils/handle-error";

const { showLoading, hideLoading } = useLoadingStore.getState();

interface UserState {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateInfo: (data: Object) => Promise<void>;
    changePassword: (
        currentPassword: string,
        newPassword: string,
        confirmNewPassword: string
    ) => Promise<void>;
}

export const useUserStore = create<UserState>()(
    persist(
        (set, get) => ({
            user: null,

            login: async (username: string, password: string) => {
                try {
                    showLoading();
                    const result = await UserService.login(username, password);
                    toast.success("Đăng nhập thành công");
                    set({ user: result });
                } catch (error: unknown) {
                    handleError(error);
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
                    handleError(error);
                } finally {
                    hideLoading();
                }
            },

            updateInfo: async (data) => {
                try {
                    showLoading();
                    await UserService.updateInfo({ ...data, username: get().user?.username });
                    toast.success("Cập nhật thông tin thành công");
                    set((state) => ({
                        user: { ...state.user, ...data } as User,
                    }));
                } catch (error: unknown) {
                    handleError(error);
                } finally {
                    hideLoading();
                }
            },

            changePassword: async (
                currentPassword: string,
                newPassword: string,
                confirmNewPassword: string
            ) => {
                try {
                    const username = get().user?.username;
                    if (!currentPassword || !newPassword || !confirmNewPassword) {
                        toast.error("Vui lòng điền đầy đủ thông tin");
                        return;
                    }
                    if (newPassword !== confirmNewPassword) {
                        toast.error("Mật khẩu mới và xác nhận mật khẩu mới không khớp");
                        return;
                    }
                    showLoading();
                    if (username) {
                        await UserService.changePassword(username, currentPassword, newPassword);
                        toast.success("Đổi mật khẩu thành công");
                    } else toast.error("Người dùng không hợp lệ");
                } catch (error: unknown) {
                    handleError(error);
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
