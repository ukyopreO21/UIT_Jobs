import axios from "axios";
import axiosInstance from "@/libs/axios-instance";
import toast from "react-hot-toast";

class JobService {
    static async findById(id: number) {
        try {
            const response = await axiosInstance.post(`/job/find-by-id/${id}`);
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage =
                    error.response.data?.message ||
                    "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.";
                toast.error(errorMessage);
            } else toast.error("Lấy thông tin việc làm thất bại. Vui lòng thử lại sau.");
        }
    }

    static async findByFields(data: Object) {
        try {
            const response = await axiosInstance.get(`/job/find-by-fields`, {
                params: data,
            });
            return response.data;
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                const errorMessage =
                    error.response.data?.message ||
                    "Hệ thống đang gặp sự cố. Vui lòng thử lại sau.";
                toast.error(errorMessage);
            } else toast.error("Tìm kiếm việc làm thất bại. Vui lòng thử lại.");
        }
    }
}

export default JobService;
