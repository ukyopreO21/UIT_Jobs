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
        const { page, resultPerPage, searchValue, ...fields } = data;
        const pageNum = parseInt(page);
        const perPage = parseInt(resultPerPage);

        const result = await JobDAO.findByFields(fields, searchValue, pageNum, perPage);
        if (!result) throw new Error("JOBS_NOT_FOUND");
        return result;
    }

    static async updateById(data) {
        const result = await JobDAO.updateById(data);
        if (!result) throw new Error("JOB_UPDATE_FAILED");
        return result;
    }
}

export default JobService;
