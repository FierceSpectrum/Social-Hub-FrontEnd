import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function RouteHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Mostrar la ruta actual
    // console.log("Ruta actual:", location.pathname);

    // Extraer los parámetros de la URL
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");

    // Si hay un código en la URL, redirigir a SocialMedia con el código y el tipo de página
    if (code) {
      let type = "";
      if (location.pathname.toLowerCase().includes("/reddit")) {
        type = "reddit";
      } else if (location.pathname.toLowerCase().includes("/mastodon")) {
        type = "mastodon";
      }

      // Redirigir a /SocialMedia con el código y el tipo de página como parámetros de la ruta
      navigate(`/SocialMedia?code=${code}&source=${type}`);
    }
  }, [location, navigate]);

  return (
    <div>
      Hola
      {/* <SocialMediaPage /> */}
    </div>
  );
}

export default RouteHandler;
