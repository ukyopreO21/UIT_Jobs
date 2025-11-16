import axios from "axios";
import axiosInstance from "@/libs/axios-instance";
import toast from "react-hot-toast";

class ApplicationService {
    static async getApplications() {
        try {
            const response = await axiosInstance.get("/application/find-all");
            console.log("Application data:", response.data);
            return response.data;
        } catch (error: unknown) {
            console.error("Get applications error:", error);
        }
    }
}

export default ApplicationService;
