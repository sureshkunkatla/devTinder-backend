const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express();

requestRouter.get("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log(user.firstName + "sent a connection request");
  res.status(200).send(user.firstName + "sent a connection request");
});

module.exports = requestRouter;
