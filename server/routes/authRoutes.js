const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.loginUser);
router.post("/register", authController.registerUser);
router.post("/check-username", authController.checkUsername);

router.get("/login", (req, res) => {
  res.status(405).json({ error: "Method Not Allowed" });
});

module.exports = router;
