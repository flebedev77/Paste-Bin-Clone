const fs = require("fs");
const ejs = require("ejs");
const express = require("express");
const app = express();

app.use(express.static("client"))
app.set("view engine", "ejs")
app.use(express.json());

let avaliableTokens = [];

fs.readdir(__dirname + "/data", (err, files) => {
    if (err) {
        console.error(err);
    }

    files.forEach((file) => {
        avaliableTokens.push(file);
    })
})

app.get("/pastes/:token", (req, res) => {
    for (let i = 0; i < avaliableTokens.length; i++) {
        if (avaliableTokens[i] == req.params.token) {
            fs.readFile(__dirname + "/data/" + req.params.token, (err, buffer) => {
                if (err) {
                    console.error(err);
                    return;
                }

                res.render("paste", { paste: buffer })
            })
            break;
        }
    }
})

app.post("/submit-paste", (req, res) => {
    if (req.body.paste == undefined || req.body.paste.toString().trim() == "") {
        res.json({ ok: false, url: null });
    }

    if (!fs.existsSync(__dirname + "/data")) {
        fs.mkdirSync(__dirname + "/data");
    }

    const token = getToken(10);

    if (!fs.existsSync(__dirname + "/data/" + token)) {
        fs.writeFile(__dirname + "/data/" + token, req.body.paste, (err) => {
            if (err) {
                console.error(err);
            }
        });
        avaliableTokens.push(token);
        res.json({ ok: true, url: "http://localhost:3000/pastes/" + token });
    } else {
        res.json({ ok: false, url: null });
    }
})

app.listen(3000, console.log("Server listening on port 3000"));

function getToken(len) {
    let letters = "abcdefghijklmnopqrstuvwxyzABDCEFGHIJKLMNOPQRSTUV";
    let str = "";
    for (let i = 0; i < len; i++) {
        str += letters.charAt(Math.round(Math.random() * letters.length));
    }

    return str;
}