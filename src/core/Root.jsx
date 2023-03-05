import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import styles from "./Root.module.scss";

const Root = () => {
  return (
    <>
      <Navbar />
      <div className={styles.background}></div>
      <Outlet />
    </>
  );
};

export default Root;
