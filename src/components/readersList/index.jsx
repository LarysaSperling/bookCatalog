import styles from "./styles.module.css";

function ReadersList({ readers }) {
  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Readers</h2>

      {readers.length === 0 ? (
        <p className={styles.empty}>No readers yet</p>
      ) : (
        <ul className={styles.list}>
          {readers.map((reader) => (
            <li key={reader.id} className={styles.card}>
              <p>
                <span className={styles.label}>Name:</span> {reader.name}
              </p>
              <p>
                <span className={styles.label}>Email:</span> {reader.email}
              </p>
              <p>
                <span className={styles.label}>Borrowed books:</span>{" "}
                {reader.borrowedBooks.length > 0
                  ? reader.borrowedBooks.join(", ")
                  : "None"}
              </p>
              <p>
                <span className={styles.label}>ID:</span> {reader.id}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ReadersList;