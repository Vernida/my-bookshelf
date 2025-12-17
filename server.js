"use strict";

import express from "express";
const app = express();
const port = 8080;

let tbrList = [];

app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
    console.log("Press Ctrl+C to end this process.");
});


// API: Get TBR List
app.get("/api/tbr", (req, res) => {
    res.json(tbrList);
});

//Add book
app.post("/api/tbr", (req, res) => {
    const book = req.body;

    if (!tbrList.find(b => b.id === book.id)) {
        tbrList.push(book);
    }
    res.json({success: true});
});

//Remove book
app.delete("/api/tbr/:id", (req, res) => {
    tbrList = tbrList.filter(book => book.id !== req.params.id);
    res.json({success: true});
});
