const express = require("express");
const { connectToDB } = require("./config/database");
const cookieParser = require("cookie-parser");
const app = express();

const authRouter = require("./routes/authRouter");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const userRouter = require("./routes/userRouter");

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/profile", profileRouter);
app.use("/request", requestRouter);
app.use("/user", userRouter);

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
