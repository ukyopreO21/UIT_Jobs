import db from "../config/db.js";

class JobDAO {
    static async create(data) {
        const query =
            "INSERT INTO jobs (title, location, department, position, description, quantity, salary, degree, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const [result] = await db.execute(query, [
            data.title,
            data.location,
            data.department,
            data.position,
            data.description,
            data.quantity,
            data.salary,
            data.degree,
            data.deadline,
        ]);

        return result;
    }

    static async findById(id) {
        const query = "SELECT * FROM jobs WHERE id = ?";
        const [result] = await db.execute(query, [id]);
        return result.length ? result[0] : undefined;
    }

    static async findByFields(data) {
        const cols = Object.keys(data);
        const val = Object.values(data);

        const whereClause = cols.map((col) => `\`${col}\` = ?`).join(" AND ");
        const query = `SELECT * FROM jobs WHERE ${whereClause}`;
        const [result] = await db.execute(query, val);
        return result.length ? result : undefined;
    }

    static async findAll() {
        const query = "SELECT * FROM jobs";
        const [result] = await db.execute(query);
        return result.length ? result : undefined;
    }

    static async updateById(data) {
        const { id, ...fieldsToUpdate } = data;
        if (!id) throw new Error("ID là bắt buộc cho lệnh cập nhật.");

        const cols = Object.keys(fieldsToUpdate);
        const val = Object.values(fieldsToUpdate);

        if (cols.length === 0) throw new Error("Không có trường nào để cập nhật.");

        const setClause = cols.map((col) => `\`${col}\` = ?`).join(", ");
        const query = `UPDATE jobs SET ${setClause} WHERE id = ?`;
        const [result] = await db.execute(query, [...val, id]);
        return result;
    }

    static async deleteById(id) {
        const query = "DELETE FROM jobs WHERE id = ?";
        const [result] = await db.execute(query, [id]);
        return result;
    }
}

export default JobDAO;
