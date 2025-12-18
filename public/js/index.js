"use strict";

const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const resultsList = document.getElementById("results");

const tbrListElement = document.getElementById("tbrList");
const tbrCountElement = document.getElementById("tbrCount");

const completedListElement = document.getElementById("completedList");
const completedCountElement = document.getElementById("completedCount");

let tbrList = [];

//Search Books on Google API
async function searchBooks(query) {
    const url = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=25`;

    const response = await fetch(url);
    const data = await response.json();

    renderResults(data.items || []);
}

//Fetch TBR
async function fetchTBR() {
    try {
        const response = await fetch("/api/tbr");

        if (!response.ok) {
            throw new Error("Failed to fetch TBR List");
        }
        
        tbrList = await response.json();

        if (tbrCountElement) {
            tbrCountElement.textContent = `(${tbrList.length})`;
        }

        renderTBR();
    } catch (error) {
        console.error("Error loading TBR list:", error);

        if (tbrCountElement) {
            tbrCountElement.textContent = "(?)";
        }
    }
    
}

// //Fetch Completed
// async function fetchCompleted() {
//     const response = await fetch("/api/completed");
//     const completedList = await response.json();

//     renderCompleted(completedList);
//     updateCompletedCount(completedList)
// }

//Add to TBR
async function addToTBR(book) {
    try {
        const response = await fetch("/api/tbr", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(book)
        });

        if (!response.ok) {
            throw new Error("Failed to add book to TBR");
        }

        await fetchTBR();
    } catch (error) {
        console.error("Error adding book:", error);
        alert("Sorry — we couldn't add that book right now.");
    }
}

//Remove from TBR
async function removeFromTBR(bookId) {
    try {
        const response = await fetch(`/api/tbr/${bookId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to remove book from TBR");
        }

        await fetchTBR();
    } catch (error) {
        console.error("Error removing book:", error);
        alert("Sorry — we couldn't remove that book right now.");
    }
}

// //Mark Completed
// async function markAsCompleted(book) {
//     await fetch("/api/completed", {
//         headers: {
//             "Content-Type": "application/json"
//         },
//         body: JSON.stringify(book)
//     });

//     fetchTBR();
//     fetchCompleted();
// }

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
            <!-- PRETENDING THIS DOESN'T EXIST
            <button class="completed">Completed</button> -->
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

        // const completedButton = li.querySelector(".completed");

        // completedButton.addEventListener("click", () => {
        //     markAsCompleted(book);
        // })

        resultsList.appendChild(li);
    });
}

//TBR List
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

// //Completed List
// function renderCompleted(completedList) {
//     if (!completedListElement) return;

//     completedListElement.innerHTML = "";

//     if (completedList.length === 0) {
//         completedListElement.innerHTML = `<p><em>No books</em></p>`;
//         return;
//     }
    
//     completedList.forEach((book) => {
//         const info = book.volumeInfo;
//         const li = document.createElement("li");

//         li.innerHTML = `
//             ${info.imageLinks?.thumbnail ? `<img src="${info.imageLinks.thumbnail}" />` : ""}
//             <strong>${info.title}</strong>
//             ${info.authors ? `<small>by ${info.authors.join(", ")}</small>` : ""}
//         `;

//         completedListElement.appendChild(li);
//     });
// }

// //Updated Completed List
// function updateCompletedCount(completedList) {
//     if (!completedCountElement) return;

//     completedCountElement.textContent = `(${completedList.length})`;
// }

//Event Listeners
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

fetchTBR();
// fetchCompleted();

if (resultsList) {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q");

    if (query) {
        searchInput.value = query;
        searchBooks(query);
    }
}