import db from "../config/db.js";

class ApplicationDAO {
    static async create(data) {
        const columns = [
            "id",
            "job_id",
            "applicant_id",
            "applicant_name",
            "applicant_dob",
            "applicant_gender",
            "applicant_permanent_address",
            "applicant_contact_address",
            "applicant_phone",
            "applicant_email",
            "second_choice_position",
            "second_choice_department",
            "applicant_degree",
            "applicant_inst_name",
            "applicant_major",
            "applicant_grad_year",
            "applicant_grad_grade",
            "applicant_lang_lvl",
            "applicant_it_prof_lvl",
            "applicant_cv",
            "applicant_note",
        ];

        const values = columns.map((col) => data[col]);

        const placeholders = new Array(columns.length).fill("?").join(", ");

        const query = `INSERT INTO applications (${columns.join(", ")}) VALUES (${placeholders})`;

        const [result] = await db.execute(query, values);
        return result;
    }

    static async findById(id) {
        const query = "SELECT * FROM applications WHERE id = ?";
        const [result] = await db.execute(query, [id]);
        return result.length ? result[0] : undefined;
    }

    static async findByFields(data) {
        const cols = Object.keys(data);
        const val = Object.values(data);
    }

    static async updateById(data) {
        const { id, ...fieldsToUpdate } = data;
        if (!id) throw new Error("ID là bắt buộc cho lệnh cập nhật.");

        const cols = Object.keys(fieldsToUpdate);
        const val = Object.values(fieldsToUpdate);

        if (cols.length === 0) throw new Error("Không có trường nào để cập nhật.");

        const setClause = cols.map((col) => `\`${col}\` = ?`).join(", ");
        const query = `UPDATE applications SET ${setClause} WHERE id = ?`;
        const [result] = await db.execute(query, [...val, id]);
        return result;
    }

    static async findAll() {
        const query = "SELECT * FROM applications";
        const [result] = await db.execute(query);
        return result;
    }
}

export default ApplicationDAO;
