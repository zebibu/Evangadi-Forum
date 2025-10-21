import classes from "./About.module.css";
import { Link } from "react-router-dom";
const About = () => {
  return (
    <section className={classes.outer_about_wrapper}>
      <section className={classes.about_container}>
        <div className={classes.about}>
          <p className={classes.about_title}>About</p>
        </div>
        {/* title container  */}
        <div>
          <h1>Evangadi Networks</h1>
        </div>
        {/* paragraph container  */}
        <div className={classes.about__detail}>
          <p>
            No matter what stage of life you are in, whether you’re just
            starting elementary school or being promoted to CEO of a Fortune 500
            company, you have much to offer to those who are trying to follow in
            your footsteps.
          </p>
          <p>
            Whether you are willing to share your knowledge or you are just
            looking to meet mentors of your own, please start by joining the
            network here.
          </p>
        </div>
        <div>
          <Link to="/how-it-works">
            <button className={classes.about_btn}>HOW IT WORKS</button>
          </Link>
        </div>
      </section>
    </section>
  );
};

export default About;
