import { Link } from "react-router-dom";

import "./GlobalComponents.css";

import PhysioFindSvg from "../../assets/physiofind.svg?react";

function GlobalNav() {
  return (
    <>
      <div className="global-nav">
        <nav>
          <div className="stretch start">
            <Link to="/" className="home-btn">
              <PhysioFindSvg className="icon" />
              <span className="title">PhysioFind</span>
            </Link>
          </div>
          <div className="pages">
            <Link to="#" className="nav-btn">
              Patients
            </Link>
            <Link to="#" className="nav-btn">
              Clinics
            </Link>
            <Link to="#" className="nav-btn">
              About Us
            </Link>
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
