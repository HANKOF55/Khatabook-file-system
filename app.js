const express = require("express");
const app = express();
const path = require("path");
const fs = require("fs");

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended : true }));

app.get("/", ( req, res ) => {
    fs.readdir("./files", (err, files) => {
        res.render("index", {files})
    })
});

app.post("/update/:filename", (req, res) => {
    fs.writeFile(`./files/${req.params.filename}`, req.body.filedata, (err) => {
        if(err) {
            res.send("<h1>Something went wrong!</h1>"); 
            console.log(err);
        }
        else res.redirect("/");
    })
})

app.get("/edit/:filename", (req, res) => {
    fs.readFile(`./files/${req.params.filename}`, "utf-8",  (err, data) => {
        if(err) res.send(err);
        else res.render("edit", {data, filename: req.params.filename});
    })
})

app.get("/delete/:file", (req, res) => {
    fs.unlink(`./files/${req.params.file}`, (err) => {
        if(err){
            res.send("Something went wrong!");
            console.log(err);
        }
        else{
            res.redirect("/");
        }
    })
})

app.get("/createfile", ( req, res) => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const date = `${day}-${month}-${year}`

    fs.writeFile( `./files/${date}`, `This file has been created on ${date}`, (err) => {
        if(err){
            res.send("<h1>Something went wrong!</h1>");
            console.log(err);
        } 
        else res.redirect("/");
    })
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});