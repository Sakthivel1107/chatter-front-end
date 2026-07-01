import { BsChatDots, BsBoxArrowInRight, BsPersonPlus } from "react-icons/bs";
import "./LandingPage.css";
import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();
  return (
    <div className="landing-page">
      {/* Left Section */}
      <div className="left-section">
        <div className="logo">
          <BsChatDots className="logo-icon" />
          <h1>Chatter</h1>
        </div>

        <h2>
          Connect. <span>Chat.</span> Share.
        </h2>

        <p>
          Stay in touch with the people who matter.
          <br />
          Simple, secure and reliable messaging for everyone.
        </p>

        <div className="buttons">
          <button className="login-btn" onClick={() => navigate("/login")}>
            <BsBoxArrowInRight />
            Login
          </button>

          <button className="register-btn" onClick={() => navigate("/register")}>
            <BsPersonPlus />
            Register
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="phone-mockup">
          <div className="phone-header">
            <div className="avatar"></div>
            <span>Chatter</span>
          </div>

          <div className="message left"></div>

          <div className="message right"></div>

          <div className="message left"></div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;