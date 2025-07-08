import { Request, Response } from "express";
import Chat from "../database/models/chatModel";
import User from "../database/models/userModel";
import Message from "../database/models/messageModel";

interface IAuth extends Request {
  user?: {
    id: string;
    role: string;
  };
}
class ChatController {
  //create or get chat between  user and admin
  async getOrCreateChat(req: Request, res: Response) {
    const { adminId, customerId } = req.body;
    if (!adminId || !customerId) {
      res.status(400).json({
        message: "Admin ID and Customer ID are required",
      });
      return;
    }
    let chat = await Chat.findOne({
      where: {
        adminId,
        customerId,
      },
    });
    if (!chat) {
      chat = await Chat.create({
        customerId,
        adminId,
      });
    }
    res.status(200).json({
      message: "Chat retrieved successfully",
      chat,
    });
  }

  // get all messages in a chat
  async getChatMessages(req: IAuth, res: Response) {
    const { chatId } = req.params;
    if (!chatId) {
      res.status(400).json({
        message: "Chat ID is required",
      });
      return;
    }
    const messages = await Message.findAll({
      where: { chatId },
      include: [
        {
          model: User,
          as: "Sender",
          attributes: ["id", "username", "email"],
        },
        {
          model: User,
          as: "Receiver",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["createdAt", "ASC"]],
    });
    res.status(200).json({
      message: "Messages retrieved successfully",
      data: messages,
    });
  }

  // send message in a chat
  async sendMessage(req: IAuth, res: Response) {
    const { chatId, senderId, receiverId, content } = req.body;
    if (!chatId || !senderId || !receiverId || !content) {
      res.status(400).json({
        message: "Chat ID, Sender ID, Receiver ID and content are required",
      });
      return;
    }
    const message = await Message.create({
      chatId,
      senderId,
      receiverId,
      content,
      read: false,
    });

    res.status(200).json({
      message: "Message sent successfully",
      data: message,
    });
  }

  // get all chats

  async getAllChats(req: IAuth, res: Response) {
    const { id: userId, role } = req.user || {};
    if (!userId || !role) {
      res.status(400).json({
        message: "User ID and role are required",
      });
      return;
    }
    const where =
      role === "admin" ? { adminId: userId } : { customerId: userId };
    const chats = await Chat.findAll({
      where,
      include: [
        {
          model: User,
          as: role === "admin" ? "Customer" : "Admin",
          attributes: ["id", "username", "email"],
        },
      ],
      order: [["updatedAt", "DESC"]],
    });

    res.status(200).json({
      message: "Chats fetched successfully",
      data: chats,
    });
  }

  //   MARK AS READ

  async markMessageAsRead(req: IAuth, res: Response) {
    const { chatId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(400).json({
        message: "User ID is required",
      });
      return;
    }

    if (!chatId) {
      res.status(400).json({
        message: "Chat ID is required",
      });
      return;
    }
    await Message.update(
      { read: true },
      { where: { chatId, receiverId: userId, read: false } }
    );

    res.status(200).json({ message: "Messages marked as read." });
  }
}

export default new ChatController();
