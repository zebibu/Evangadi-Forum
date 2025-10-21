import classes from "./Loader.module.css";
import Loading from "../../assets/load.gif";

function Loader() {
  return (
    <div className={classes.loaderContainer}>
      <img src={Loading} alt="Loading..." className={classes.loaderImage} />
      <p className={classes.loaderText}>Loading, please wait...</p>
    </div>
  );
}

export default Loader;
