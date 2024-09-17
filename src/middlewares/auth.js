const adminAuth = (req, res, next) => {
  const token = "abc";
  const validateToken = token === "ab";
  if (validateToken) {
    next();
  } else {
    res.status(401).send("unauthorized");
  }
};

const userAuth = (req, res, next) => {
  const token = "abc";
  const validateToken = token === "abc";
  if (validateToken) {
    next();
  } else {
    res.status(401).send("unauthorized");
  }
};

module.exports = { adminAuth, userAuth };
