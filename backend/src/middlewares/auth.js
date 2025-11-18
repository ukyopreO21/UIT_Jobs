import AuthToken from "../utils/auth-token.js";

export const adminAuth = (req, res, next) => {
    const token = req.cookies.accessToken;

    if (!token) {
        return res.status(401).json({ error: "Không tìm thấy token truy cập." });
    }

    try {
        const decoded = AuthToken.verifyToken(token);

        if (!decoded) {
            return res.status(403).json({ error: "Bạn không có quyền truy cập tính năng này." });
        }

        next();
    } catch (err) {
        return res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn." });
    }
};
