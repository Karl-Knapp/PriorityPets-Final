import { Router } from "express";
import requireAuth from "../middleware/requireAuth";
import { getTest } from "../controllers/protected.controller";

const protectedRoutes = Router();

// /api/protected
protectedRoutes.route("/").get(requireAuth, getTest);

export default protectedRoutes;
