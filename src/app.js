const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("I am dashboard");
});

app.get("/test", (req, res) => {
  res.send("I am test");
});

app.get("/hello", (req, res) => {
  res.send("I am Hello");
});

app.listen(3000, () => {
  console.log("Iam running on port 3000");
});
