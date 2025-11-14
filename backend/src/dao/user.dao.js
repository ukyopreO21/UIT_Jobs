import db from "../config/db.js";

class UserDAO {
    /**
     * Tạo một người dùng mới trong cơ sở dữ liệu.
     *
     * @param {Object} data
     * @returns {Promise<Object>} Kết quả của thao tác chèn người dùng mới.
     */
    static async create(data) {
        const query =
            "INSERT INTO users (username, email, phone, password, full_name) VALUES (?, ?, ?, ?, ?)";

        const [result] = await db.execute(query, [
            data.username,
            data.email,
            data.phone,
            data.password,
            data.full_name,
        ]);

        return result;
    }

    /**
     * Tìm kiếm một nguời dùng dựa trên username.
     * @param {string} username
     * @returns {Promise<Object | undefined>}
     */
    static async findByUsername(username) {
        const query = "SELECT * FROM users WHERE username = ?";
        const [result] = await db.execute(query, [username]);
        return result.length ? result[0] : undefined;
    }

    /**
     * Tìm kiếm danh sách người dùng dựa trên 1 trong 3 trường: email, username, hoặc một phần tên đầy đủ.
     *
     * param {string} searchValue - Giá trị tìm kiếm (ví dụ: "johndoe", "john@email.com", "John Doe").
     * returns {Promise<Object[] | undefined>} Danh sách người dùng khớp với điều kiện tìm kiếm hoặc undefined nếu không tìm thấy.
     */
    // static async find(searchValue) {
    //     const query = "SELECT * FROM users WHERE username = ? OR email = ? OR full_name LIKE ?";
    //     const [result] = await db.execute(query, [searchValue, searchValue, `%${searchValue}%`]);
    //     return result.length ? result : undefined;
    // }

    static async updatePassword(username, newHashedPassword) {
        const query = "UPDATE users SET password = ? WHERE username = ?";
        const [result] = await db.execute(query, [newHashedPassword, username]);
        return result;
    }
}

export default UserDAO;
