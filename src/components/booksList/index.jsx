import styles from "./styles.module.css";

function BooksList({ books }) {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Books</h2>

      {books.length === 0 ? (
        <p className={styles.empty}>No books yet</p>
      ) : (
        <ul className={styles.list}>
          {books.map((book) => (
            <li key={book.id} className={styles.card}>
              <p>
                <span className={styles.label}>Title:</span> {book.title}
              </p>
              <p>
                <span className={styles.label}>Author:</span> {book.author}
              </p>
              <p>
                <span className={styles.label}>Year:</span> {book.year}
              </p>
              <p>
                <span className={styles.label}>Status:</span>{" "}
                {book.isAvailable ? "Available" : "Borrowed"}
              </p>
              <p>
                <span className={styles.label}>ID:</span> {book.id}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BooksList;