const express = require("express");
const db = require("../db");
const verifyToken = require("../middleware/verifyToken");

const router = express.Router();
router.get("/me", verifyToken, async (req, res) => {
  try {

    const [users] = await db.query(
      "SELECT id, username, email, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json(users[0]);

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Server Error"
    });

  }
});

module.exports = router;