import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import rootRouter from "./routes/index.js";

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5000", "http://192.168.100.57:5000", process.env.PUBLIC_URL],
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, () =>
    console.log(`Server running on port ${process.env.PORT || 3000}`)
);

app.use("/api/", rootRouter);
