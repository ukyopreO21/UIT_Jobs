import axiosInstance from "@/libs/axios-instance";

class JobService {
    static async create(data: Object) {
        const response = await axiosInstance.post(`/job/create`, data);
        return response.data;
    }

    static async findById(id: number) {
        const response = await axiosInstance.get(`/job/find-by-id/${id}`);
        return response.data;
    }

    static async findByFields(data: Object) {
        const response = await axiosInstance.get(`/job/find-by-fields`, {
            params: data,
        });
        console.log(data);
        return response.data;
    }

    static async updateById(data: Object) {
        console.log("hehe: ", data);
        await axiosInstance.put(`/job/update-by-id`, data);
    }
}

export default JobService;
