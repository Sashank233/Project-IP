const express = require("express");
const fs = require("fs");
const { exit } = require("process");
const { json } = require("stream/consumers");
const app = express();
app.listen(1010, () => {
  console.log("server started 1010");
});
// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static("./"));
app.get("/index.html", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  let data = fs.readFileSync("./index.html");
  res.end(data);
});

app.get("/signin.html", (req, res) => {
  res.setHeader("Content-Type", "text/html");
  let data = fs.readFileSync("./signin.html");
  res.end(data);
});

app.get("/getData", (req, res) => {
  let x = req.query;
  let array = [];
  let data = fs.readFileSync("./login.json", "utf-8");
  array = JSON.parse(data);

  // Check if user already exists
  let userExists = array.some((item) => item.username === x.username);

  if (userExists) {
    console.log("User already exists");
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(json.stringify({ exits: already }));
  } else {
    array.push(x);
    fs.writeFileSync("./login.json", JSON.stringify(array));
    console.log("Data received successfully");
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end("Data received successfully");
  }
});

app.get("/xyz", (req, res) => {
  let arrayofObj = JSON.parse(fs.readFileSync("./login.json", "utf-8"));
  let c = 0;
  arrayofObj.forEach((obj) => {
    if (
      obj.fullname == req.query.username &&
      obj.password == req.query.password
    ) {
      c = 1;
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.end(JSON.stringify({ message: "login successful" }));
    }
  });
  if (c === 0) {
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(JSON.stringify({ message: "login not successful" }));
  }
});

app.get("/forget", (req, res) => {
  let arrayofObj = JSON.parse(fs.readFileSync("./login.json", "utf-8"));
  arrayofObj.forEach((obj) => {
    if (obj.uname == req.query.uname) {
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.end(JSON.stringify({ message: "login successful" }));
    }
  });
});
// Route to handle form submissions and save data to contact.json
app.post("/submit", (req, res) => {
  const contactData = req.body; // Get the data from the request body

  // Load existing contact data from contact.json
  let contactArray = [];
  if (fs.existsSync("./contact.json")) {
    contactArray = JSON.parse(fs.readFileSync("./contact.json", "utf-8"));
  }

  // Add the new contact data to the array
  contactArray.push(contactData);

  // Save the updated array back to contact.json
  fs.writeFileSync("./contact.json", JSON.stringify(contactArray, null, 2));

  // Respond with a success message
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.status(200).send({ message: "We will contact you soon." });
});

app.get("/change", (req, res) => {
  let arrayofObj = JSON.parse(fs.readFileSync("./login.json", "utf-8"));
  arrayofObj.forEach((obj) => {
    if (obj.uname == req.query.uname) {
      obj.password = req.query.password;
      const updatedData = JSON.stringify(arrayofObj);
      fs.writeFileSync("./login.json", updatedData, "utf-8");
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.end(JSON.stringify({ message: "Password changed" }));
    }
  });
});

app.use((req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(404).send("<h1>404 not found</h1>");
});
