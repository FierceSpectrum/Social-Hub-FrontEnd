import React, { useState, useEffect } from "react";
import "./User.scss";
import img from "../../Accets/Perfil-usuario.webp";
import SecondFA from "../SecondFA/SecondFA";
import { useNavigate } from "react-router-dom";

const User = () => {
  const [isValidImage, setIsValidImage] = useState(false);
  const [datauser, setDatauser] = useState({});
  const [menuVisible, setMenuVisible] = useState(false);
  const navigate = useNavigate();
  const userId = JSON.parse(localStorage.getItem("UserId"));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const url = `http://socialhub.codementoria.fsg/api/users/ById?id=${userId}`;
        const token = localStorage.getItem("token");

        const response = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch user");

        const data = await response.json();
        setDatauser(data);

        const image = new Image();
        image.src = data.avatar;
        image.onload = () => {
          setIsValidImage(true);
        };
        image.onerror = () => {
          setIsValidImage(false);
        };
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchUser();
  }, [userId]);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/Login");
  };

  return (
    <div className="user">
      <div onClick={toggleMenu} className="user__header">
        <span className="user__name">{datauser.name || datauser.full_name}</span>
        <img
          className="user__img"
          src={isValidImage ? datauser.avatar : img}
          alt={`${datauser.name}'s Avatar`}
        />
        <div className="user__menu">{menuVisible ? "▲" : "▼"}</div>
      </div>
      {menuVisible && (
        <div className="user__menu__button">
          <ul>
            {datauser && (
              <>
                <li>
                  <SecondFA
                    email={datauser.email}
                    is2FAEnabledProp={datauser.is2FAEnabled}
                  />
                </li>
                <li>
                  <button onClick={() => navigate("/SocialMedia")}>Social Media Page</button>
                </li>
              </>
            )}
            <li>
              <button onClick={handleLogout}>Sign off</button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default User;
