require("dotenv").config();
require("../src/DbConnection/Connection");
const express = require("express");
const app = express();

//task routing file
const taskRoute = require("../src/Routing/toDoRouting");

// user routing files
const userRoute = require("../src/Routing/userRouting");

app.use(userRoute);
app.use(taskRoute);

app.use(express.json());

app.listen(3000, () => {
  console.log("Server running on port-3000");
});
