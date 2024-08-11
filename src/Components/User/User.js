import "./User.scss";
import React, { useState, useEffect, useContext } from "react";
import img from "../../Accets/Perfil-usuario.webp";
import { useNavigate } from "react-router-dom";
// import { AppContext } from '../../App';

const User = () => {
  const [isValidImage, setIsValidImage] = useState(false);
  const [datauser, setDatauser] = useState({});
  const navigate = useNavigate();
  // const { logeado, setLogeado } = useContext(AppContext);

  const userId = JSON.parse(localStorage.getItem("UserId"));

  const handleLogout = () => {
    // setLogeado(false);
    localStorage.setItem("Account", JSON.stringify(null));
    navigate("/Profiles");
  };

  useEffect(() => {
    const fetchLinkedSocialMedia = async () => {
      try {
        const url = `http://socialhub.codementoria.fsg/api/users/ById?id=${userId}`;
        const token = localStorage.getItem("token");

        const response = await fetch(url, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Failed to fetch user");

        const data = await response.json();
        await setDatauser(data);
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchLinkedSocialMedia();
    const image = new Image();
    image.src = datauser.avatar;
    image.onload = () => {
      setIsValidImage(true);
    };
    image.onerror = () => {
      setIsValidImage(false);
    };
  }, []);

  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleImageError = () => {
    setIsValidImage(false);
  };

  return (
    <div className="user">
      <span className="user__name">
        {datauser.name ? datauser.name : datauser.full_name}
      </span>
      <img
        className="user__img"
        src={isValidImage ? datauser.avatar : img}
        alt={`${datauser.name}'s Avatar`}
        onError={handleImageError}
      />
      <div className="user__menu" onClick={toggleMenu}>
        {" "}
        {menuVisible ? "▲" : "▼"}
      </div>
      {menuVisible && (
        <div className="user__menu__button">
          <ul>
            <li>
              <button onClick={handleLogout}>Profiles</button>
            </li>
            {datauser.name && (
              <li>
                <button
                  onClick={() => {
                    localStorage.clear();
                    navigate("/Login");
                  }}
                >
                  Sign off
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default User;
