import jwt from "jsonwebtoken";
import adminSeeder from "./src/adminSeeder";
import app from "./src/app";
import { envConfig } from "./src/config/config";
import categoryController from "./src/controllers/categoryController";
import collectionController from "./src/controllers/collectionController";

import { Server, Socket } from "socket.io";
import User from "./src/database/models/userModel";
import Order from "./src/database/models/orderModel";
import Payment from "./src/database/models/paymentModel";
import Message from "./src/database/models/messageModel";

function startServer() {
  const server = app.listen(envConfig.port, () => {
    categoryController.seedCategory();

    console.log(`Server is running on port ${envConfig.port}`);
    adminSeeder();
    collectionController.seedCollection();
  });

  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:5173", "http://localhost:3000"],
    },
  });
  let activeUser: { socketId: string; userId: string; role: string }[] = [];
  let addToOnlineUsers = (socketId: string, userId: string, role: string) => {
    activeUser = activeUser.filter((user) => user.userId !== userId);
    activeUser.push({ socketId, userId, role });
  };

  io.on("connection", (socket) => {
    console.log("connected");
    const { token } = socket.handshake.auth;
    console.log(token, "token");
    if (token) {
      jwt.verify(
        token as string,
        envConfig.jwtSecret as string,
        async (err: any, result: any) => {
          if (err) {
            socket.emit("error", err);
            return;
          }
          const userData = await User.findByPk(result.userId);
          if (!userData) {
            socket.emit("error", "No user found with that token");
            return;
          }
          console.log(socket.id, result.userId, userData.role);
          addToOnlineUsers(socket.id, result.userId, userData.role);
          console.log(activeUser);
        }
      );
    } else {
      console.log("triggered");
      socket.emit("error", "Please provide token");
    }
    console.log(activeUser);
    socket.on("updateOrderStatus", async (data) => {
      const { status, orderId, userId } = data;
      console.log(data, "USS");
      console.log(status, orderId);
      const findUser = activeUser.find((user) => user.userId == userId); // {socketId,userId, role}
      await Order.update(
        {
          orderStatus: status,
        },
        {
          where: {
            id: orderId,
          },
        }
      );
      if (findUser) {
        console.log(findUser.socketId, "FS");
        io.to(findUser.socketId).emit("statusUpdated", data);
      } else {
        socket.emit("error", "User is not online!!");
      }
    });

    socket.on("updatePaymentStatus", async (data) => {
      const { status, paymentId, userId } = data;
      console.log(data, "payments");

      const findUser = activeUser.find((user) => user.userId == userId);
      await Payment.update(
        {
          paymentStatus: status,
        },
        {
          where: { id: paymentId },
        }
      );
      if (findUser) {
        console.log(findUser.socketId, "Sending Payment Update");
        io.to(findUser.socketId).emit("paymentStatusUpdated", {
          paymentId,
          status,
          message: "Payment status updated successfully",
        });
      } else {
        socket.emit("error", "User is not online to receive payment update!");
      }
    });

    // handle for chat
    socket.on("joinChat", (chatId: string) => {
      console.log(`User joined chat: ${chatId}`);
      socket.join(chatId);
    });

    socket.on("sendMessage", async (data) => {
      const { chatId, senderId, receiverId, content } = data;
      if (!chatId || !senderId || !receiverId || !content) {
        socket.emit(
          "error",
          "Chat ID, Sender ID, Receiver ID and content are required"
        );
        return;
      }
      const message = await Message.create({
        chatId,
        senderId,
        receiverId,
        content,
        read: false,
      });
      // send to all clients in the chat room
      io.to(chatId).emit("receiveMessage", message);
      console.log(`Message sent in chat ${chatId}:`, message);
    });
    socket.on("typing", ({ chatId, userId }) => {
      socket.to(chatId).emit("typing", { chatId, userId });
    });
  });
}
startServer();
