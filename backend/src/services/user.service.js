import UserDAO from "../dao/user.dao.js";
import EncryptPassword from "../utils/encrypt-password.js";
import AuthToken from "../utils/auth-token.js";

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

        const accessToken = AuthToken.createAccessToken({
            username: result.username,
            password: result.password,
        });

        const refreshToken = AuthToken.createRefreshToken({
            username: result.username,
            password: result.password,
        });

        const { password, ...userWithoutPassword } = result;
        return { ...userWithoutPassword, accessToken, refreshToken };
    }

    static async renewAccessToken(refreshToken) {
        const payload = AuthToken.verifyRefreshToken(refreshToken);
        if (!payload) throw new Error("INVALID_REFRESH_TOKEN");
        const newAccessToken = AuthToken.createAccessToken({
            username: payload.username,
            password: payload.password,
        });
        return { accessToken: newAccessToken };
    }

    static async updateInfo(data) {
        if (!data.username) throw new Error("USERNAME_REQUIRED");
        return await UserDAO.updateInfo(data);
    }

    static async changePassword(data) {
        const user = await UserDAO.findByUsername(data.username);
        if (!user) throw new Error("USER_NOT_FOUND");

        const isPasswordCorrect = await EncryptPassword.comparePassword(
            data.currentPassword,
            user.password
        );
        if (!isPasswordCorrect) throw new Error("INCORRECT_PASSWORD");

        const hashedNewPassword = await EncryptPassword.hashPassword(data.newPassword);
        const updatedUser = await UserDAO.updatePassword(data.username, hashedNewPassword);

        const { password, ...userWithoutPassword } = updatedUser;
        return userWithoutPassword;
    }
}

export default UserService;
