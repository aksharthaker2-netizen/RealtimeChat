require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req,res)=>{
    res.send("Server Running");
});

app.listen(process.env.PORT, ()=>{
    console.log("Server Started");
});
