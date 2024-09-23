const express = require("express");
const { userAuth } = require("../middlewares/auth");
const { userProfileUpdateValidation } = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const profileRouter = express();

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    res.status(200).json({
      data: req.user,
    });
  } catch (e) {
    res.status(400).send("Error:" + e);
  }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!userProfileUpdateValidation(req.body)) {
      throw new Error("Some of the fields are new or not editable");
    }

    const user = req.user;

    const updateUser = await User.findByIdAndUpdate(user._id, req.body, {
      returnDocument: "after",
    });

    res.status(200).json({
      data: updateUser,
    });
  } catch (e) {
    res.status(400).send("Error:" + e);
  }
});

profileRouter.patch("/updatePassword", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = req.user;

    const checkPassword = await user.validatePassword(oldPassword);

    if (checkPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await User.findByIdAndUpdate(
        user._id,
        { password: hashedPassword },
        {
          returnDocument: "after",
        }
      );

      res.status(200).send("password changed successfully");
    } else {
      res.status(500).send("old password is wrong");
    }
  } catch (e) {
    res.status(400).send("Error:" + e);
  }
});

module.exports = profileRouter;
