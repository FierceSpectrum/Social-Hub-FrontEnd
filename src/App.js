import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScheduleTable from "./Components/ScheduleTable/ScheduleTable";
import RouteHandler from "./Components/RouteHandler/RouteHandler";
import PagePostEdit from "./Components/PagePostEdit/PagePostEdit";
import SocialMediaPage from "./Components/SocialMediaPage/SocialMediaPage";
import PagePost from "./Components/PagePost/PagePost";
import Home from "./Components/Home/LoadPost";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";

function App() {
  const [logueado, setLogueado] = useState(localStorage.getItem("Login"));
  const [user, setUser] = useState(localStorage.getItem("UserId"));

  useEffect(() => {
    if ((!logueado || !user) && window.location.pathname !== "/Login") {
      window.location.href = "/Login";
    }
  }, [logueado, user]);

  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer />
        <Routes>
          <Route
            path="/"
            element={
              logueado && user ? (
                <Navigate to="/Home" />
              ) : (
                <Navigate to="/Login" />
              )
            }
          />
          <Route path="/SocialMedia/*" element={<RouteHandler />} />
          <Route path="/SocialMedia" element={<SocialMediaPage />} />
          <Route path="/Schedule" element={<ScheduleTable />} />
          <Route path="/Post/:postId/Edit" element={<PagePostEdit />} />
          <Route path="/Post" element={<PagePost />} />
          <Route path="/Home" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
