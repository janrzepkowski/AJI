const express = require("express");
const mongoose = require("mongoose");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from Node API");
});

mongoose
  .connect(
    "mongodb+srv://janrzepkowski21:iRResdFwmxYs6hsr@cluster0.svxj9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {}
  )
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
        console.log("Server is running on port 3000");
      });
  })
  .catch((err) => {
    console.log("Error: ", err);
  });
