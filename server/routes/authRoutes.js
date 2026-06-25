const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const verifyToken = require("../middleware/verifyToken");

const db = require("../db");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const [existingUser] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return res.status(400).json({
        message: "Email already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      "INSERT INTO users(username,email,password) VALUES(?,?,?)",
      [username, email, hashedPassword]
    );

    res.status(201).json({
      message: "User created successfully"
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server error"
    });
  }
});

router.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const [users] = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server error"
    });

  }

});
router.get("/profile", verifyToken, async (req, res) => {

    res.json({
        message: "Protected Route Accessed",
        user: req.user
    });

});

module.exports = router;