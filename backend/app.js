import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";
import mongoose, { mongo } from "mongoose";
import cors from "cors";
import { connnectToSocket } from "./src/controllers/socketManager.js";
import userRoutes from "./src/routes/users.routes.js";

const app = express(); // it's normal express server
const server = createServer(app); // convert express server to http-server
const io = connnectToSocket(server); // http server attache to socket.io

app.set("port", process.env.PORT || 8000);
app.use(cors());
app.use(express.json({ limit: "40kb" })); // accepts data under the 40*1000 letters,& it's Enough
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

app.get("/home", (req, res) => {
  return res.json({ hello: "world" });
});

const start = async () => {
  app.set("mongo_user");

  const connectionDb = mongoose.connect(
    "mongodb+srv://aayushpatidar0143_db_user:qxkTZszWCNzeTRIY@apnavideo.y3fxvb7.mongodb.net/"
  );
  console.log(`MONGO connect DB Host ${(await connectionDb).connection.host}`);

  server.listen(app.get("port"), () => {
    console.log("listening port 8000 ✅");
  });
};
start();
