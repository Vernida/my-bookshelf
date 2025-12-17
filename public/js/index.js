"use strict";

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const resultsList = document.getElementById("results");

searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const query = searchInput.value.trim();
    if (!query) return;

    searchBooks(query);
});

async function searchBooks(query) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=25`;

    const response = await fetch(url);
    const data = await response.json();

    renderResults(data.items || []);
}

function renderResults(books) {
    resultsList.innerHTML = "";

    books.forEach((book) => {
        const info = book.volumeInfo;

        const li = document.createElement("li");
        li.innerHTML = `
            ${info.imageLinks?.thumbnail ? `<img src="${info.imageLinks.thumbnail}" alt="${info.title}" />` : ""}
            <div class="book-info">
                <strong>${info.title || "Untitled"}</strong>
                ${info.authors ? `<small>by ${info.authors.join(", ")}</small>` : ""}
            </div>
        `;

        resultsList.appendChild(li);
    });
}