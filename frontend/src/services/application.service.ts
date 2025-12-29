import axiosInstance from "@/libs/axios-instance";

class ApplicationService {
    static async create(data: FormData) {
        const config =
            data instanceof FormData
                ? {
                      headers: { "Content-Type": "multipart/form-data" },
                  }
                : {};

        const response = await axiosInstance.post("/application", data, config);
        return response.data;
    }

    static async findById(id: string) {
        const response = await axiosInstance.get(`/application/${id}`);
        return response.data;
    }

    static async findByFields(data: Object) {
        const response = await axiosInstance.get(`/application`, {
            params: data,
        });
        return response.data;
    }

    static async updateById(id: string, data: Object) {
        await axiosInstance.put(`/application/${id}`, data);
    }
}

export default ApplicationService;
