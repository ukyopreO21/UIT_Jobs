import axiosInstance from "@/libs/axios-instance";

class ApplicationService {
    static async findById(id: string) {
        const response = await axiosInstance.get(`/application/find-by-id/${id}`);
        return response.data;
    }

    static async findByFields(data: Object) {
        const response = await axiosInstance.get(`/application/find-by-fields`, {
            params: data,
        });
        return response.data;
    }

    static async updateById(data: Object) {
        console.log(data);
        await axiosInstance.put("/application/update-by-id", data);
    }
}

export default ApplicationService;
