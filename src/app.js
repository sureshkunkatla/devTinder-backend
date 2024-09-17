const express = require("express");

const app = express();

const { adminAuth, userAuth } = require("./middlewares/auth");

app.use("/admin", adminAuth);

app.get("/admin/getAllDetails", (req, res) => {
  res.send("All details sent");
});

app.get("/user/getAllUsers", userAuth, (req, res) => {
  throw new Error("Some is wrong");
  res.send("All Users details sent");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong");
  }
});

app.listen(3000, () => {
  console.log("Iam running on port 3000");
});
