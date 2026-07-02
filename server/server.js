require("dotenv").config();
const db = require("./db");
const { Server } = require("socket.io");
const PORT = process.env.PORT || 5000;
const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
}); 
const onlineUsers = new Map();
io.on("connection", (socket) => {

    console.log("A user connected");
    socket.on("register-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log(onlineUsers);
    });
    socket.on("send-message", async (data) => {

    try {

        console.log("Server received:");
        console.log(data);

        await db.query(
            `INSERT INTO messages
            (sender_id, receiver_id, message)
            VALUES (?, ?, ?)`,
            [
                data.senderId,
                data.receiverId,
                data.text
            ]
        );

        console.log("Message Saved");

        const receiverSocketId = onlineUsers.get(data.receiverId);

        if (receiverSocketId) {

            io.to(receiverSocketId).emit("receive-message", data);

        }

        socket.emit("receive-message", data);

    }

    catch (error) {

        console.log(error);

    }

});
    socket.on("disconnect", () => {
        for (const [userId, socketId] of onlineUsers) {
            console.log(userId);
            console.log(socketId);
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                console.log(`User ${userId} removed`);
            }
        }
        console.log("User disconnected");
    });
});
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

app.get("/", (req,res)=>{
    res.send("Server Running");
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});