const express = require('express');
const fs = require('fs');
const app = express();
app.listen(1010,()=>{
    console.log("server started 1010");
})
// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.static("./"));
app.get('/index.html', (req, res) => {
    res.setHeader("Content-Type", "text/html");
    let data = fs.readFileSync("./index.html");
    res.end(data);
});

app.get('/signin.html', (req, res) => {
    res.setHeader("Content-Type", "text/html");
    let data = fs.readFileSync("./signin.html");
    res.end(data);
});


app.get('/getData', (req, res) => {
    let x = req.query;
    let array = [];
    let data = fs.readFileSync('./login.json', 'utf-8');
    array = JSON.parse(data);
    array.push(x);
    res.setHeader("Content-Type", "text/html");
    res.setHeader('Access-Control-Allow-Origin', '*');
    fs.writeFileSync('./login.json', JSON.stringify(array));
    res.end("Data received successfully");
});

app.get('/xyz', (req, res) => {
    let arrayofObj = JSON.parse(fs.readFileSync('./login.json', 'utf-8'));
    let c = 0;
    arrayofObj.forEach((obj) => {
        if (obj.fullname == req.query.username && obj.password == req.query.password) {
            c = 1;
            res.setHeader("Content-Type", "application/json");
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify({ message: "login successful" }));
        }
    });
    if (c === 0) {
        res.setHeader("Content-Type", "application/json");
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(JSON.stringify({ message: "login not successful" }));
    }
});


app.get('/forget', (req, res) => {
    let arrayofObj = JSON.parse(fs.readFileSync('./login.json', 'utf-8'))
    arrayofObj.forEach((obj) => {
        if (obj.uname == req.query.uname) {
            res.setHeader("Content-Type", "application/json");
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify({ message: "login successful" }))
        }
    })
});

app.get('/change', (req, res) => {
    let arrayofObj = JSON.parse(fs.readFileSync('./login.json', 'utf-8'))
    arrayofObj.forEach((obj) => {
        if (obj.uname == req.query.uname) {
            obj.password = req.query.password
            const updatedData = JSON.stringify(arrayofObj);
            fs.writeFileSync('./login.json', updatedData, 'utf-8');
            res.setHeader("Content-Type", "application/json");
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.end(JSON.stringify({ message: "Password changed" }))
        }
    })
});

app.use((req, res) => {
    res.setHeader("Content-Type", "text/html");
    res.status(404).send("<h1>404 not found</h1>");
});


