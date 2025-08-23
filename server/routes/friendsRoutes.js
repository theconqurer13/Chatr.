import express from "express";
import { friends } from "../controllers/friendsController.js";

const friendsRouter = express.Router();

friendsRouter.get('/', protect, friends);