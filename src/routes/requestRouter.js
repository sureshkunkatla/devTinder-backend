const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
const requestRouter = express();

requestRouter.post("/send/:status/:userId", userAuth, async (req, res) => {
  try {
    const { status, userId } = req.params;
    //check and keep the status should be interested or ignored

    const allowedStatus = ["interested", "ignored"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).send("Invalid status");
    }
    //check the userId in db
    const requestUserValidation = await User.findById(userId);
    if (!requestUserValidation) {
      return res
        .status(400)
        .send("Request failed, requested user does not exists");
    }
    //check for existing connection request
    const existingConnectionRequest = await ConnectionRequest.findOne({
      $or: [
        { fromUserId: req.user._id, toUserId: userId },
        { fromUserId: userId, toUserId: req.user._id },
      ],
    });

    if (existingConnectionRequest) {
      return res
        .status(200)
        .json({ message: "Connection request already exists" });
    }
    //check self requesting userid

    const saveConnection = await ConnectionRequest.create({
      fromUserId: req.user._id,
      toUserId: userId,
      status: status,
    });
    console.log(saveConnection);
    res.status(200).send(req.user.firstName + "sent a connection request");
  } catch (e) {
    console.log("ERROR:" + e.message);
    res.status(400).send(e.message);
  }
});

requestRouter.post("/review/:status/:requestId", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;
    const { status, requestId } = req.params;

    //check and keep the status should be accepted or rejected
    const allowedStatus = ["accepted", "rejected"];
    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Status is not allowed" });
    }

    const connectionRequest = await ConnectionRequest.findOne({
      _id: requestId,
      toUserId: loggedinUser._id,
      status: "interested",
    });

    if (!connectionRequest) {
      return res.status(404).json({ message: "Connection request not found" });
    }

    const updateConnectionReq = await ConnectionRequest.findByIdAndUpdate(
      requestId,
      {
        status: status,
      },
      {
        returnDocument: "after",
      }
    );

    res.status(200).json({
      message: "Connection request " + status,
      data: updateConnectionReq,
    });
  } catch (e) {
    console.log("ERROR:" + e.message);
    res.status(400).send(e.message);
  }
});

module.exports = requestRouter;
