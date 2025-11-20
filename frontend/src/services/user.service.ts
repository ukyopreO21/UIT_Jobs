import axiosInstance from "@/libs/axios-instance";

class UserService {
    static async login(username: string, password: string) {
        const response = await axiosInstance.post("/user/login", { username, password });

        return response.data;
    }

    static async logout() {
        await axiosInstance.post("/user/logout");
    }
}

export default UserService;
