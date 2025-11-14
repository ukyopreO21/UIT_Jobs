import express from "express";
import user_routes from "./user.routes.js";
import job_routes from "./job.routes.js";
import application_routes from "./application.routes.js";

const rootRouter = express.Router();

rootRouter.use("/user", user_routes);
rootRouter.use("/job", job_routes);
rootRouter.use("/application", application_routes);

export default rootRouter;
