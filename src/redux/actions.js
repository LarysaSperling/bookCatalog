export const BOOK_ADD = "BOOK_ADD";
export const BOOK_REMOVE = "BOOK_REMOVE";
export const BOOK_UPDATE_INFO = "BOOK_UPDATE_INFO";
export const BOOK_TOGGLE_AVAILABILITY = "BOOK_TOGGLE_AVAILABILITY";

export const READER_ADD = "READER_ADD";
export const READER_REMOVE = "READER_REMOVE";
export const BOOK_LEND_TO_READER = "BOOK_LEND_TO_READER";
export const BOOK_RETURN_FROM_READER = "BOOK_RETURN_FROM_READER";

export const addBook = (book) => ({
  type: BOOK_ADD,
  payload: book,
});

export const removeBook = (id) => ({
  type: BOOK_REMOVE,
  payload: { id },
});

export const updateBookInfo = (id, updates) => ({
  type: BOOK_UPDATE_INFO,
  payload: { id, updates },
});

export const toggleBookAvailability = (id) => ({
  type: BOOK_TOGGLE_AVAILABILITY,
  payload: { id },
});

export const addReader = ({ name, email }) => ({
  type: READER_ADD,
  payload: { name, email },
});

export const removeReader = (id) => ({
  type: READER_REMOVE,
  payload: { id },
});

export const lendBookToReader = (bookId, readerId) => ({
  type: BOOK_LEND_TO_READER,
  payload: { bookId, readerId },
});

export const returnBookFromReader = (bookId, readerId) => ({
  type: BOOK_RETURN_FROM_READER,
  payload: { bookId, readerId },
});