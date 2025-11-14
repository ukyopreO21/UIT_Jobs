import UserDAO from "../dao/user.dao.js";
import EncryptPassword from "../utils/encrypt-password.js";

class UserService {
    static async createAccount(user) {
        const hashedPassword = await EncryptPassword.hashPassword(user.password);
        const userToCreate = {
            ...user,
            password: hashedPassword,
        };
        return await UserDAO.create(userToCreate);
    }

    static async login(data) {
        const result = await UserDAO.findByUsername(data.username);
        if (!result) throw new Error("USER_NOT_FOUND");

        if (!(await EncryptPassword.comparePassword(data.password, result.password))) {
            throw new Error("INCORRECT_PASSWORD");
        }

        const { password, ...userWithoutPassword } = result;
        return userWithoutPassword;
    }
}

export default UserService;
