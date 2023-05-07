const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");

const List = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      minlength: 5,
    },
    description: {
      type: String,
      required: true,
      minlength: 10,
    },
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = List;
