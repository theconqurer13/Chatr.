import express from "express";
import { getPendingRequests } from "../controllers/pendingRequestController.js";
import { protect } from "../middleware/authMiddleware.js";
const pendingRouter = express.Router();

pendingRouter.get('/', protect, getPendingRequests);

export default pendingRouter;