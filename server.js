"use strict";

import express from "express";
const app = express();
const port = 8080;

import path from "path";
import { fileURLToPath } from "url";
import fs from "fs/promises";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const booksFilePath = path.join(
    __dirname,
    "data",
    "books.json"
);

app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.listen(port, () => {
    console.log(`Server is running http://localhost:${port}`);
    console.log("Press Ctrl+C to end this process.");
});


// API: Get TBR List
app.get("/api/tbr", async (req, res) => {
    const bookData = await fs.readFile(booksFilePath);
    const books = JSON.parse(bookData);

    res.json(books);
});

//Add book
app.post("/api/tbr", async (req, res) => {
    const book = req.body;

    const bookData = await fs.readFile(booksFilePath);
    const books = JSON.parse(bookData);

    if (!books.find(b => b.id === book.id)) {
        books.push(book);

        await fs.writeFile(booksFilePath, JSON.stringify(books));
    }

    res.json(book);
});

//Remove book
app.delete("/api/tbr/:id", async (req, res) => {
    const bookData = await fs.readFile(booksFilePath);
    const books = JSON.parse(bookData);

    const newBookList = books.filter(book => book.id !== req.params.id);
    await fs.writeFile(booksFilePath, JSON.stringify(newBookList))

    res.json({success: true});
});