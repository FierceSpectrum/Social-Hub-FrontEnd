import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Password from "../Forms/Password/Password";
import Names from "../Forms/Names/Names";
import Email from "../Forms/Email/Email";
import "./Register.scss";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [user, setUser] = useState([]);

  const [errors, setErrors] = useState({
    register: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    if (user?.id) {
      navigate("/Login");
    }
  }, [navigate, user]);

  const validarEmail = async (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateForm = () => {
    const { name, lastName, email, password, confirmPassword } = formData;
    let isValid = true;
    const newErrors = {};

    if (!validarEmail(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    if (password !== confirmPassword) {
      newErrors.password = "Las contraseñas no coinciden";
      isValid = false;
    }

    for (const key in formData) {
      if (!formData[key]) {
        newErrors.register = `${
          key.charAt(0).toUpperCase() + key.slice(1)
        } is required`;
        isValid = false;
        break;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    if (!validateForm()) return;

    const { name, lastName, email, password } = formData;
    const data = { name, last_name: lastName, email, password };

    const urllogin = "http://socialhub.codementoria.fsg/api/users";
    try {
      const response = await fetch(urllogin, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          console.log(errorData);
          throw new Error(errorData.error);
        }
        throw new Error("Network response was not ok");
      }
      const responseData = await response.json();
      setUser({
        id: responseData.id,
        email: responseData.email,
        pin: responseData.pin,
        name: responseData.name,
        lastName: responseData.last_name,
      });
      console.log(responseData);
    } catch (error) {
      console.log("error " + error);
      setErrors((prevErrors) => ({ ...prevErrors, register: error.message }));
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="boddyregister">
        <div className="container">
          <div className="heading">Sign Up</div>
          <form
            action=""
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
          >
            <p className="Error">{errors.register}</p>
            <Email
              setEmail={(email) => setFormData((prev) => ({ ...prev, email }))}
              errorEmail={errors.email}
            />

            <Names
              setName={(name) => setFormData((prev) => ({ ...prev, name }))}
              setLastName={(lastName) =>
                setFormData((prev) => ({ ...prev, lastName }))
              }
            />

            <Password
              setPassword={(password) =>
                setFormData((prev) => ({ ...prev, password }))
              }
              setConfirmPassword={(confirmPassword) =>
                setFormData((prev) => ({ ...prev, confirmPassword }))
              }
              errorPassword={errors.password}
              setErrorPassword={(errorPassword) =>
                setErrors((prev) => ({ ...prev, password: errorPassword }))
              }
              requiredConfirmPassword={true}
            />

            <span className="forgot-password">
              <a href="/Login">Login</a>
            </span>
            <input className="login-button" type="submit" value="Sign Up" />
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
