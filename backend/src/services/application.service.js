import ApplicationDAO from "../dao/application.dao.js";
import generateUniqueAppId from "../utils/generate-unique-app-id.js";

class ApplicationService {
    static async create(application) {
        const id = await generateUniqueAppId();
        application.id = id;
        return await ApplicationDAO.create(application);
    }

    static async findById(id) {
        const result = await ApplicationDAO.findById(id);
        if (!result) throw new Error("APPLICATION_NOT_FOUND");
        return result;
    }
}

export default ApplicationService;
