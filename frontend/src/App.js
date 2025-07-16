<<<<<<< HEAD
import React from "react";
=======
import logo from "./logo.svg";
import "./css/App.css";
>>>>>>> e7ee520b3d333039238755a34727cf44001acbff
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
<<<<<<< HEAD
import { useSelector } from "react-redux";
=======
>>>>>>> e7ee520b3d333039238755a34727cf44001acbff
import Login from "./pages/Login";
import Home from "./pages/Home";
import Journal from "./pages/Journal.js";
import Events from "./pages/Events.js";
<<<<<<< HEAD
import ProfilePage from "./pages/profilePage.js";
import Chat from "./pages/Chat.js";
import ProtectedRoute from "./components/ProtectedRoute"; // Import the new component

function App() {
  const { user } = useSelector((state) => state.user);

  return (
    <Router>
      <Routes>
        <Route path="/" element={!user ? <Login /> : <Navigate to="/home" />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* --- PROTECTED ROUTES --- */}
        <Route
          path="/journal/:relationshipId"
          element={
            <ProtectedRoute>
              <Journal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/importantEvents/:relationshipId"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:relationshipId"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
=======
import { useSelector } from "react-redux";
import ProfilePage from "./pages/profilePage.js";

function App() {
  const { user } = useSelector((state) => state.user);
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={!user ? <Login /> : <Navigate to="home"></Navigate>}
        />
        <Route path="/home" element={<Home />}></Route>
        <Route path="/journal/:relationshipId" element={<Journal />}></Route>
        <Route
          path="/importantEvents/:relationshipId"
          element={<Events />}
        ></Route>
        <Route path="/profile" element={<ProfilePage />}></Route>
>>>>>>> e7ee520b3d333039238755a34727cf44001acbff
      </Routes>
    </Router>
  );
}

export default App;
