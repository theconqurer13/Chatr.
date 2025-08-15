
import express from "express";
import  clerkWebhooks  from "../controllers/clerkWebhooks.js";
import bodyParser from "body-parser";

const clerkrouter = express.Router();

// Sirf webhook route ke liye raw body use karo
clerkrouter.post("/", bodyParser.raw(express.raw({ type: "application/json" })), clerkWebhooks);

export default clerkrouter;