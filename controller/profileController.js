const User = require("../models/user");
const mongoose = require("mongoose");

const userUpdate = async (req, res) => {
  console.log("wwwwwwwowoowowoowowo");

  const id = req.params.id;
  const user = await User.findById(id);
  console.log(req.body);

  try {
    const result = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      {
        upsert: true,
      }
    );

    res.status(200).json(true);
  } catch (err) {
    return res.status(500).json(err);
  }
};
module.exports = { userUpdate };
