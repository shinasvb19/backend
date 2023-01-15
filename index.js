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
const connectDb = require("./config/config");
app.use(express.json());
dotenv.config();
connectDb();

app.use(credentials);
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/", userRoutes);
app.use("/auth", auth);
app.use("/profile", profileRoutes);
app.use("/post", postRoutes);
app.use(cors(corsOptions));
app.listen(5000, () => {
  console.log("up and running !!!!");
});
