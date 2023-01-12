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

  const foundUser = await User.findOne({ email }).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized
  console.log(foundUser);
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
      { expiresIn: "15m" }
    );
    console.log(accessToken);
    const newRefreshToken = jwt.sign({ id: foundUser.id }, "abcd1234", {
      expiresIn: "1d",
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

module.exports = { handleLogin };
