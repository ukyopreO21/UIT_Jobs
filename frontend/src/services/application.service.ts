import axios from "axios";
import axiosInstance from "@/libs/axios-instance";
import toast from "react-hot-toast";

class ApplicationService {
    static async findById(id: string) {
        try {
            const response = await axiosInstance.get(`/application/find-by-id/${id}`);
            return response.data;
        } catch (error: unknown) {}
    }

    static async findByFields(data: Object) {
        try {
            const response = await axiosInstance.get(`/application/find-by-fields`, {
                params: data,
            });
            return response.data;
        } catch (error: unknown) {
            toast.error("Tìm kiếm hồ sơ thất bại. Vui lòng thử lại.");
        }
    }
}

export default ApplicationService;
