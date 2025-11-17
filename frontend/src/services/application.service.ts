import axios from "axios";
import axiosInstance from "@/libs/axios-instance";
import toast from "react-hot-toast";

class ApplicationService {
    static async findAll() {
        try {
            const response = await axiosInstance.get("/application/find-all");
            return response.data;
        } catch (error: unknown) {
            console.error("Get applications error:", error);
        }
    }

    static async findById(id: string) {
        try {
            const response = await axiosInstance.get(`/application/find-by-id/${id}`);
            return response.data;
        } catch (error: unknown) {
            console.error("Get application by ID error:", error);
        }
    }
}

export default ApplicationService;
