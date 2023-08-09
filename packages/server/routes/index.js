import express from "express";
import userRouter from "./users";
import taskRouter from "./tasks";
import petRouter from "./pets";
import authRouter from "./auth";
import protectedRoutes from "./protected.routes";
import listEndpoints from "express-list-endpoints";

const router = express.Router();

// Define routes
router.use("/auth", authRouter);
router.use("/protected", protectedRoutes);
router.use("/users", userRouter);
router.use("/tasks", taskRouter);
router.use("/pets", petRouter);

export default router;
