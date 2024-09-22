const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      throw new Error("Token is not valid");
    }
    const decodedJwt = await jwt.verify(token, "IamJustASecretKey");
    const { id } = decodedJwt;

    const user = await User.findById(id);
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).send("unauthorized");
    }
  } catch (e) {
    res.status(401).send(e.message);
  }
};

module.exports = { userAuth };
