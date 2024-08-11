import "./Navegation.scss";
import Hamburguer from "./hamburguer/hamburguer";
import NavegationD from "./navegations/navegation";
import { useEffect } from "react";
import { useState } from "react";

const Navegation = () => {
  const [windowSize, setWindowSize] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div>
      <nav className="navigation">
        <div>{windowSize <= 768 ? <Hamburguer /> : <NavegationD />}</div>
      </nav>
    </div>
  );
};

export default Navegation;
