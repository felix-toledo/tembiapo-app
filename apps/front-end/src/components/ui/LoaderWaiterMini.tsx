"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";

interface LoaderWaiterMiniProps {
  size?: number;
  className?: string;
}

const LoaderWaiterMini = ({
  size = 80,
  className = "",
}: LoaderWaiterMiniProps) => {
  return (
    <StyledWrapper $size={size} className={className}>
      <div className="image-wrapper">
        <Image
          src="/isotipo.png"
          alt="Cargando..."
          width={size}
          height={size}
          className="rotating-logo"
        />
        <div className="shine" />
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{ $size: number }>`
  display: inline-flex;

  .image-wrapper {
    position: relative;
    width: ${(props) => props.$size}px;
    height: ${(props) => props.$size}px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .rotating-logo {
    width: 100%;
    height: 100%;
    animation: spin 3s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg) scale(1);
    }
    50% {
      transform: rotate(180deg) scale(1.1);
    }
    100% {
      transform: rotate(360deg) scale(1);
    }
  }
`;

export default LoaderWaiterMini;
