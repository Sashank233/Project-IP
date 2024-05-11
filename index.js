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

let array = [];

app.get("/getData", (req, res) => {
  let x = req.query;
  array = JSON.parse(  fs.readFileSync("./login.json", "utf-8") );
    array.push(x);
    fs.writeFileSync("./login.json", JSON.stringify(array));
    console.log("Data received successfully");
    res.setHeader("Content-Type", "text/html");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end("<h1>Data received successfully</h1>");
});

app.post("/xyz", (req, res) => {
  let arrayofObj = JSON.parse(fs.readFileSync("./login.json", "utf-8"));
  let c = 0;
  arrayofObj.forEach((obj) => {
    if (obj.fullname == req.body.username && obj.password == req.body.password) {
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















//! for multer
const multer = require('multer');
const abc = multer.diskStorage({
    destination: './upload',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})
const upload = multer({
    storage: abc,
});
let arr = [];





app.get('/addpost',  (req, res) => {
    res.sendFile('./addpost.html', { root: './' });
})




app.get('/favicon.ico', (req, res) => {
    res.writeHead(204);
    res.end();
})

let uniqueid;

app.post('/fileUpload', upload.single('image'), (req, res) => {
    console.log(req.file);
    if (!req.file) {
      return res.status(400).send('No file uploaded.');
  }

    let data = req.body;
    uniqueid = JSON.parse(fs.readFileSync('./pid.json', 'utf-8'));
    uniqueid.pid++;
    fs.writeFileSync('./pid.json', JSON.stringify(uniqueid));
    let obj = {
        "pid": uniqueid.pid,
        "title": data.title,
        "desc": data.desc,
        "Date": new Date().toLocaleString(),
        "image_url": req.file.destination + '/' + req.file.filename
    }
    console.log(data);
    arr = JSON.parse(fs.readFileSync('./article.json', 'utf-8'));

    arr.push(obj);
    fs.writeFileSync('./article.json', JSON.stringify(arr));
    res.redirect('/home')
})

app.get('/getPosts', (req, res) => {
    const posts = JSON.parse(fs.readFileSync('./article.json', 'utf-8'));
    res.json(posts);
});



app.get('/postTable', (req, res) => {
    const post = JSON.parse(fs.readFileSync('./article.json', 'utf-8'));
    res.json(post);
})

app.get('/dashboard', (req, res) => {
    res.sendFile('./dashboard.html', { root: './' })
})


app.get('/home', (req, res) => {
    res.sendFile('./home.html', { root: './' })
})




app.use((req, res) => {
  res.setHeader("Content-Type", "text/html");
  res.status(404).send("<h1>404 not found</h1>");
});



























//This is using session code 


// const express = require('express');
// const session = require('express-session');
// const { error } = require('console');
// const app = express();
// const fs = require('fs');
// const { exit } = require('process');
// const { json } = require('stream/consumers');


// // Set up session middleware
// app.use(session({
//     secret: 'your_secret_key',
//     resave: false,
//     saveUninitialized: true
// }));

// // Middleware to parse JSON bodies
// app.use(express.json());
// app.use(express.static("./"));

// app.get('/index.html', (req, res) => {
//     res.setHeader("Content-Type", "text/html");
//     let data = fs.readFileSync("./index.html");
//     res.end(data);
// });

// app.get('/signin.html', (req, res) => {
//     res.setHeader("Content-Type", "text/html");
//     let data = fs.readFileSync("./signin.html");
//     res.end(data);
// });

// // Signup endpoint
// app.get('/signup', (req, res) => {
//     // Your signup logic here
    
//     // Assuming signup is successful
//     req.session.isLoggedIn = true; // Set session variable after signup
//     res.send('Signup successful');
// });

// // Login endpoint
// app.get('/login', (req, res) => {
//     if (!req.session.isLoggedIn) {
//         res.status(401).send('You need to signup first.');
//     } else {
//         // Your login logic here
//         res.send('Login successful');
//     }
// });

// app.get('/getData', (req, res) => {
//     if (!req.session.isLoggedIn) {
//         res.status(401).send('You need to signup first.');
//         return;
//     }
//     let { fullname, email, password } = req.query;
//     let array = [];
//     let data = fs.readFileSync('./login.json', 'utf-8');
//     array = JSON.parse(data);

//     // Check if user already exists
//     let userExists = array.some(item => item.fullname === fullname && item.email === email);

//     if (userExists) {
//         console.log("User already exists");
//         res.setHeader("Content-Type", "application/json");
//         res.setHeader('Access-Control-Allow-Origin', '*');
//         res.end(JSON.stringify({ exists: true }));
//     } else {
//         array.push({ fullname, email, password });
//         fs.writeFileSync('./login.json', JSON.stringify(array));
//         console.log("Data received successfully");
//         res.setHeader("Content-Type", "application/json");
//         res.setHeader('Access-Control-Allow-Origin', '*');
//         res.end(JSON.stringify({ exists: false }));
//     }
// });

// app.get('/xyz', (req, res) => {
//     if (!req.session.isLoggedIn) {
//         res.status(401).send('You need to signup first.');
//         return;
//     }
//     let arrayofObj = JSON.parse(fs.readFileSync('./login.json', 'utf-8'));
//     let username = req.query.username;
//     let password = req.query.password;
//     let user = arrayofObj.find(obj => obj.fullname === username && obj.password === password);
    
//     if (user) {
//         res.setHeader("Content-Type", "application/json");
//         res.setHeader('Access-Control-Allow-Origin', '*');
//         res.json({ message: "login successful", user: user });
//     } else {
//         res.setHeader("Content-Type", "application/json");
//         res.setHeader('Access-Control-Allow-Origin', '*');
//         res.send(json({ message: "login not successful" }));
//     }
// });

// // Route to handle form submissions and save data to contact.json
// app.post('/submit', (req, res) => {
//     if (!req.session.isLoggedIn) {
//         res.status(401).send('You need to signup first.');
//         return;
//     }
//     const contactData = req.body; // Get the data from the request body

//     // Load existing contact data from contact.json
//     let contactArray = [];
//     if (fs.existsSync('./contact.json')) {
//         contactArray = JSON.parse(fs.readFileSync('./contact.json', 'utf-8'));
//     }

//     // Add the new contact data to the array
//     contactArray.push(contactData);

//     // Save the updated array back to contact.json
//     fs.writeFileSync('./contact.json', JSON.stringify(contactArray, null, 2));

//     // Respond with a success message
//     res.setHeader("Content-Type", "application/json");
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.status(200).send({ message: "We will contact you soon." });
// });

// app.get('/change', (req, res) => {
//     if (!req.session.isLoggedIn) {
//         res.status(401).send('You need to signup first.');
//         return;
//     }
//     let arrayofObj = JSON.parse(fs.readFileSync('./login.json', 'utf-8'))
//     arrayofObj.forEach((obj) => {
//         if (obj.uname == req.query.uname) {
//             obj.password = req.query.password
//             const updatedData = JSON.stringify(arrayofObj);
//             fs.writeFileSync('./login.json', updatedData, 'utf-8');
//             res.setHeader("Content-Type", "application/json");
//             res.setHeader('Access-Control-Allow-Origin', '*');
//             res.end(JSON.stringify({ message: "Password changed" }))
//         }
//     })
// });

// app.use((req, res) => {
//     res.setHeader("Content-Type", "text/html");
//     res.status(404).send("<h1>404 not found</h1>");
// });

// app.listen(1010, () => {
//     console.log("server started 1010");
// });
