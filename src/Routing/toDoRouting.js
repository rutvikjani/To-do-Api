const express = require("express");
const app = express();
const task = require("../Models/toDoModel");
const { decode } = require("punycode");
const { config } = require("dotenv");
const jwt = require("jsonwebtoken");
const user = require("../Schema/toDoSchema.js");

app.post("/", async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).send({
        statusCode: 401,
        message: "Unauthorised user",
      });
    } else {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const newTask = await task.create({
        title: req.body.title,
        description: req.body.description,
        userID: decoded._id,
      });
      newTask.save();
      return res.status(201).send({
        statusCode: 201,
        message: "Task Created Successfully",
      });
    }
  } catch (err) {
    return res.status(400).send({
      message: "Something went wrong",
      statusCode: 400,
    });
  }
});

app.get("/", async (req, res) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).send({
        statusCode: 401,
        message: "Unauthorised User",
      });
    } else {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const searchingTask = await task.find({ userID: decoded._id });
      return res.status(200).send({
        taskList: searchingTask,
      });
    }
  } catch (err) {
    return res.status(400).send({
      statusCode: 400,
      message: "Unable to find task",
    });
  }
});

app.patch("/:id", async (req, res) => {
  try {
    const token = req.headers.token;
    const id = req.params.id;
    if (!token ) {
      return res.status(401).send({
        statusCode: 401,
        message: "Unable to find Task",
      });
    } else {
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      const searchingTask = await task.find({ userID: decoded._id });
      res.status(200).send({
        statusCode: 200,
        message: searchingTask,
      });
      if (id) {
        const updateTask = await task.findByIdAndUpdate(id, req.body, {
          new: true,
        });
        return res.status(200).send({
          updatedTask: "Your Task is successfully updated",
        });
      }
    }
  } catch (err) {
    return res.status(400).send({
      statusCode: 400,
      message: "Task Not Found",
    });
  }
});

app.delete("/:id", async (req, res) => {
  try {
    const token = req.headers.token;
    const id = req.params.id;
    if (!token) {
      return res.status(401).send({
        statusCode: 401,
        message: "Unable to find Task",
      });
    } else {
      const decoded = await jwt.verify(token, process.env.SECRET_KEY);
      const deletingTask = await task.find({ userID: decoded._id });
      res.status(200).send({
        statusCode: 200,
        message: "Task deleted successfully",
      });
      if (id) {
        const deleteTask = await task.findByIdAndDelete(id);
        res.status(200).send({
          statusCode: 200,
          message: "Task Deleted SuccessFully",
        });
      }
    }
  } catch (err) {
    return res.status(400).send({
      statusCode: 400,
      message: "Something went wrong",
    });
  }
});

module.exports = app;
