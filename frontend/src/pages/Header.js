import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { setLogout } from "../redux/UserSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSun,
  faMoon,
  faBell,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import axios from "../services/api";
import "../css/Home.css";

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
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUnread, setShowUnread] = useState(true);

  useEffect(() => {
    const storedDarkMode = localStorage.getItem("darkMode");
    setIsDarkMode(storedDarkMode === "true");
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDarkMode);
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(`/notifications`, {
          params: { userId: user._id },
        });
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };
    fetchNotifications();
  }, [user._id, notifications]);

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const toggleNotifications = () => {
    setShowNotifications((prevShow) => !prevShow);
  };

  const markAsRead = async (notificationId) => {
    try {
      console.log("xyz");
      await axios.put(`/notifications/${notificationId}`, { read: true });
      // setNotifications((prev) =>
      //   prev.map((notif) =>
      //     notif._id === notificationId ? { ...notif, read: true } : notif
      //   )
      // );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/notifications/${notificationId}`);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };
  const clearAllNotifs = async () => {
    try {
      await axios.delete(`/notifications`);
    } catch (error) {
      console.error("Error deleting notifications", error);
    }
  };

  const getImageSrc = () => {
    return isDarkMode
      ? isHovered
        ? darkHover
        : dark
      : isHovered
      ? lightHover
      : light;
  };

  if (!user) {
    return null;
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;
  const redirect = ({ notification }) => {
    if (notification.type === 2) {
      navigate(`/importantEvents/${notification.relId}`);
    }
    if (notification.type === 3) {
      navigate(`/journal/${notification.relId}`);
    }
  };
  return (
    <div className="header-container">
      <div className="logo-container">
        <Link to="/home">
          <img
            src={getImageSrc()}
            alt="Mode Image"
            className="light-image"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          />
        </Link>
      </div>
      <div className="header-user">
        <button className="dark-mode-toggle" onClick={toggleDarkMode}>
          <FontAwesomeIcon icon={isDarkMode ? faSun : faMoon} />
        </button>
        <div className="notification-icon" onClick={toggleNotifications}>
          <FontAwesomeIcon icon={faBell} />
          {unreadCount > 0 && <span className="notification-dot"></span>}
        </div>
        <div className="header-avatar" onClick={toggleDropdown}>
          <img
            src={`http://localhost:5000/public/avatars/${user.avatar}`}
            alt={user.name}
          />
          <span className="header-username">{user.name}</span>
        </div>
        {isOpen && (
          <div
            className="header-dropdown"
            onMouseLeave={() => setIsOpen(false)}
          >
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
        {showNotifications && (
          <div className="notifications-panel">
            <button onClick={() => setShowUnread(true)}>Unread</button>
            <button onClick={() => setShowUnread(false)}>Read</button>
            <button onClick={() => clearAllNotifs()}>Clear All</button>
            {notifications
              .filter((notification) => notification.read !== showUnread)
              .map((notification) => (
                <div key={notification._id} className="notification-card">
                  <button
                    className="delete-button"
                    onClick={() => deleteNotification(notification._id)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                  <div
                    className="notification-content"
                    onClick={() => redirect({ notification })}
                  >
                    <span>{notification.message}</span>
                    <div className="notification-date">
                      {new Date(notification.timeStamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="notification-footer">
                    {!notification.read && (
                      <button onClick={() => markAsRead(notification._id)}>
                        Mark as Read
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
