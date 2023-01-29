const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) return res.sendStatus(401);
  console.log(authHeader);
  const token = authHeader.split(" ")[1];
  jwt.verify(token, "abcd1234", (err, decoded) => {
    if (err) return res.sendStatus(403);
    req.id = decoded.UserInfo.id;
    // console.log("this is from req ", req.id);
    next();
  });
};

module.exports = verifyJWT;
