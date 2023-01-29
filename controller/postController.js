const Post = require("../models/post");
const User = require("../models/user");
const mongoose = require("mongoose");
const posts = async (req, res) => {
  const newPost = new Post({
    url: req.body.url,
    desc: req.body.desc,
    userId: req.params.id,
  });

  try {
    const savePost = await newPost.save();
    res.status(200).json(savePost);
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};
exports.posts = posts;

const getPosts = async (req, res) => {
  console.log("hello");
  try {
    const skip = req.query.skip ? Number(req.query.skip) : 0;
    const DEFAULT_LIMIT = 8;

    const data = await Post.aggregate([
      {
        $sort: { createdAt: -1 },
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "details",
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: DEFAULT_LIMIT,
      },
    ]);
    // console.log(data);
    res.status(200).json({ data });
  } catch (err) {
    res.status(500).json(err);
    console.log(err);
  }
};
exports.getPosts = getPosts;

const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.body.id);
    // console.log(post);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      const updatedPost = await Post.findById(req.body.id);
      res.status(200).json({ updatedPost });
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      const updatedPost = await Post.findById(req.body.id);
      res.status(200).json({ updatedPost });
    }
  } catch (err) {
    console.log(err);
  }
};
exports.likePost = likePost;

const commentPost = async (req, res) => {
  // console.log(req.body);

  try {
    const post = await Post.findById(req.body.id);
    // console.log(post);
    const { id, comment } = req.body;
    const userId = mongoose.Types.ObjectId(req.body.userId);
    const comments = { userId: userId, comment: comment };
    await post.updateOne({ $push: { comments: comments } });
    const updatedPost = await Post.findById(req.body.id);
    res.status(200).json({ updatedPost });
  } catch (err) {
    res.status(500).json({ err });
  }
};
exports.commentPost = commentPost;

const commentGet = async (req, res) => {
  // console.log(req.query);
  const id = mongoose.Types.ObjectId(req.query.id);
  try {
    const data = await Post.aggregate([
      { $match: { _id: id } },
      { $unwind: "$comments" },
      {
        $project: {
          user: "$comments.userId",
          comment: "$comments.comment",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "foundUser",
        },
      },
    ]);
    const comment = data;
    // console.log(comment);

    res.status(200).json(comment);
  } catch (err) {
    res.status(500).json({ err });
    console.log(err);
  }
};
exports.commentGet = commentGet;
