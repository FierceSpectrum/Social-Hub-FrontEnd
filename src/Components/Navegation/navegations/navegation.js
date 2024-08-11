import "./navegation.scss";
import { Link } from "react-router-dom";

const navegation = () => {
  return (
    <div>
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
    </div>
  );
};

export default navegation;
