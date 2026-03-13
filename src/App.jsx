import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import BooksList from "./components/booksList";
import ReadersList from "./components/readersList";
import {
  addBook,
  removeBook,
  updateBookInfo,
  toggleBookAvailability,
  addReader,
  removeReader,
  lendBookToReader,
  returnBookFromReader,
} from "./redux/actions";

function App() {
  const dispatch = useDispatch();

  const books = useSelector((state) => state.books);
  const readers = useSelector((state) => state.readers);
  const statistics = useSelector((state) => state.statistics);
  const lastUpdated = useSelector((state) => state.lastUpdated);

  const [bookForm, setBookForm] = useState({
    title: "",
    author: "",
    year: "",
  });

  const [readerForm, setReaderForm] = useState({
    name: "",
    email: "",
  });

  const [updateBookForm, setUpdateBookForm] = useState({
    id: "",
    title: "",
    author: "",
    year: "",
  });

  const [lendForm, setLendForm] = useState({
    bookId: "",
    readerId: "",
  });

  const [returnForm, setReturnForm] = useState({
    bookId: "",
    readerId: "",
  });

  const handleBookFormChange = (event) => {
    const { name, value } = event.target;
    setBookForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReaderFormChange = (event) => {
    const { name, value } = event.target;
    setReaderForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateBookFormChange = (event) => {
    const { name, value } = event.target;
    setUpdateBookForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLendFormChange = (event) => {
    const { name, value } = event.target;
    setLendForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleReturnFormChange = (event) => {
    const { name, value } = event.target;
    setReturnForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddBook = (event) => {
    event.preventDefault();

    if (!bookForm.title.trim() || !bookForm.author.trim() || !bookForm.year) {
      return;
    }

    dispatch(
      addBook({
        title: bookForm.title.trim(),
        author: bookForm.author.trim(),
        year: Number(bookForm.year),
      })
    );

    setBookForm({
      title: "",
      author: "",
      year: "",
    });
  };

  const handleAddReader = (event) => {
    event.preventDefault();

    if (!readerForm.name.trim() || !readerForm.email.trim()) {
      return;
    }

    dispatch(
      addReader({
        name: readerForm.name.trim(),
        email: readerForm.email.trim(),
      })
    );

    setReaderForm({
      name: "",
      email: "",
    });
  };

  const handleUpdateBook = (event) => {
    event.preventDefault();

    if (!updateBookForm.id) {
      return;
    }

    const updates = {};

    if (updateBookForm.title.trim()) {
      updates.title = updateBookForm.title.trim();
    }

    if (updateBookForm.author.trim()) {
      updates.author = updateBookForm.author.trim();
    }

    if (updateBookForm.year) {
      updates.year = Number(updateBookForm.year);
    }

    if (Object.keys(updates).length === 0) {
      return;
    }

    dispatch(updateBookInfo(updateBookForm.id, updates));

    setUpdateBookForm({
      id: "",
      title: "",
      author: "",
      year: "",
    });
  };

  const handleRemoveBook = (id) => {
    dispatch(removeBook(id));
  };

  const handleToggleBookAvailability = (id) => {
    dispatch(toggleBookAvailability(id));
  };

  const handleRemoveReader = (id) => {
    dispatch(removeReader(id));
  };

  const handleLendBook = (event) => {
    event.preventDefault();

    if (!lendForm.bookId || !lendForm.readerId) {
      return;
    }

    dispatch(lendBookToReader(lendForm.bookId, lendForm.readerId));

    setLendForm({
      bookId: "",
      readerId: "",
    });
  };

  const handleReturnBook = (event) => {
    event.preventDefault();

    if (!returnForm.bookId || !returnForm.readerId) {
      return;
    }

    dispatch(returnBookFromReader(returnForm.bookId, returnForm.readerId));

    setReturnForm({
      bookId: "",
      readerId: "",
    });
  };

  const borrowedBooks = books.filter((book) => !book.isAvailable);
  const availableBooks = books.filter((book) => book.isAvailable);
  const readersWithBorrowedBooks = readers.filter(
    (reader) => reader.borrowedBooks.length > 0
  );

  return (
    <div className="app">
      <div className="container">
        <h1 className="mainTitle">Library Management</h1>

        <div className="formsGrid">
          <form className="card formCard" onSubmit={handleAddBook}>
            <h2>Add Book</h2>

            <input
              type="text"
              name="title"
              placeholder="Book title"
              value={bookForm.title}
              onChange={handleBookFormChange}
            />

            <input
              type="text"
              name="author"
              placeholder="Author"
              value={bookForm.author}
              onChange={handleBookFormChange}
            />

            <input
              type="number"
              name="year"
              placeholder="Year"
              value={bookForm.year}
              onChange={handleBookFormChange}
            />

            <button type="submit">Add book</button>
          </form>

          <form className="card formCard" onSubmit={handleAddReader}>
            <h2>Add Reader</h2>

            <input
              type="text"
              name="name"
              placeholder="Reader name"
              value={readerForm.name}
              onChange={handleReaderFormChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={readerForm.email}
              onChange={handleReaderFormChange}
            />

            <button type="submit">Add reader</button>
          </form>
        </div>

        <div className="formsGrid">
          <form className="card formCard" onSubmit={handleUpdateBook}>
            <h2>Update Book</h2>

            <select
              name="id"
              value={updateBookForm.id}
              onChange={handleUpdateBookFormChange}
            >
              <option value="">Select book</option>
              {books.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} — {book.author}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="title"
              placeholder="New title"
              value={updateBookForm.title}
              onChange={handleUpdateBookFormChange}
            />

            <input
              type="text"
              name="author"
              placeholder="New author"
              value={updateBookForm.author}
              onChange={handleUpdateBookFormChange}
            />

            <input
              type="number"
              name="year"
              placeholder="New year"
              value={updateBookForm.year}
              onChange={handleUpdateBookFormChange}
            />

            <button type="submit">Update book</button>
          </form>

          <form className="card formCard" onSubmit={handleLendBook}>
            <h2>Lend Book</h2>

            <select
              name="bookId"
              value={lendForm.bookId}
              onChange={handleLendFormChange}
            >
              <option value="">Select available book</option>
              {availableBooks.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} — {book.author}
                </option>
              ))}
            </select>

            <select
              name="readerId"
              value={lendForm.readerId}
              onChange={handleLendFormChange}
            >
              <option value="">Select reader</option>
              {readers.map((reader) => (
                <option key={reader.id} value={reader.id}>
                  {reader.name}
                </option>
              ))}
            </select>

            <button type="submit">Lend book</button>
          </form>
        </div>

        <div className="formsGrid">
          <form className="card formCard" onSubmit={handleReturnBook}>
            <h2>Return Book</h2>

            <select
              name="bookId"
              value={returnForm.bookId}
              onChange={handleReturnFormChange}
            >
              <option value="">Select borrowed book</option>
              {borrowedBooks.map((book) => (
                <option key={book.id} value={book.id}>
                  {book.title} — {book.author}
                </option>
              ))}
            </select>

            <select
              name="readerId"
              value={returnForm.readerId}
              onChange={handleReturnFormChange}
            >
              <option value="">Select reader</option>
              {readersWithBorrowedBooks.map((reader) => (
                <option key={reader.id} value={reader.id}>
                  {reader.name}
                </option>
              ))}
            </select>

            <button type="submit">Return book</button>
          </form>

          <div className="card statsBlock">
            <h2>Statistics</h2>

            <p>
              <strong>Total books:</strong> {statistics.totalBooks}
            </p>
            <p>
              <strong>Available books:</strong> {statistics.availableBooks}
            </p>
            <p>
              <strong>Borrowed books:</strong> {statistics.borrowedBooks}
            </p>
            <p>
              <strong>Active readers:</strong> {statistics.activeReadersCount}
            </p>
            <p>
              <strong>Most popular author:</strong>{" "}
              {statistics.mostPopularAuthor.name || "—"} (
              {statistics.mostPopularAuthor.booksCount})
            </p>
            <p>
              <strong>Consistency check:</strong>{" "}
              {statistics.consistencyCheck ? "true" : "false"}
            </p>

            <div className="decades">
              <strong>Books by decade:</strong>
              {Object.keys(statistics.booksByDecade).length === 0 ? (
                <p>—</p>
              ) : (
                <ul>
                  {Object.entries(statistics.booksByDecade).map(
                    ([decade, count]) => (
                      <li key={decade}>
                        {decade}s: {count}
                      </li>
                    )
                  )}
                </ul>
              )}
            </div>

            <p>
              <strong>Last updated:</strong> {lastUpdated || "—"}
            </p>
          </div>
        </div>

        <div className="content">
          <div className="card">
            <div className="sectionHeader">
              <h2>Books Management</h2>
            </div>

            {books.length === 0 ? (
              <p>No books yet</p>
            ) : (
              <div className="actionList">
                {books.map((book) => (
                  <div key={book.id} className="actionRow">
                    <div>
                      <strong>{book.title}</strong> — {book.author} ({book.year}) —{" "}
                      {book.isAvailable ? "Available" : "Borrowed"}
                    </div>

                    <div className="rowButtons">
                      <button
                        type="button"
                        onClick={() => handleToggleBookAvailability(book.id)}
                      >
                        Toggle availability
                      </button>
                      <button
                        type="button"
                        className="dangerButton"
                        onClick={() => handleRemoveBook(book.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card">
            <div className="sectionHeader">
              <h2>Readers Management</h2>
            </div>

            {readers.length === 0 ? (
              <p>No readers yet</p>
            ) : (
              <div className="actionList">
                {readers.map((reader) => (
                  <div key={reader.id} className="actionRow">
                    <div>
                      <strong>{reader.name}</strong> — {reader.email} — books:{" "}
                      {reader.borrowedBooks.length}
                    </div>

                    <div className="rowButtons">
                      <button
                        type="button"
                        className="dangerButton"
                        onClick={() => handleRemoveReader(reader.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="content">
          <BooksList books={books} />
          <ReadersList readers={readers} />
        </div>
      </div>
    </div>
  );
}

export default App;
