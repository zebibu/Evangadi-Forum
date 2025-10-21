import { useEffect, useState } from "react";
import classes from "./Header.module.css";
import logo from "../../assets/evangadiLogo.png";
import { AiOutlineMenu } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Logout handler
  const signOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  // Toggle sidebar open/close
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Check login status on load
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, [location]);

  return (
    <header className={classes.header}>
      {/* Logo */}
      <div className={classes.header__logo}>
        <Link to="/">
          <img src={logo} alt="Evangadi Logo" />
        </Link>
      </div>

      {/* Desktop nav */}
      <div className={classes.header__right}>
        <nav className={classes.header__nav}>
          <Link to="/">Home</Link>
          <Link to="/how-it-works">How it works</Link>
          {/* display this only if the user is logged-in */}
          {isAuthenticated && (
            <Link to="/community-groups">Join Group</Link>
          )}
        </nav>

        {isAuthenticated ? (
          <button className={classes.header__signin} onClick={signOut}>
            SIGN OUT
          </button>
        ) : (
          <button
            className={classes.header__signin}
            onClick={() => navigate("/login")}
          >
            SIGN IN
          </button>
        )}
      </div>

      {/* Mobile menu icon */}
      <div className={classes.header__menu_icon} onClick={toggleSidebar}>
        <AiOutlineMenu />
      </div>

      {/* Sidebar */}
      <div
        className={`${classes.header__sidebar} ${
          isSidebarOpen ? classes.active : ""
        }`}
      >
        <span className={classes.header__close_icon} onClick={toggleSidebar}>
          <IoMdClose />
        </span>

        <nav className={classes.header__nav}>
          <Link to="/" onClick={toggleSidebar}>
            Home
          </Link>
          <Link to="/how-it-works" onClick={toggleSidebar}>
            How it works
          </Link>
          {isAuthenticated && (
            <Link to="/community-groups">Join Group</Link>
          )}
          {/*new*/}
        </nav>

        {isAuthenticated ? (
          <button className={classes.header__signin} onClick={signOut}>
            SIGN OUT
          </button>
        ) : (
          <button
            className={classes.header__signin}
            onClick={() => {
              toggleSidebar();
              navigate("/login");
            }}
          >
            SIGN IN
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
