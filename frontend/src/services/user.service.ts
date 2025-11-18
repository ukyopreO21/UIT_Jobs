import axios from "axios";
import axiosInstance from "@/libs/axios-instance";
import toast from "react-hot-toast";

class UserService {
    static async login(username: string, password: string) {
        try {
            const response = await axiosInstance.post("/user/login", { username, password });
            toast.success("Đăng nhập thành công");
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage =
                    error.response.data?.message ||
                    "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.";
                toast.error(errorMessage);
            } else toast.error("Lỗi không xác định");
        }
    }

    static async logout() {
        try {
            const response = await axiosInstance.post("/user/logout");
            toast.success("Đăng xuất thành công");
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage =
                    error.response.data?.message ||
                    "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.";
                toast.error(errorMessage);
            } else toast.error("Lỗi không xác định");
        }
    }
}

export default UserService;
