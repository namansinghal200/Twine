import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/UserSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";
import "../css/Home.css"; // Import your CSS file

import light from "../logos/light.png";
import lightHover from "../logos/lightHover.png";
import dark from "../logos/dark.png";
import darkHover from "../logos/darkHover.png";

const Header = () => {
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getImageSrc = () => {
    if (isDarkMode) {
      return isHovered ? darkHover : dark;
    } else {
      return isHovered ? lightHover : light;
    }
  };

  // Load dark mode preference from localStorage on initial mount
  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    setIsDarkMode(storedDarkMode === "true");
  }, []);

  // Update body class and persist dark mode preference in localStorage
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Ensure user state exists before rendering user-specific content
  if (!user) {
    return null; // or render a loading state, depending on your app logic
  }

  return (
    <div className="header-container">
      <div class="logo-container">
        <Link to="/home">
          <img
            src={getImageSrc()}
            alt="Mode Image"
            className="light-image"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          />
        </Link>
      </div>
      <div className="header-user">
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
        </button>
        <div className="header-avatar" onClick={toggleDropdown}>
          <img
            src={`http://localhost:5000/public/avatars/${user.avatar}`}
            alt={user.name}
          />
          <span className="header-username">{user.name}</span>
        </div>
        {isOpen && (
          <div className="header-dropdown" onMouseLeave={closeDropdown}>
            <div className="header-dropdown-content">
              <div className="header-dropdown-item" onClick={handleLogout}>
                My Profile
              </div>
              <div className="header-dropdown-item" onClick={handleLogout}>
                Logout
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
