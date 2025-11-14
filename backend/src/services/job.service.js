import JobDAO from "../dao/job.dao.js";

class JobService {
    static async create(job) {
        return await JobDAO.create(job);
    }

    static async findById(id) {
        const result = await JobDAO.findById(id);
        if (!result) throw new Error("JOB_NOT_FOUND");
        return result;
    }

    static async findByFields(data) {
        const allowedFields = ["title", "department", "position", "degree"];
        const keys = Object.keys(data);

        for (const field of keys) {
            if (!allowedFields.includes(field)) {
                throw new Error("INVALID_FIELD");
            }
        }

        const result = await JobDAO.findByFields(data);
        if (!result) throw new Error("NO_JOBS_FOUND");
        return result;
    }
}

export default JobService;
