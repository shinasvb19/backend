const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const handleLogin = async (req, res) => {
  const cookies = req.cookies;

  // console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  const foundUser = await User.findOne({ email, verified: true }).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized
  // console.log(foundUser);
  const id = foundUser.id;

  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    const accessToken = jwt.sign(
      {
        UserInfo: {
          id: foundUser.id,
        },
      },
      "abcd1234",
      { expiresIn: "5d" }
    );
    // console.log(accessToken);
    const newRefreshToken = jwt.sign({ id: foundUser.id }, "abcd1234", {
      expiresIn: "60s",
    });

    // Changed to let keyword
    let newRefreshTokenArray = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rt) => rt !== cookies.jwt);

    if (cookies?.jwt) {
      const refreshToken = cookies.jwt;
      const foundToken = await User.findOne({ refreshToken }).exec();

      if (!foundToken) {
        newRefreshTokenArray = [];
      }

      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    }

    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();

    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken, id });
  } else {
    res.sendStatus(401);
  }
};

const refreshToken = async (req, res) => {
  console.log("hello");
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401);
  const refreshToken = cookies.jwt;
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

  const foundUser = await User.findOne({ refreshToken }).exec();

  // Detected refresh token reuse!
  if (!foundUser) {
    jwt.verify(refreshToken, "abcd1234", async (err, decoded) => {
      if (err) return res.sendStatus(403);
      const hackedUser = await User.findOne({
        id: decoded.id,
      }).exec();
      hackedUser.refreshToken = [];
      const result = await hackedUser.save();
    });
    return res.sendStatus(403); //Forbidden
  }

  const newRefreshTokenArray = foundUser.refreshToken.filter(
    (rt) => rt !== refreshToken
  );

  jwt.verify(refreshToken, "abcd1234", async (err, decoded) => {
    if (err) {
      foundUser.refreshToken = [...newRefreshTokenArray];
      const result = await foundUser.save();
    }
    if (err || foundUser.id !== decoded.id) return res.sendStatus(403);

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: decoded.id,
        },
      },
      "abcd1234",
      { expiresIn: "5d" }
    );
    S;
    const newRefreshToken = jwt.sign({ id: foundUser.id }, "abcd1234", {
      expiresIn: "15s",
    });
    // Saving refreshToken with current user
    foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
    const result = await foundUser.save();

    // Creates Secure Cookie with refresh token
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.json({ accessToken });
  });
};
module.exports = { handleLogin, refreshToken };
