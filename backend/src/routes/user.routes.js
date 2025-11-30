import express from "express";
import UserService from "../services/user.service.js";

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const data = req.body;
        const result = await UserService.createAccount(data);
        return res.status(201).json(result);
    } catch {
        return res.status(500).json({ message: "Lỗi Server" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const data = req.body;
        // ĐỪNG tách accessToken ra khỏi result, hãy giữ nó lại để trả về cho Client
        const result = await UserService.login(data);

        // Vẫn set cookie như một phương án dự phòng (hoặc nếu sau này dùng chung domain)
        // NHƯNG QUAN TRỌNG: Bỏ thuộc tính "domain" đi để tránh lỗi mismatch domain
        const cookieOptions = {
            httpOnly: true,
            secure: true, // Luôn true nếu chạy https (ngrok là https)
            sameSite: "None", // Cần thiết nếu Front/Back khác domain
            path: "/",
        };

        res.cookie("accessToken", result.accessToken, {
            ...cookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.cookie("refreshToken", result.refreshToken, {
            ...cookieOptions,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json(result);
    } catch (e) {
        switch (e.message) {
            case "USER_NOT_FOUND":
                return res.status(404).json({ message: "Người dùng không tồn tại" });

            case "INCORRECT_PASSWORD":
                return res.status(401).json({ message: "Mật khẩu không đúng" });

            default:
                return res.status(500).json({ message: "Lỗi Server" });
        }
    }
});

router.post("/renew-access-token", async (req, res) => {
    try {
        const { refreshToken } = req.body;
        const result = await UserService.renewAccessToken(refreshToken);
        return res.status(200).json(result);
    } catch (e) {
        switch (e.message) {
            case "INVALID_REFRESH_TOKEN":
                return res.status(401).json({ message: "Refresh token không hợp lệ" });

            default:
                return res.status(500).json({ message: "Lỗi Server" });
        }
    }
});

router.put("/update-info", async (req, res) => {
    try {
        const data = req.body;
        const result = await UserService.updateInfo(data);
        return res.status(200).json(result);
    } catch (e) {
        switch (e.message) {
            case "USERNAME_REQUIRED":
                return res.status(400).json({ message: "Yêu cầu cung cấp username" });
            default:
                return res.status(500).json({ message: "Lỗi Server" });
        }
    }
});

router.put("/change-password", async (req, res) => {
    try {
        const data = req.body;
        const result = await UserService.changePassword(data);
        return res.status(200).json(result);
    } catch (e) {
        switch (e.message) {
            case "USER_NOT_FOUND":
                return res.status(404).json({ message: "Người dùng không tồn tại" });
            case "INCORRECT_PASSWORD":
                return res.status(401).json({ message: "Mật khẩu hiện tại không đúng" });
            default:
                return res.status(500).json({ message: "Lỗi Server" });
        }
    }
});

router.post("/logout", async (req, res) => {
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/",
    });

    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        path: "/",
    });

    return res.status(200).json({ message: "Đăng xuất thành công" });
});

export default router;
