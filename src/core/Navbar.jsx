import { useState } from "react";
import { NavLink } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import styles from "./Navbar.module.scss";

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false);

  return (
    <nav>
      <div className={styles.container}>
        <div className={styles.menuIcon} onClick={()=>setShowNavbar(true)}>
          <GiHamburgerMenu />
        </div>
        <div className={`${styles.navElements} ${showNavbar && styles.active}`}>
          <div className={styles.closeIcon} onClick={()=>setShowNavbar(false)}>
            <RxCross2 />
          </div>
          <ul>
            <li>
              <NavLink
                className={({ isActive }) => (isActive ? styles.active : "")}
                to="/"
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) => (isActive ? styles.active : "")}
                to="/calculator"
              >
                Calculator
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
      <div className={`${styles.backdrop} ${showNavbar && styles.active}`}></div>
    </nav>
  );
};

export default Navbar;
