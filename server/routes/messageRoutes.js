const express = require("express");
const router = express.Router();
const db = require("../db");
const verifyToken = require("../middleware/verifyToken");
router.get("/:receiverId", verifyToken, async (req, res) => {

    console.log("Route hit");

    try {

        const senderId = req.user.id;
        const receiverId = req.params.receiverId;

        console.log(senderId, receiverId);

        const [result] = await db.query(
            `
            SELECT *
            FROM messages
            WHERE
            (sender_id = ? AND receiver_id = ?)
            OR
            (sender_id = ? AND receiver_id = ?)
            ORDER BY created_at ASC
            `,
            [
                senderId,
                receiverId,
                receiverId,
                senderId
            ]
        );

        console.log(result);

        res.json(result);

    } catch (error) {

        console.log(error);

        res.status(500).json({ message: "Server Error" });

    }

});
module.exports = router;