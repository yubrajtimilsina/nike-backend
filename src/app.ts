import express from "express";
import "./database/connection";
import userRoute from "./routes/userRoute";
import categoryRoute from "./routes/categoryRoute";
import shoeRoute from "./routes/shoeRoute";
import cors from "cors";
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.use("/api/auth", userRoute);
app.use("/api/category", categoryRoute);
app.use("/api/shoe", shoeRoute);

export default app;
