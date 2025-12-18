
# My Bookshelf

## About

My Bookshelf is a responsive web application that allows users to search for books and manage a personal **To-Be-Read** list.

This project was created as my **Code:You Capstone Project** and demonstrates concepts learned throughout the course. Even though this project is intended as a learning exercise I hope to further add to it in the future.

Users can:
- Search for books using the Google Books API
- Add books to a personal To-Be-Read list
- Remove books from the list

---

## Project Criteria

This project incorporates the following required concepts:

### 1. Data Analysis & Display
- Book data is stored and managed using **arrays and objects**
- Data is dynamically rendered to the page using JavaScript

### 2. Data Persistence
- Stored data remains available after page refresh or reload

### 3. Node.js Web Server
- A **Node.js server using Express.js** is used to serve the application
- The server provides API routes for managing the TBR list

---

## Technologies Used

- HTML5
- CSS
- JavaScript (ES Modules)
- Node.js
- Express.js
- Google Books API

---

## Installation & Setup

To run this project locally, you will need:
- **Node.js** (with npm installed)  
    - Verify installation by running:  
    `node --version` and `npm --version`
- A code editor such as **VS Code**
- A terminal (Git Bash or similar)

---

### Steps

1. Clone or download this repository
2. Save the project in a directory named: `my-bookshelf`
3. Navigate into the project directory via the terminal
4. Install dependencies: `npm install`
	- This installs all required dependcies, including nodemon for development
5. Running the Application (Command depends on how you prefer to run it):
	
    - Option 1: Development Mode (Recommended)  
        Uses nodemon to automatically restart the server on file changes  
        `npm run dev`

    - Option 2: Standard Start  
        Runs the server normally  
        `npm start`

6. Ctrl + Click the link navigate to: http://localhost:8080  
(If for some reason your terminal has a glitch and won't cooperate with taking you to the link you can always paste the link into your browser directly.)

---

## Future Enhancements

- A Completed books list so you can see your achievements in reading
- Collaspsible sections for the To-Be-Read and Completed lists so they can be viewed on the same page
- A sort feature such as A-Z, Z-A, Date Added etc. As of now any books added only go in the order they are added.