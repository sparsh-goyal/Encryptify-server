const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Credentials", true);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.header("Access-Control-Allow-Methods", "GET, POST");
  next();
});

app.listen(5000, () => `Server running on port 5000`);

app.get("/", (_, res) => {
  res.sendFile(__dirname + "/homepage.html");
});

app.get("/upload", (req, res) => {
  console.log(req.body.data);
});