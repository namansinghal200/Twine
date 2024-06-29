import logo from "./logo.svg";
import "./css/App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Journal from "./pages/Journal.js";
import Events from "./pages/Events.js";
import { useSelector } from "react-redux";

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
      </Routes>
    </Router>
  );
}

export default App;
