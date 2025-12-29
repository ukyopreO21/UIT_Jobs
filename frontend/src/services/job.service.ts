import axiosInstance from "@/libs/axios-instance";

class JobService {
    static async create(data: Object) {
        const response = await axiosInstance.post(`/job`, data);
        return response.data;
    }

    static async findById(id: number) {
        const response = await axiosInstance.get(`/job/${id}`);
        return response.data;
    }

    static async findByFields(data: Object) {
        const response = await axiosInstance.get(`/job`, {
            params: data,
        });
        return response.data;
    }

    static async updateById(id: number, data: Object) {
        await axiosInstance.put(`/job/${id}`, data);
    }
}

export default JobService;
