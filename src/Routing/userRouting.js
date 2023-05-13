const express = require("express");
const user = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = require("../Schema/userSchema.js");
const userModel = require("../Models/userModel.js");

user.use(express.json());

user.post("/", async (req, res) => {
  if (
    !req.body.name ||
    !req.body.lastname ||
    !req.body.email ||
    !req.body.username ||
    !req.body.password ||
    !req.body.password ||
    !req.body.age ||
    !req.body.gender ||
    !req.body.mobile
  ) {
    return res.status(400).send({
      statusCode: 400,
      message: "All Fields are Required",
    });
  } else {
      try {
      const cryptingPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = await userModel.create({
        username: req.body.username,
        password: cryptingPassword,
        name: req.body.name,
        lastname: req.body.lastname,
        age: req.body.age,
        gender: req.body.gender,
        mobile: req.body.mobile,
        email: req.body.email,
      });
      newUser.save();
      return res.status(201).send({
        statusCode: 201   ,
        message: "User Registered Successfully",
      });
      }
      catch (err){
        res.status(400).send({
          message: "Something Went Wrong",
          statusCode: 400,
        });
      }
    }
  })

user.get("/", async (req, res) => {
  try {
    const searchingUsers = await userModel.find();
    res.send(searchingUsers);
  } catch (e) {
    res.status(400).send({
      statusCode: 400,
      message: "User Not Found",
    });
  }
});

user.patch("/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send({
        statusCode: 400,
        message: "Unable to find User",
      });
    } else {
      const id = req.params.id;
      const updateUser = await user.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      res.status(200).send({
        statusCode: 200,
        message: "User Updated Successfully",
      });
    }
  } catch (e) {
    res.status(400).send({
      statusCode: 400,
      message: "Unable to Update User, User Not Found",
    });
  }
});

user.delete("/:id", async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).send({
        statusCode: 400,
        message: "No User found",
      });
    } else {
      const deleteUser = await user.findByIdAndDelete(req.params.id);
      res.status(200).send({
        statusCode: 200,
        message: "User Deleted Successfully",
      });
    }
  } catch (err) {
    res.status(400).send({
      statusCode: 400,
      message: "Unable to delete User",
    });
  }
});

user.post("/login", async (req, res) => {
  try {
    const enteredUsername = req.body.username;
    const enteredPassword = req.body.password;

    const userName = await userModel.findOne({ username: enteredUsername });
    if (!userName) {
      return res.status(404).send({
        statusCode: 404,
        message: "User Not Found",
      });
    } else {
      const isMatch = await bcrypt.compare(enteredPassword, userName.password);
      const createJWT = jwt.sign(
        { _id: userName._id },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      console.log(createJWT);
      res.status(200).send({
        token: createJWT,
        status: "You are Logged-in Successfully",
      });
    }
  } catch (e) {
    res.status(400).send({
      statusCode: 400,
      message: "Wrong Credentials",
    });
  }
});

module.exports = user;
