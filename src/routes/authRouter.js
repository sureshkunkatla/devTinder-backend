const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const authRouter = express();

authRouter.post("/signup", async (req, res) => {
  try {
    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const response = await User.create({
      ...req.body,
      password: hashedPassword,
    });
    res.status(200).json({
      data: response,
    });
  } catch (e) {
    res.status(500).send(e);
  }
});

authRouter.get("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });

    if (!user) {
      res.status(400).send("User not found");
    }

    const checkPassword = await user.validatePassword(password);

    if (checkPassword) {
      const token = await user.getJwt();
      res.cookie("token", token, { expires: new Date(Date.now() + 86400000) });
      res.status(200).send("Login successful");
    } else {
      res.status(400).send("Invaild credintials");
    }
  } catch (e) {
    res.status(500).send("Error" + e);
  }
});

authRouter.get("/logout", async (req, res) => {
  try {
    res.cookie("token", null, { expires: new Date(Date.now()) });
    res.status(200).send("Logout successful");
  } catch (e) {
    res.status(500).send("Error" + e);
  }
});

module.exports = authRouter;
