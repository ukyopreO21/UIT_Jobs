import axiosInstance from "@/libs/axios-instance";

class UserService {
    static async login(username: string, password: string) {
        const response = await axiosInstance.post("/user/login", { username, password });
        return response.data;
    }

    static async logout() {
        await axiosInstance.post("/user/logout");
    }

    static async updateInfo(data: Object) {
        await axiosInstance.put("/user/update-info", data);
    }

    static async changePassword(username: string, currentPassword: string, newPassword: string) {
        await axiosInstance.put("/user/change-password", {
            username,
            currentPassword,
            newPassword,
        });
    }
}

export default UserService;
