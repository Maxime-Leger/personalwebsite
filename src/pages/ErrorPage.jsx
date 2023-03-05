import styles from "./ErrorPage.module.scss";

function ErrorPage() {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1>Oops!</h1>
        <p>Sorry, an unexpected error has occurred.</p>
      </div>
    </div>
  );
}

export default ErrorPage;
