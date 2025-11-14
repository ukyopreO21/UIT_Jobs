import express from "express";
import cors from "cors";

import rootRouter from "./routes/index.js";

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5173"],
        methods: ["GET", "POST", "PUT", "DELETE"], // Các phương thức được phép
        allowedHeaders: ["Content-Type", "Authorization"], // Các headers được phép
        credentials: true, // Cho phép cookies và credentials
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT || 3000, () =>
    console.log(`Server running on port ${process.env.PORT || 3000}`)
);

app.use("/api/", rootRouter);
