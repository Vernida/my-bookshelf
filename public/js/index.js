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
            <button ${alreadyInTBR ? "disabled" : ""}>
            ${alreadyInTBR ? "Added" : "Add to TBR"}
            </button>
        `;

        const button = li.querySelector("button");
        
        button.addEventListener("click", () => {
            addToTBR(book);
            button.textContent = "Added";
            button.disabled = true;    
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
        `;

        tbrListElement.appendChild(li);
    });
}

renderTBR();