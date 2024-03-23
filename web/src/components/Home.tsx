import WorkoutScreen from "../assets/WorkoutScreen.png";
import Login from "../assets/LoginScreen.png";
import HomeScreen from "../assets/HomeScreen.png";
import { ReactComponent as HomeBgSvg } from "../assets/HomeBgSvg.svg";

const Home = () => {
  return (
    <div className="home">
      <div className="home-content">
        <div className="home-left">
          <div className="home-header">
            <h1>The App For Athletes</h1>
            <h2>Plan, Train, Evaluate, Repeat.</h2>
            <p>
              Organize your training, evaluate your progress, and inspire
              others.
            </p>
            <button
              onClick={() => {
                window.location.href =
                  "https://apps.apple.com/us/app/softlete/id1590865556";
              }}
            >
              Download (Beta)
            </button>
          </div>
        </div>
        <div className="home-right">
          <img
            src={WorkoutScreen}
            alt="screenshot-login"
            id="screenshot-left"
          />
          <img src={HomeScreen} alt="screenshot" id="screenshot-middle" />
          <img src={Login} alt="screenshot-right" id="screenshot-right" />
        </div>
        <HomeBgSvg id="home-bg" />
      </div>
    </div>
  );
};

export default Home;
