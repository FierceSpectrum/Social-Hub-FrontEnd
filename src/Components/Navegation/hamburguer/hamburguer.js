import "./hamburguer.scss";
import { Link } from "react-router-dom";

const hamburguer = () => {
  return (
    <div className="NavCell">
      <div className="MenuHB">
        <input className="checkbox" type="checkbox" />
        <div className="Menu">
          <span className="line line1"></span>
          <span className="line line2"></span>
          <span className="line line3"></span>
        </div>
        <nav className="NavItems">
          <ul className="Items">
            <li>
              <Link to="/Home">Home</Link>
            </li>
            <li>
              <Link to="/Post">Create Post</Link>
            </li>
            <li>
              <Link to="/Schedule">Cronograma</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default hamburguer;
