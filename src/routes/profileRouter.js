const express = require("express");
const { userAuth } = require("../middlewares/auth");
const profileRouter = express();

profileRouter.get("/profile", userAuth, async (req, res) => {
  res.status(200).json({
    data: req.user,
  });
});

module.exports = profileRouter;
