import db from "../config/db.js";
import JobDAO from "./job.dao.js";
import unflattenObject from "../utils/unflatten-object.js";

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
            "second_choice_faculty",
            "second_choice_discipline",
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

        const values = columns.map((col) => data[col] ?? null);

        const placeholders = new Array(columns.length).fill("?").join(", ");

        const query = `INSERT INTO applications (${columns.join(", ")}) VALUES (${placeholders})`;

        const [result] = await db.execute(query, values);
        return result;
    }

    static async findById(id) {
        const query = `
			SELECT applications.*, jobs.position, jobs.faculty, jobs.discipline
			FROM applications
			INNER JOIN jobs ON applications.job_id = jobs.id
			WHERE applications.id = ?`;
        const [result] = await db.execute(query, [id]);
        return result.length ? result[0] : undefined;
    }

    static async getQuantityPerStatus() {
        const statusQuery = `
            SELECT status, COUNT(*) AS total
            FROM applications
            GROUP BY status
        `;
        const [statusRows] = await db.execute(statusQuery);

        const quantityPerStatus = {
            "Đã ghi nhận": 0,
            "Đang phỏng vấn": 0,
            "Được tuyển dụng": 0,
            "Bị từ chối": 0,
        };

        statusRows.forEach((row) => {
            if (quantityPerStatus.hasOwnProperty(row.status)) {
                quantityPerStatus[row.status] = row.total;
            }
        });

        return quantityPerStatus;
    }

    static async getPagination(whereClause, val, resultPerPage) {
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM applications
            INNER JOIN jobs ON applications.job_id = jobs.id
            ${whereClause}
        `;
        const [countResult] = await db.execute(countQuery, val);
        const totalRecords = countResult[0].total;
        const totalPages = Math.ceil(totalRecords / resultPerPage);
        return { totalRecords, totalPages };
    }

    static async getApplications(whereClause, val, resultPerPage, offset) {
        const query = `
            SELECT applications.*, jobs.position, jobs.faculty, jobs.discipline
            FROM applications
            INNER JOIN jobs ON applications.job_id = jobs.id
            ${whereClause}
            ORDER BY applications.created_at DESC
            LIMIT ${resultPerPage} OFFSET ${offset}
        `;
        const [result] = await db.execute(query, [...val]);
        return result;
    }

    static async findByFields(fields, searchValue, page = 1, resultPerPage = 10) {
        const structuredFields = unflattenObject(fields);
        const offset = (page - 1) * resultPerPage;

        const { whereClause, values } = this.buildWhereClause(structuredFields, searchValue);

        const data = await this.getApplications(whereClause, values, resultPerPage, offset);

        const { totalRecords, totalPages } = await this.getPagination(
            whereClause,
            values,
            resultPerPage
        );

        const quantityPerStatus = await this.getQuantityPerStatus();
        const positions = await JobDAO.getAllPositions();
        const faculties = await JobDAO.getAllFaculties();

        return {
            data,
            pagination: {
                currentPage: page,
                resultPerPage,
                totalRecords,
                totalPages,
            },
            quantityPerStatus,
            positions,
            faculties,
        };
    }

    static async updateById(fields) {
        const { id, ...fieldsToUpdate } = fields;
        if (!id) throw new Error("ID là bắt buộc cho lệnh cập nhật.");

        const cols = Object.keys(fieldsToUpdate);
        const val = Object.values(fieldsToUpdate);

        if (cols.length === 0) throw new Error("Không có trường nào để cập nhật.");

        const setClause = cols.map((col) => `\`${col}\` = ?`).join(", ");
        const query = `UPDATE applications SET ${setClause} WHERE id = ?`;
        const [result] = await db.execute(query, [...val, id]);
        return result;
    }

    static buildWhereClause(fields, searchValue) {
        let whereParts = [];
        let values = [];

        const cols = Object.keys(fields).filter(
            (key) =>
                !["startDate", "endDate", "filters", "faculties[]", "disciplines[]"].includes(key)
        );

        cols.forEach((col) => {
            const value = fields[col];
            if (value !== undefined && value !== null) {
                if (col === "positions[]") {
                    const arr = Array.isArray(value) ? value : [value];
                    if (arr.length > 0) {
                        whereParts.push(`jobs.position IN (${arr.map(() => "?").join(", ")})`);
                        values.push(...arr);
                    }
                } else {
                    whereParts.push(`applications.${col} = ?`);
                    values.push(value);
                }
            }
        });

        if (fields.filters && Array.isArray(fields.filters) && fields.filters.length > 0) {
            let filterGroups = [];

            fields.filters.forEach((group) => {
                if (group.disciplines && group.disciplines.length > 0) {
                    const placeholders = group.disciplines.map(() => "?").join(", ");
                    filterGroups.push(
                        `(jobs.faculty = ? AND jobs.discipline IN (${placeholders}))`
                    );

                    values.push(group.faculty);
                    values.push(...group.disciplines);
                } else {
                    filterGroups.push(`(jobs.faculty = ?)`);
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
            whereParts.push(`applications.created_at BETWEEN ? AND ?`);
            values.push(fixedStartDate, fixedEndDate);
        } else if (startDate) {
            whereParts.push(`applications.created_at >= ?`);
            values.push(fixedStartDate);
        } else if (endDate) {
            whereParts.push(`applications.created_at <= ?`);
            values.push(fixedEndDate);
        }

        if (searchValue) {
            whereParts.push(`(applications.id LIKE ? OR applications.applicant_name LIKE ?)`);
            values.push(`%${searchValue}%`, `%${searchValue}%`);
        }

        const whereClause = whereParts.length > 0 ? "WHERE " + whereParts.join(" AND ") : "";

        return { whereClause, values };
    }
}

export default ApplicationDAO;
