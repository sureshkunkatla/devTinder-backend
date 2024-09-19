const express = require("express");
const { connectToDB } = require("./config/database");
const User = require("./models/user");

const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
  const response = await User.create(req.body);
  res.status(200).json({
    data: response,
  });
});

connectToDB()
  .then(() => {
    console.log("db connection success");
    app.listen(3000, () => {
      console.log("Iam running on port 3000");
    });
  })
  .catch((e) => {
    console.log("db connection is unsuccessful");
  });
