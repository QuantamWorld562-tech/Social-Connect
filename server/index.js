import express, { urlencoded } from "express";
import cors from "cors";
import cookieparser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/user.routes.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";

dotenv.config({ path: ".env" });

const PORT = process.env.PORT || 3000;

const _dirname = path.resolve();



app.use(express.json());
app.use(cookieparser());
app.use(urlencoded({ extended: true }));  //urlenocoed helps the server understand data sent from HTML forms.

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};
app.use(cors(corsOptions));

app.use("/api/user", userRoute);
app.use("/api/post", postRoute);
app.use("/api/message", messageRoute);

app.use(express.static(path.join(_dirname,"/client/dist")));

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.resolve(_dirname, "client", "dist", "index.html"));
});

server.listen(PORT, async () => {
  await connectDB();
  console.log(`server is running on the port: ${PORT}`);
});
