"use strict";

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const resultsList = document.getElementById("results");
const tbrListElement = document.getElementById("tbrList");

let tbrList = JSON.parse(localStorage.getItem("tbrList")) || [];


if (searchForm && searchInput && resultsList) {
    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const query = searchInput.value.trim();
        if (!query) return;

        searchBooks(query);
    });
}

if (searchForm && searchInput && !resultsList) {
    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const query = searchInput.value.trim();
        if (!query) return;

        window.location.href = `index.html?q=${encodeURIComponent(query)}`;
    });
}

//Fetch books from Google API

async function searchBooks(query) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=25`;

    const response = await fetch(url);
    const data = await response.json();

    renderResults(data.items || []);
}

//Search Results

function renderResults(books) {
    if (!resultsList) 
        return;
    
    resultsList.innerHTML = "";

    books.forEach((book) => {
        const info = book.volumeInfo;

        const li = document.createElement("li");
        const alreadyInTBR = tbrList.some((b) => b.id === book.id);

        li.innerHTML = `
            ${info.imageLinks?.thumbnail ? `<img src="${info.imageLinks.thumbnail}" alt="${info.title}" />` : ""}
            <div class="book-info">
                <strong>${info.title || "Untitled"}</strong>
                ${info.authors ? `<small>by ${info.authors.join(", ")}</small>` : ""}
            </div>
            <button class="${alreadyInTBR ? "remove" : ""}">
            ${alreadyInTBR ? "Remove" : "Add to TBR"}
            </button>
        `;

        const button = li.querySelector("button");
        
        button.addEventListener("click", () => {
            const isInTBR = tbrList.some((b) => b.id === book.id);

            if (isInTBR) {
                removeFromTBR(book.id);
                button.textContent = "Add to TBR";
                button.classList.remove("remove");
            } else {
                addToTBR(book);
                button.textContent = "Remove";
                button.classList.add("remove");
            }
        });

        resultsList.appendChild(li);
    });
}

function addToTBR(book) {
    if (tbrList.find((b) => b.id === book.id))
        return;
    tbrList.push(book);
    localStorage.setItem("tbrList", JSON.stringify(tbrList));
}

function removeFromTBR(bookId) {
    tbrList = tbrList.filter((book) => book.id !== bookId);
    localStorage.setItem("tbrList", JSON.stringify(tbrList));
    renderTBR();
    console.log("Removing:", bookId);
}

function renderTBR() {
    if (!tbrListElement)
        return;

    tbrListElement.innerHTML = "";

    tbrList.forEach((book) => {
        const info = book.volumeInfo;

        const li = document.createElement("li");

        li.innerHTML = `
            ${info.imageLinks?.thumbnail ? `<img src="${info.imageLinks.thumbnail}" />` : ""}
            <strong>${info.title}</strong>
            ${info.authors ? `<small>by ${info.authors.join(", ")}</small>` : ""}
            <button type="button" class="remove">Remove</button>
        `;

        li.querySelector("button").addEventListener("click", () => {
            removeFromTBR(book.id);
        })

        tbrListElement.appendChild(li);
    });
}

renderTBR();

if (resultsList) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");

    if (query) {
        searchInput.value = query;
        searchBooks(query);
    }
}