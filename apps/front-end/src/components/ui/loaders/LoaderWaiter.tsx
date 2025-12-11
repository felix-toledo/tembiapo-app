"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import LoaderWaiterMini from "./LoaderWaiterMini";

interface LoaderWaiterProps {
  messages: string[];
}

const LoaderWaiter = ({ messages }: LoaderWaiterProps) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    if (!messages || messages.length === 0) return;
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [messages]);

  const currentMessage =
    messages && messages.length > 0
      ? messages[currentMessageIndex]
      : "Cargando...";

  return (
    <StyledWrapper>
      <div className="overlay">
        <div className="loader-container">
          <LoaderWaiterMini size={100} />

          <div className="content-container">
            <p className="message text-xl font-bold tracking-wide uppercase text-gray-800" key={currentMessageIndex}>
              {currentMessage}
            </p>
            {/* Reflejos bar like LoaderSearcher */}
            <div className="bar" />
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(8px);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loader-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 32px;
    padding: 2rem;
  }

  .content-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    width: 300px;
  }

  .message {
    color: var(--color-parana-profundo);
    text-align: center;
    min-height: 1.6em;
    animation: fadeSlide 3s infinite;
  }

  @keyframes fadeSlide {
    0% {
      opacity: 0;
      transform: translateY(5px);
    }
    10% {
      opacity: 1;
      transform: translateY(0);
    }
    90% {
      opacity: 1;
      transform: translateY(0);
    }
    100% {
      opacity: 0;
      transform: translateY(-5px);
    }
  }

  .bar {
    width: 100%;
    height: 6px;
    background: linear-gradient(
      to right,
      var(--color-parana-profundo),
      var(--color-gris-fondo-claro),
      var(--color-tierra-activa),
      var(--color-gris-fondo-claro),
      var(--color-parana-profundo)
    );
    background-size: 200% 100%;
    border-radius: 10px;
    animation: shimmerBar 3s infinite linear;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  @keyframes shimmerBar {
    0% {
      background-position: 100% 0;
    }
    100% {
      background-position: -100% 0;
    }
  }
`;

export default LoaderWaiter;
