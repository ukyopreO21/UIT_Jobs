import express from "express";
import { adminAuth } from "../middlewares/auth.js";
import ApplicationService from "../services/application.service.js";

const router = express.Router();

router.post("/create", async (req, res) => {
    try {
        const data = req.body;
        const result = await ApplicationService.create(data);
        return res.status(201).json(result);
    } catch {
        return res.status(500).json({ message: "Lỗi Server" });
    }
});

router.get("/find-by-id/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await ApplicationService.findById(id);
        return res.status(200).json(result);
    } catch (error) {
        switch (error.message) {
            case "APPLICATION_NOT_FOUND":
                return res.status(404).json({ message: "Đơn không tồn tại" });
            default:
                return res.status(500).json({ message: "Lỗi Server" });
        }
    }
});

router.get("/find-all", adminAuth, async (req, res) => {
    try {
        const result = await ApplicationService.findAll();
        return res.status(200).json(result);
    } catch (error) {
        return res.status(500).json({ message: "Lỗi Server" });
    }
});

export default router;
