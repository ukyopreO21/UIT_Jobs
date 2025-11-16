import jwt from "jsonwebtoken";

const ACCESS_TOKEN_EXPIRES = "7d";
const REFRESH_TOKEN_EXPIRES = "30d";

class AuthToken {
    static createAccessToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: ACCESS_TOKEN_EXPIRES,
        });
    }

    static createRefreshToken(payload) {
        return jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: REFRESH_TOKEN_EXPIRES,
        });
    }

    static verifyToken(token) {
        return jwt.verify(token, process.env.JWT_SECRET);
    }
}

export default AuthToken;
