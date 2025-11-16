import express from "express";
import { adminAuth } from "../middlewares/auth.js";
import JobService from "../services/job.service.js";

const router = express.Router();

router.post("/create", adminAuth, async (req, res) => {
    try {
        const data = req.body;
        const result = await JobService.create(data);
        return res.status(201).json(result);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

router.get("/find-by-id/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await JobService.findById(id);
        return res.status(200).json(result);
    } catch (error) {
        switch (error.message) {
            case "JOB_NOT_FOUND":
                return res.status(404).json({ error: "Công việc không tồn tại." });
            default:
                return res.status(500).json({ error: error.message });
        }
    }
});

router.get("/find-by-fields", async (req, res) => {
    try {
        const data = req.query;
        const result = await JobService.findByFields(data);
        return res.status(200).json(result);
    } catch (error) {
        switch (error.message) {
            case "INVALID_FIELD":
                return res.status(400).json({ error: "Trường tìm kiếm không hợp lệ." });
            case "NO_JOBS_FOUND":
                return res.status(404).json({ error: "Không tìm thấy công việc nào." });
            default:
                return res.status(500).json({ error: error.message });
        }
    }
});

export default router;
