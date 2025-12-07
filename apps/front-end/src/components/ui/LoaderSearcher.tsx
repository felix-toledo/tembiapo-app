"use client";

import React from "react";
import styled from "styled-components";

const Loader = () => {
  return (
    <StyledWrapper>
      <div className="loader">
        <div className="loaderMiniContainer">
          <div className="barContainer">
            <span className="bar" />
            <span className="bar bar2" />
          </div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 101 114"
            className="svgIcon"
          >
            <circle
              strokeWidth={7}
              stroke="black"
              transform="rotate(36.0692 46.1726 46.1727)"
              r="29.5497"
              cy="46.1727"
              cx="46.1726"
            />
            <line
              strokeWidth={7}
              stroke="black"
              y2="111.784"
              x2="97.7088"
              y1="67.7837"
              x1="61.7089"
            />
          </svg>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .loader {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .loaderMiniContainer {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 130px;
    height: fit-content;
  }
  .barContainer {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 10px;
    background-position: left;
  }
  .bar {
    width: 100%;
    height: 8px;
    background: linear-gradient(
      to right,
      var(--color-parana-profundo),
      var(--color-gris-fondo-claro),
      var(--color-parana-profundo)
    );
    background-size: 200% 100%;
    border-radius: 10px;
    animation: bar ease-in-out 3s infinite alternate-reverse;
  }
  @keyframes bar {
    0% {
      background-position: left;
    }
    100% {
      background-position: right;
    }
  }
  .bar2 {
    width: 50%;
  }
  .svgIcon {
    position: absolute;
    left: -25px;
    margin-top: 18px;
    z-index: 2;
    width: 70%;
    animation: search ease-in-out 3s infinite alternate-reverse;
  }
  @keyframes search {
    0% {
      transform: translateX(0%) rotate(70deg);
    }

    100% {
      transform: translateX(100px) rotate(10deg);
    }
  }
  .svgIcon circle,
  line {
    stroke: var(--color-tierra-activa);
  }
  .svgIcon circle {
    fill: rgba(232, 94, 37, 0.2); /* Transparent Tierra Activa */
  }
`;

export default Loader;
