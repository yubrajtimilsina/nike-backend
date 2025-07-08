
import express, { Router } from "express";
import errorHandler from "../services/errorHandler";
import chatController from "../controllers/chatController";
import userMiddleware from "../middleware/userMiddleware";

const router: Router = express.Router();

// POST: Create or get an existing chat
router.post("/get-or-create",userMiddleware.isUserLoggedIn, errorHandler(chatController.getOrCreateChat));

// GET: Fetch all messages in a chat
router.get("/:chatId/messages", userMiddleware.isUserLoggedIn,errorHandler(chatController.getChatMessages));

// POST: Send a message
router.post("/send-message",userMiddleware.isUserLoggedIn, errorHandler(chatController.sendMessage));

// GET: Get all chats for current user
router.get("/all", userMiddleware.isUserLoggedIn, errorHandler(chatController.getAllChats));

export default router;