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
                return res.status(404).json({ message: "Hồ sơ không tồn tại" });
            default:
                return res.status(500).json({ message: "Lỗi Server" });
        }
    }
});

router.get("/find-by-fields", adminAuth, async (req, res) => {
    try {
        const result = await ApplicationService.findByFields(req.query);
        return res.status(200).json(result);
    } catch (error) {
        switch (error.message) {
            case "APPLICATIONS_NOT_FOUND":
                return res.status(404).json({ message: "Không tìm thấy đơn ứng tuyển" });
            default:
                return res.status(500).json({ message: "Lỗi Server" });
        }
    }
});

router.put("/update-by-id", adminAuth, async (req, res) => {
    try {
        const result = await ApplicationService.updateById(req.body);
        return res.status(200).json(result);
    } catch (error) {
        switch (error.message) {
            case "APPLICATION_UPDATE_FAILED":
                return res.status(400).json({ message: "Cập nhật đơn ứng tuyển thất bại" });
            default:
                return res.status(500).json({ message: "Lỗi Server" });
        }
    }
});

export default router;
