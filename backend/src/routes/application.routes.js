import express from "express";
import { adminAuth } from "../middlewares/auth.js";
import ApplicationService from "../services/application.service.js";

const router = express.Router();

router.post("/create", async (req, res) => {
    try {
        const data = req.body;
        const result = await ApplicationService.create(data);
        res.status(201).json(result);
    } catch {
        res.status(500).json({ message: "Lỗi Server" });
    }
});

router.get("/find-by-id/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ApplicationService.findById(id);
        res.status(200).json(result);
    } catch (error) {
        switch (error.message) {
            case "APPLICATION_NOT_FOUND":
                res.status(404).json({ message: "Đơn không tồn tại" });
                break;
            default:
                res.status(500).json({ message: "Lỗi Server" });
        }
    }
});

export default router;
