const mongoose = require("mongoose");
const toDoListSchema = require("../Schema/toDoSchema");

const createDocument = async () => {
  try {
    const user = new mongoose.model("toDoList", toDoListSchema);
  } catch (err) {
    res.status(404).send({
      status: 404,
      message: "Database Not Found",
    });
  }
};

createDocument();

module.exports = mongoose.model("toDoList", toDoListSchema);
