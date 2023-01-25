require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const credentials = require("./middleware/credentials");
const corsOptions = require("./config/corsOption");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoutes = require("./router/userRouter");
const postRoutes = require("./router/postRouter");
const profileRoutes = require("./router/profileRouter");
const auth = require("./router/auth");
const jobRouter = require("./router/jobRouter");
const chatRouter = require("./router/chatRouter");
const messageRouter = require("./router/messageRoute");
const adminRouter = require("./router/adminRouter");
const connectDb = require("./config/config");
app.use(express.json());
dotenv.config();
connectDb();

app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/", userRoutes);
app.use("/auth", auth);
app.use("/message", messageRouter);
app.use("/job", jobRouter);
app.use("/profile", profileRoutes);
app.use("/post", postRoutes);
app.use("/chat", chatRouter);
app.use("/admin", adminRouter);
app.use(cors(corsOptions));
app.listen(5000, () => {
  console.log("up and running !!!!");
});
