import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export const adminAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer "))
        return res.status(401).json({ error: "Không tìm thấy token truy cập." });

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (decoded.role !== "admin")
            return res.status(403).json({ error: "Bạn không có quyền truy cập tính năng này." });

        next();
    } catch (err) {
        return res.status(401).json({ error: "Token không hợp lệ hoặc đã hết hạn." });
    }
};
