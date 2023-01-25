const Admin = require("../models/admin");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
exports.register = async (req, res) => {
  console.log(req.body);
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const admin = new Admin({
      email: req.body.email,
      name: req.body.name,
      mobile: req.body.mobile,
      password: hashedPassword,
    });
    await admin.save();
    res.status(200).json(true);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.signin = async (req, res) => {
  //   console.log("admiinniin dadad");
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required." });

  const foundUser = await Admin.findOne({ email }).exec();
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
    console.log(accessToken);

    res.json({ accessToken, id });
  } else {
    res.sendStatus(401);
  }
};

exports.block = async (req, res) => {
  console.log(req.body);
  try {
    const user = await User.findByIdAndUpdate(req.body.id, {
      $set: { verified: false },
    });
    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.unblock = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.body.id, {
      $set: { verified: true },
    });
    res.status(200).json({ message: "success" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
