const User = require("../models/user");
const bcrypt = require("bcrypt");
const JWT = require("jsonwebtoken");
const mongoose = require("mongoose");
const landingPage = (req, res) => {
  res.json("this is landing page");
};
exports.landingPage = landingPage;
const posts = (req, res) => {
  res.json("this is post page");
};
exports.posts = posts;

const register = async (req, res) => {
  // console.log(req.body);
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const user = new User({
      email: req.body.email,
      name: req.body.name,
      mobile: req.body.mobile,
      followers: req.body.followers,
      password: hashedPassword,
      desc: req.body.desc,
      city: req.body.city,
      from: req.body.from,
    });
    await user.save();
    res.json({ status: true });
  } catch (error) {
    console.log(error);
  }
};
exports.register = register;

const signin = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    !user && res.status(404).json("user not found");
    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    !validPassword && res.status(400).json("invalid credential");

    res.status(200).json(user);
  } catch (err) {
    console.log(err);
  }
};
exports.signin = signin;

const removeAccount = async (req, res) => {
  if (req.body.id === req.params.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json("account succesfully deleted");
    } catch (err) {
      return res.status(500).json(err);
    }
  } else {
    return res.status(403).json("you can delete only your account");
  }
};
exports.removeAccount = removeAccount;
// console.log("clikkkekekekkdkdk");
const userGet = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
};
exports.userGet = userGet;

const followUser = async (req, res) => {
  if (req.body.id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);

      const currentUser = await User.findById(req.body.id);
      if (!user.followers.includes(req.body.id)) {
        await user.updateOne({ $push: { followers: req.body.id } });
        await currentUser.updateOne({ $push: { followins: req.params.id } });
        res.status(200).json("user has been followed");
      } else {
        res.status(403).json("you alredy followed this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant follow yourself");
  }
};
exports.followUser = followUser;

const unFollow = async (req, res) => {
  if (req.body.id !== req.params.id) {
    try {
      const user = await User.findById(req.params.id);

      const currentUser = await User.findById(req.body.id);
      if (user.followers.includes(req.body.id)) {
        await user.updateOne({ $pull: { followers: req.body.id } });
        await currentUser.updateOne({ $pull: { followins: req.params.id } });
        res.status(200).json("user has been unfollowed");
      } else {
        res.status(403).json("you do not follow this user");
      }
    } catch (err) {
      res.status(500).json(err);
    }
  } else {
    res.status(403).json("you cant unfollow yourself");
  }
};
exports.unFollow = unFollow;

const profile = async (req, res) => {
  try {
    const token = req.headers["x-custom-header"];
    // console.log(token);
    const decode = JWT.verify(token, "abcd1234");
    const id = mongoose.Types.ObjectId(decode.UserInfo.id);
    // console.log(id);

    const user = await User.findById(id);
    // console.log(user);
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
};

exports.profile = profile;
