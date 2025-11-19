import db from "../config/db.js";
import unflattenObject from "../utils/unflatten-object.js";
class JobDAO {
    static async create(data) {
        const query =
            "INSERT INTO jobs (title, location, faculty, discipline, position, description, quantity, salary, degree, deadline) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        const [result] = await db.execute(query, [
            data.title,
            data.location || null,
            data.faculty,
            data.discipline || null,
            data.position,
            data.description || null,
            data.quantity,
            data.salary || null,
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

    static async getAllFaculties() {
        const [rows] = await db.execute(`SELECT faculty, discipline FROM jobs`);
        const facultyMap = {};

        rows.forEach((row) => {
            if (!facultyMap[row.faculty]) {
                facultyMap[row.faculty] = new Set();
            }
            if (row.discipline) {
                facultyMap[row.faculty].add(row.discipline);
            }
        });

        return Object.keys(facultyMap).map((name) => ({
            name,
            disciplines: Array.from(facultyMap[name]),
        }));
    }

    static async getAllPositions() {
        const [rows] = await db.execute(`SELECT DISTINCT position FROM jobs`);
        return rows.map((row) => row.position);
    }

    static async getPagination(whereClause, val, resultPerPage) {
        const countQuery = `
            SELECT COUNT(*) AS total FROM jobs
            ${whereClause}
        `;
        const [countResult] = await db.execute(countQuery, val);
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / resultPerPage);
        return { totalRecords, totalPages };
    }

    static async getJobs(whereClause, val, resultPerPage, offset) {
        const query = `
            SELECT * FROM jobs
            ${whereClause}
            ORDER BY id ASC
            LIMIT ${resultPerPage} OFFSET ${offset}
        `;
        const [result] = await db.execute(query, [...val]);
        return result;
    }

    static async findByFields(fields, searchValue, page = 1, resultPerPage = 10) {
        const structuredFields = unflattenObject(fields);
        const offset = (page - 1) * resultPerPage;
        const { whereClause, values } = this.buildWhereClause(structuredFields, searchValue);

        const data = await this.getJobs(whereClause, values, resultPerPage, offset);

        const { totalRecords, totalPages } = await this.getPagination(
            whereClause,
            values,
            resultPerPage
        );

        const positions = await this.getAllPositions();
        const faculties = await this.getAllFaculties();

        return {
            data,
            pagination: {
                currentPage: page,
                resultPerPage,
                totalRecords,
                totalPages,
            },
            positions,
            faculties,
        };
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

    static buildWhereClause(fields, searchValue) {
        let whereParts = [];
        let values = [];

        const cols = Object.keys(fields).filter(
            (key) => !["filters", "faculties[]", "disciplines[]"].includes(key)
        );

        cols.forEach((col) => {
            const value = fields[col];
            if (value !== undefined && value !== null) {
                if (col === "positions[]") {
                    const arr = Array.isArray(value) ? value : [value];
                    if (arr.length > 0) {
                        whereParts.push(`position IN (${arr.map(() => "?").join(", ")})`);
                        values.push(...arr);
                    }
                }
            }
        });

        if (fields.filters && Array.isArray(fields.filters) && fields.filters.length > 0) {
            let filterGroups = [];

            fields.filters.forEach((group) => {
                if (group.disciplines && group.disciplines.length > 0) {
                    const placeholders = group.disciplines.map(() => "?").join(", ");
                    filterGroups.push(`(faculty = ? AND discipline IN (${placeholders}))`);

                    values.push(group.faculty);
                    values.push(...group.disciplines);
                } else {
                    filterGroups.push(`(faculty = ?)`);
                    values.push(group.faculty);
                }
            });

            if (filterGroups.length > 0) {
                whereParts.push(`(${filterGroups.join(" OR ")})`);
            }
        }

        const { startDate, endDate } = fields;
        const fixedStartDate = startDate ? startDate + " 00:00:00" : null;
        const fixedEndDate = endDate ? endDate + " 23:59:59" : null;
        if (startDate && endDate) {
            whereParts.push(`deadline BETWEEN ? AND ?`);
            values.push(fixedStartDate, fixedEndDate);
        } else if (startDate) {
            whereParts.push(`deadline >= ?`);
            values.push(fixedStartDate);
        } else if (endDate) {
            whereParts.push(`deadline <= ?`);
            values.push(fixedEndDate);
        }

        if (searchValue) {
            whereParts.push(
                `(id LIKE ? OR position LIKE ? OR faculty LIKE ? OR discipline LIKE ? OR degree LIKE ?)`
            );
            values.push(
                `%${searchValue}%`,
                `%${searchValue}%`,
                `%${searchValue}%`,
                `%${searchValue}%`,
                `%${searchValue}%`
            );
        }

        const whereClause = whereParts.length > 0 ? "WHERE " + whereParts.join(" AND ") : "";

        return { whereClause, values };
    }
}

export default JobDAO;
