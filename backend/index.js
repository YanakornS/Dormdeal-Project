const express = require("express");
const cors = require("cors");
require("dotenv").config();
const mongoose = require("mongoose");
const { app, server } = require("./libs/socket");
const BASE_URL = process.env.BASE_URL;
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;
const userRouter = require("./routers/user.router");
const postRouter = require("./routers/post.router");
const reportRouter = require("./routers/report.router")
const modRouter = require("./routers/mod.router")
const adminRouter = require("./routers/admin.router")
const maincategoryRouter = require("./routers/maincategory.router")
const subcategoryRouter = require("./routers/subcategory.router")
const wishlistRouter = require("./routers/wishlist.router");
const messageRouter = require("./routers/message.router")
const chatroomRouter = require("./routers/chatroom.router");
const notificationRouter = require("./routers/notification.router");
const ratingRouter = require("./routers/rating.router")

try {
  mongoose.connect(DB_URL);
  console.log("Connect to mongo DB Successfully");
} catch (error) {
  console.log("DB Connection Failed");
}

app.use(cors({ origin: BASE_URL, credentials: true }));
app.use(express.json());
app.get("/", (req, res) => {
  res.send("<h1>Welcome to DormDeals Restful API</h1>");
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/maincategory", maincategoryRouter);
app.use("/api/v1/subcategory", subcategoryRouter);
app.use("/api/v1/notification", notificationRouter);
app.use("/api/v1/rating", ratingRouter);
app.use("/api/v1/report", reportRouter);
app.use("/api/v1/mod", modRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/wishlist", wishlistRouter);
app.use("/api/v1/message", messageRouter);
app.use("/api/v1/chatroom", chatroomRouter);

server.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
});
