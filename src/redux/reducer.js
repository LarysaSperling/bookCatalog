import {
  BOOK_ADD,
  BOOK_REMOVE,
  BOOK_UPDATE_INFO,
  BOOK_TOGGLE_AVAILABILITY,
  READER_ADD,
  READER_REMOVE,
  BOOK_LEND_TO_READER,
  BOOK_RETURN_FROM_READER,
} from "./actions";

const createInitialStatistics = () => ({
  totalBooks: 0,
  availableBooks: 0,
  borrowedBooks: 0,
  booksByDecade: {},
  activeReadersCount: 0,
  mostPopularAuthor: {
    name: "",
    booksCount: 0,
  },
  consistencyCheck: true,
});

const initialState = {
  books: [],
  readers: [],
  statistics: createInitialStatistics(),
  lastUpdated: null,
};

const generateId = () => Date.now() + Math.floor(Math.random() * 100000);

const recalculateStatistics = (books, readers) => {
  const totalBooks = books.length;
  const availableBooks = books.filter((book) => book.isAvailable).length;
  const borrowedBooks = totalBooks - availableBooks;

  const booksByDecade = books.reduce((acc, book) => {
    const decade = String(Math.floor(Number(book.year) / 10) * 10);
    acc[decade] = (acc[decade] || 0) + 1;
    return acc;
  }, {});

  const activeReadersCount = readers.filter(
    (reader) => reader.borrowedBooks.length > 0
  ).length;

  const authorsMap = books.reduce((acc, book) => {
    acc[book.author] = (acc[book.author] || 0) + 1;
    return acc;
  }, {});

  let mostPopularAuthor = {
    name: "",
    booksCount: 0,
  };

  for (const author in authorsMap) {
    if (authorsMap[author] > mostPopularAuthor.booksCount) {
      mostPopularAuthor = {
        name: author,
        booksCount: authorsMap[author],
      };
    }
  }

  const borrowedBooksByReaders = readers.reduce(
    (sum, reader) => sum + reader.borrowedBooks.length,
    0
  );

  const consistencyCheck =
    availableBooks + borrowedBooks === totalBooks &&
    borrowedBooksByReaders === borrowedBooks;

  if (!consistencyCheck) {
    console.warn("Ошибка консистентности данных в библиотеке");
  }

  return {
    totalBooks,
    availableBooks,
    borrowedBooks,
    booksByDecade,
    activeReadersCount,
    mostPopularAuthor,
    consistencyCheck,
  };
};

const buildNextState = (state, books, readers) => ({
  ...state,
  books,
  readers,
  statistics: recalculateStatistics(books, readers),
  lastUpdated: new Date().toISOString(),
});

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case BOOK_ADD: {
      const { title, author, year } = action.payload;

      const newBook = {
        id: generateId(),
        title,
        author,
        year: Number(year),
        isAvailable: true,
      };

      return buildNextState(state, [...state.books, newBook], state.readers);
    }

    case BOOK_REMOVE: {
      const bookToRemove = state.books.find(
        (book) => String(book.id) === String(action.payload.id)
      );

      if (!bookToRemove) {
        console.log("Книга не найдена");
        return state;
      }

      if (!bookToRemove.isAvailable) {
        console.log("Нельзя удалить книгу: она сейчас выдана");
        return state;
      }

      const nextBooks = state.books.filter(
        (book) => String(book.id) !== String(action.payload.id)
      );

      return buildNextState(state, nextBooks, state.readers);
    }

    case BOOK_UPDATE_INFO: {
      const { id, updates } = action.payload;

      const nextBooks = state.books.map((book) =>
        String(book.id) === String(id)
          ? {
              ...book,
              title: updates.title ?? book.title,
              author: updates.author ?? book.author,
              year: updates.year ?? book.year,
            }
          : book
      );

      return buildNextState(state, nextBooks, state.readers);
    }

    case BOOK_TOGGLE_AVAILABILITY: {
      const targetBook = state.books.find(
        (book) => String(book.id) === String(action.payload.id)
      );

      if (!targetBook) {
        console.log("Книга не найдена");
        return state;
      }

      const isBorrowedByReader = state.readers.some((reader) =>
        reader.borrowedBooks.some(
          (bookId) => String(bookId) === String(action.payload.id)
        )
      );

      if (isBorrowedByReader) {
        console.log(
          "Нельзя вручную менять доступность: книга числится у читателя"
        );
        return state;
      }

      const nextBooks = state.books.map((book) =>
        String(book.id) === String(action.payload.id)
          ? { ...book, isAvailable: !book.isAvailable }
          : book
      );

      return buildNextState(state, nextBooks, state.readers);
    }

    case READER_ADD: {
      const { name, email } = action.payload;

      const newReader = {
        id: generateId(),
        name,
        email,
        borrowedBooks: [],
      };

      return buildNextState(state, state.books, [...state.readers, newReader]);
    }

    case READER_REMOVE: {
      const readerToRemove = state.readers.find(
        (reader) => String(reader.id) === String(action.payload.id)
      );

      if (!readerToRemove) {
        console.log("Читатель не найден");
        return state;
      }

      if (readerToRemove.borrowedBooks.length > 0) {
        console.log("Нельзя удалить читателя: у него есть книги на руках");
        return state;
      }

      const nextReaders = state.readers.filter(
        (reader) => String(reader.id) !== String(action.payload.id)
      );

      return buildNextState(state, state.books, nextReaders);
    }

    case BOOK_LEND_TO_READER: {
      const { bookId, readerId } = action.payload;

      const book = state.books.find(
        (item) => String(item.id) === String(bookId)
      );
      const reader = state.readers.find(
        (item) => String(item.id) === String(readerId)
      );

      if (!book) {
        console.log("Книга не найдена");
        return state;
      }

      if (!reader) {
        console.log("Читатель не найден");
        return state;
      }

      if (!book.isAvailable) {
        console.log("Книга уже выдана");
        return state;
      }

      if (
        reader.borrowedBooks.some((borrowedId) => String(borrowedId) === String(bookId))
      ) {
        console.log("У читателя уже есть эта книга");
        return state;
      }

      const nextBooks = state.books.map((item) =>
        String(item.id) === String(bookId)
          ? { ...item, isAvailable: false }
          : item
      );

      const nextReaders = state.readers.map((item) =>
        String(item.id) === String(readerId)
          ? {
              ...item,
              borrowedBooks: [...item.borrowedBooks, bookId],
            }
          : item
      );

      return buildNextState(state, nextBooks, nextReaders);
    }

    case BOOK_RETURN_FROM_READER: {
      const { bookId, readerId } = action.payload;

      const book = state.books.find(
        (item) => String(item.id) === String(bookId)
      );
      const reader = state.readers.find(
        (item) => String(item.id) === String(readerId)
      );

      if (!book) {
        console.log("Книга не найдена");
        return state;
      }

      if (!reader) {
        console.log("Читатель не найден");
        return state;
      }

      if (
        !reader.borrowedBooks.some((borrowedId) => String(borrowedId) === String(bookId))
      ) {
        console.log("Эта книга не числится у данного читателя");
        return state;
      }

      const nextBooks = state.books.map((item) =>
        String(item.id) === String(bookId)
          ? { ...item, isAvailable: true }
          : item
      );

      const nextReaders = state.readers.map((item) =>
        String(item.id) === String(readerId)
          ? {
              ...item,
              borrowedBooks: item.borrowedBooks.filter(
                (id) => String(id) !== String(bookId)
              ),
            }
          : item
      );

      return buildNextState(state, nextBooks, nextReaders);
    }

    default:
      return state;
  }
};

export default reducer;