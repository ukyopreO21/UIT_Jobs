import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

class EncryptPassword {
    static async hashPassword(plainPassword) {
        return await bcrypt.hash(plainPassword, SALT_ROUNDS);
    }

    static async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

export default EncryptPassword;
