import "./GlobalComponents.css";
import PhysioFindSvg from "../../assets/physiofind.svg?react";

function GlobalNav() {
  return (
    <>
      <div className="global-nav">
        <nav>
          <div className="stretch start">
            <a href="#" className="home-btn">
              <PhysioFindSvg className="icon" />
              <span className="title">PhysioFind</span>
            </a>
          </div>
          <div className="pages">
            <a href="#" className="nav-btn">
              Patients
            </a>
            <a href="#" className="nav-btn">
              Clinics
            </a>
            <a href="#" className="nav-btn">
              About Us
            </a>
          </div>
          <div className="stretch end">
            <button className="account-btn">
              <span className="material-symbols-outlined icon">
                account_circle
              </span>
            </button>
          </div>
        </nav>
      </div>
    </>
  );
}

export default GlobalNav;
