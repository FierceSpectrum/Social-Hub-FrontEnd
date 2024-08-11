import "./Header.scss";
import Navegation from "../Navegation/Navegation";
import User from "../User/User";

const Header = () => {
  return (
    <div className="nav-bar">
      <header className="header">
        <div className="navi">
          <Navegation />
        </div>
        <div className="user">
          <User />
        </div>
      </header>
    </div>
  );
};

export default Header;
