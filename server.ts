import jwt from "jsonwebtoken";
import adminSeeder from "./src/adminSeeder";
import app from "./src/app";
import { envConfig } from "./src/config/config";
import categoryController from "./src/controllers/categoryController";
import collectionController from "./src/controllers/collectionController";

import { Server } from "socket.io";
import User from "./src/database/models/userModel";
import Order from "./src/database/models/orderModel";

function startServer() {
  const server = app.listen(envConfig.port, () => {
    categoryController.seedCategory();

    console.log(`Server is running on port ${envConfig.port}`);
    adminSeeder();
    collectionController.seedCollection();
  });

  // const io = new Server(server, {
  //   cors: {
  //     origin: "https://localhost:5173",
  //   },
  // });
  // let activeUser: { socketId: string; userId: string; role: string }[] = [];
  // let addToOnlineUsers = (socketId: string, userId: string, role: string) => {
  //   activeUser = activeUser.filter((user) => user.userId !== userId);
  //   activeUser.push({ socketId, userId, role });
  // };

  // io.on("connection", (socket) => {
  //   console.log("connected");
  //   const { token } = socket.handshake.auth;
  //   console.log(token, "token");
  //   if (token) {
  //     jwt.verify(
  //       token as string,
  //       envConfig.jwtSecret as string,
  //       async (err: any, result: any) => {
  //         if (err) {
  //           socket.emit("error", err);
  //           return;
  //         }
  //         const userData = await User.findByPk(result.userId);
  //         if (!userData) {
  //           socket.emit("error no user found with that token");
  //           result;
  //         }
  //         console.log(socket.id, result.userId, userData?.role);
  //         addToOnlineUsers(socket.id, result.userId, userData.role);
  //         console.log(activeUser);
  //       }
  //     );
  //   } else {
  //     console.log("triggered");
  //     socket.emit("error", "Please provide token");
  //   }
  //   console.log(activeUser);
  //   socket.on("updateOrderStatus", async (data) => {
  //     const { status, orderId, userId } = data;
  //     console.log(data, "USS");
  //     console.log(status, orderId);
  //     const findUser = activeUser.find((user) => user.userId == userId); // {socketId,userId, role}
  //     await Order.update(
  //       {
  //         orderStatus: status,
  //       },
  //       {
  //         where: {
  //           id: orderId,
  //         },
  //       }
  //     );
  //     if (findUser) {
  //       console.log(findUser.socketId, "FS");
  //       io.to(findUser.socketId).emit("statusUpdated", data);
  //     } else {
  //       socket.emit("error", "User is not online!!");
  //     }
  //   });
  // });
}
startServer();
