import React from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";

export const Landing = () => {
  const router = useNavigate();

  return (
    <div className="landingPageContainer">
      <nav>
        <div className="navHeader">
          <h2>Video Confrencing</h2>
        </div>
        <div className="navList">
          <p onClick={() => router("/aayush")}>Join as Guest</p>
          <p
            onClick={() => {
              router("/auth");
            }}
          >
            Register
          </p>
          <div role="button">
            <p
              onClick={() => {
                router("/auth");
              }}
            >
              Login
            </p>
          </div>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div>
          <h1>
            <span style={{ color: "#ff9839" }}>Connect</span> with your loved
            ones
          </h1>
          <p>Cover a distance by Meet Young Decade</p>
          <div role="button">
            <Link to={"/auth"}>Get Started</Link>
          </div>
        </div>

        <div>
          <img src="/mobile.png" alt="" srcset="" />
        </div>
      </div>
    </div>
  );
};
