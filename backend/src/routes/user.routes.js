import express from "express";
import { adminAuth } from "../middlewares/auth.js";
import UserService from "../services/user.service.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const data = req.body;
        const result = await UserService.create_account(data);
        res.status(201).json(result);
    } catch {
        res.status(500).json({ message: "Lỗi Server" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const data = req.body;
        const result = await UserService.login(data);
        res.status(200).json(result);
    } catch (e) {
        switch (e.message) {
            case "USER_NOT_FOUND":
                res.status(404).json({ message: "Người dùng không tồn tại" });
                break;
            case "INCORRECT_PASSWORD":
                res.status(401).json({ message: "Mật khẩu không đúng" });
                break;
            default:
                res.status(500).json({ message: "Lỗi Server" });
        }
    }
});

export default router;
