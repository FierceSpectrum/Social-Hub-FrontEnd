import "./App.css";
import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./Components/Home/LoadPost";
import Login from "./Components/Login/Login";
import Register from "./Components/Register/Register";

function App() {
  const [logueado, setLogueado] = useState(localStorage.getItem("Login"));
  const [user, setUser] = useState(localStorage.getItem("User"));
  const [sessionExpired, setSessionExpired] = useState(false);

  // useEffect(() => {
  //   console.log(logueado)
  //   console.log(user)
  //   console.log(logueado && user)
  //   if (!(logueado && user)) {
  //     window.location.href = "/Login";
  //   }
  // }, [logueado, user]);

  useEffect(() => {
    // Interceptar solicitudes fetch y manejar errores 401
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      return originalFetch(...args)
      .then((response) => {
          if (response.status === 401) {
            // Marcar la sesión como expirada solo si el error es de autenticación
            response.json().then((data) => {
              if (data.error === "Invalid token." || data.message === "No token provided") {
                setSessionExpired(true);
              }
            });
          }
          return response;
        })
        .catch((error) => {
          console.error("Error en la solicitud fetch:", error);
          throw error;
        });
    };

    return () => {
      // Restaurar fetch original cuando el componente se desmonte
      window.fetch = originalFetch;
    };
  }, []);

  // Reiniciar interceptorExecuted cuando se vuelve al inicio de sesión
  useEffect(() => {
    if (sessionExpired) {
      toast.error("Se expiró el tiempo de tu sesión");
      setTimeout(() => {
        localStorage.clear();
        setLogueado(null);
        setUser(null);
        setSessionExpired(false);
        window.location.href = "/Login";
      }, 2000);
    }
  }, [sessionExpired]);

  // useEffect(() => {
  //   if (interceptorExecuted) {
  //     toast.error("Se expiró el tiempo de tu sesión");
  //     // Esperar 2 segundos antes de redirigir al usuario
  //     setTimeout(() => {
  //       localStorage.clear();
  //       setLogueado(localStorage.getItem("Login"));
  //       window.location.href = "/Login";
  //     }, 5000);
  //   }
  // }, [interceptorExecuted]);

  // useEffect(() => {
  //   setInterceptorExecuted(false);
  // }, [logueado]);

  return (
    <BrowserRouter>
      <div className="App">
        <ToastContainer />
        <Routes>
          <Route
            path="/"
            element={
              logueado && user ? (
                <Navigate to="/Profiles" />
              ) : (
                <Navigate to="/Login" />
              )
            }
          />
          <Route path="/Home" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Register" element={<Register />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
