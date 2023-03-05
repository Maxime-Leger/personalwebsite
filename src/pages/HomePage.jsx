import styles from "./HomePage.module.scss";

function HomePage() {
  return (
    <div className={styles.page}>
      <div className={styles.top}>
        <div className={styles.profilphoto} />
        <span className={styles.description}>
          Software Engineer
          <br /> Full-Stack Web Developer
        </span>
      </div>
    </div>
  );
}

export default HomePage;
