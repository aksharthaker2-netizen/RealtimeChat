require("dotenv").config();
const { Server } = require("socket.io");
const PORT = process.env.PORT || 5000;
const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"],
    },
}); 
io.on("connection", (socket) => {

    console.log("A user connected");
    socket.on("send-message", (data) => {
    console.log("Server received:");
    console.log(data);
    socket.emit("receive-message", data);

});

});
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req,res)=>{
    res.send("Server Running");
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});