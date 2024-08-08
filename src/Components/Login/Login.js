import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Email from "../Forms/Email/Email";
import Password from "../Forms/Password/Password";
import VerificCode from "../Forms/VerificCode/VerificCode";
import "./Login.scss";

const API_BASE_URL = "http://socialhub.codementoria.fsg/api/auth";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [errorLogin, setErrorLogin] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [codeValue, setCodeValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    setErrorLogin("");
    setErrorMessage("");

    if (!validateEmail(email)) {
      setErrorLogin("Invalid email format");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();

      if (result.requires2FA) {
        setShowPopup(true);
      } else {
        await handleSuccessfulLogin(result.token);
      }
    } catch (error) {
      setErrorLogin("El usuario o contraseña son invalidos");
      console.error("Login error:", error);
    }
  };

  const handle2FA = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/login/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ email, password, otp: codeValue }),
      });

      const result = await response.json();
      if (!response.ok) {
        if (result.error === "Invalid OTP") {
          setErrorMessage("Código de OTP inválido.");
          return;
        }
        throw new Error(result.error || "OTP verification failed");
      }

      await handleSuccessfulLogin(result.token);
    } catch (error) {
      setErrorMessage("Code incorrecto");
      console.log("2FA error:", error);
    }
  };

  const handleSuccessfulLogin = async (token) => {
    localStorage.setItem("token", token);

    try {
      const response = await fetch(`${API_BASE_URL}/login/user-id`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user ID");
      }

      const result = await response.json();
      setUser(result);

      localStorage.setItem("UserId", JSON.stringify(result.userId));
      localStorage.setItem("Login", "true");

      navigate("/home");
    } catch (error) {
      setErrorLogin("Failed to fetch user details");
      console.log("User ID fetch error:", error);
    }
  };

  useEffect(() => {
    if (codeValue.length === 6) {
      handle2FA();
    }
  }, [codeValue]);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  return (
    <>
      <div className="boddylogin">
        <div className="container">
          <div className="heading">Sign In</div>
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            {errorLogin && <p className="Error">{errorLogin}</p>}
            <Email setEmail={setEmail} errorEmail={""} />

            <Password setPassword={setPassword} errorPassword={""} />
            <span className="forgot-password">
              <a href="/Register">Registrate</a>
            </span>
            <input className="login-button" type="submit" value="Sign In" />
          </form>
        </div>
      </div>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup-overlay">
            <VerificCode
              closePopup={() => setShowPopup(false)}
              setCode={setCodeValue}
              errorMessage={errorMessage}
              setErrorMessage={setErrorMessage}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
