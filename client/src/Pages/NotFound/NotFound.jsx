// Pages/NotFound/NotFound.jsx
import { Link } from "react-router-dom";
import classes from "./NotFound.module.css";

const NotFound = () => {
  return (
    <div className={classes.container}>
      <h1>404</h1>
      <p>Oops! The page you are looking for does not exist.</p>
      <Link to="/" className={classes.homeBtn}>
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
