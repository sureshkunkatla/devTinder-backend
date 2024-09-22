const express = require("express");
const { connectToDB } = require("./config/database");
const User = require("./models/user");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const { userAuth } = require("./middlewares/auth");
const app = express();

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.get("/login", async (req, res) => {
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

app.get("/profile", userAuth, async (req, res) => {
  res.status(200).json({
    data: req.user,
  });
});

app.get("/user", userAuth, async (req, res) => {
  console.log(req.user);
  const response = await User.findById(req.body.userId);
  res.status(200).json({
    data: response,
  });
});

app.delete("/user", async (req, res) => {
  const response = await User.findByIdAndDelete(req.body.userId);
  res.status(200).json({
    data: response,
  });
});

app.get("/feed", async (req, res) => {
  const response = await User.find();
  res.status(200).json({
    data: response,
  });
});

app.get("/getUserByEmail", async (req, res) => {
  const response = await User.findOne(req.body);
  res.status(200).json({
    data: response,
  });
});

app.patch("/updateUser", async (req, res) => {
  const response = await User.findByIdAndUpdate(req.body.id, req.body, {
    returnDocument: "after",
    runValidators: true,
  });
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
