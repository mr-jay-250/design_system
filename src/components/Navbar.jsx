import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg';
import styles from '../styles/navbar.module.css';

function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    window.location.href = '/login';
  };

  const isLoggedIn = localStorage.getItem('token') && localStorage.getItem('userId');

  return (
    <header className={styles.navbar}>
      <div>
        <img src={logo} className={styles.logo} alt="logo" />
      </div>
      <div className={styles.navLinks}>
        <nav>
          <ul className={styles.navList}>
            <li className={styles.navItem}>
              <Link to="/" className={styles.navLink}>Home</Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/profile" className={styles.navLink}>Profile</Link>
            </li>
          </ul>
        </nav>
        {isLoggedIn && (
          <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
        )}
      </div>
    </header>
  );
}

export default Navbar;
