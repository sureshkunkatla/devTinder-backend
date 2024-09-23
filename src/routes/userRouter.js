const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

const userRouter = express.Router();

const USER_SAFE_DATA = "firstName lastName age gender profileURL skills about";

userRouter.get("/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.status(200).json({
      data: connectionRequests,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error" + e.message });
  }
});

userRouter.get("/connections", userAuth, async (req, res) => {
  try {
    const loggedinUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedinUser._id,
          status: "accepted",
        },
        {
          fromUserId: loggedinUser._id,
          status: "accepted",
        },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.equals(loggedinUser._id)) {
        return row.toUserId;
      } else {
        return row.fromUserId;
      }
    });

    res.status(200).json({ data });
  } catch (e) {
    res.status(400).send({ message: e.message });
  }
});

module.exports = userRouter;
