require("dotenv").config();
const PORT = process.env.PORT || 5000;
const http = require("http");
const express = require("express");
const cors = require("cors");
const app = express();
const server = http.createServer(app);
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

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