const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Register a new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});
    }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Task 10: Get the book list available in the shop using Async/Promise
public_users.get('/', function (req, res) {
  const get_books = new Promise((resolve, reject) => {
    resolve(books);
  });

  get_books.then((book_list) => {
    return res.status(200).json(book_list);
  }).catch((error) => {
    return res.status(500).json({message: "Error fetching books"});
  });
});

// Task 11: Get book details based on ISBN using Async/Promise
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const get_book = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  get_book.then((book) => {
    return res.status(200).json(book);
  }).catch((err) => {
    return res.status(404).json({message: err});
  });
});
  
// Task 12: Get book details based on author using Async/Promise
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const get_books_by_author = new Promise((resolve, reject) => {
    let booksbyauthor = [];
    const isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn].author === author) {
        booksbyauthor.push(books[isbn]);
      }
    });

    if(booksbyauthor.length > 0){
      resolve(booksbyauthor);
    } else {
      reject("No books found for this author");
    }
  });

  get_books_by_author.then((book_list) => {
    return res.status(200).json(book_list);
  }).catch((msg) => {
    return res.status(404).json({message: msg});
  });
});

// Task 13: Get all books based on title using Async/Promise
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const get_books_by_title = new Promise((resolve, reject) => {
    let foundBooks = [];
    const isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if (books[isbn].title === title) {
        foundBooks.push(books[isbn]);
      }
    });

    if (foundBooks.length > 0) {
      resolve(foundBooks);
    } else {
      reject("No books found with this title");
    }
  });

  get_books_by_title.then((book_list) => {
    return res.status(200).json(book_list);
  }).catch((msg) => {
    return res.status(404).json({message: msg});
  });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }
  return res.status(404).json({message: "Book not found"});
});

module.exports.general = public_users;
