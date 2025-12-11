"use client";

import React from "react";
import styled from "styled-components";

interface OurButtonProps {
  children: React.ReactNode;
  frontColor?: string;
  edgeColor?: string;
  shadowColor?: string;
  textColor?: string;
  outlineColor?: string;
  onClick?: () => void;
}

const OurButton = ({
  children,
  frontColor = "var(--color-parana-profundo)",
  edgeColor, // default handled in styled comp if not passed
  shadowColor = "var(--color-gris-oscuro)",
  textColor = "var(--color-blanco-puro)",
  outlineColor = "var(--color-tierra-activa)",
  onClick,
}: OurButtonProps) => {
  return (
    <StyledWrapper
      $frontColor={frontColor}
      $edgeColor={edgeColor}
      $shadowColor={shadowColor}
      $textColor={textColor}
      $outlineColor={outlineColor}
    >
      <button className="pushable" {...(onClick ? { onClick } : {})}>
        <span className="shadow" />
        <span className="edge" />
        <span className="front"> {children} </span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div<{
  $frontColor: string;
  $edgeColor?: string;
  $shadowColor: string;
  $textColor: string;
  $outlineColor: string;
}>`
  .pushable {
    position: relative;
    background: transparent;
    padding: 0px;
    border: none;
    cursor: pointer;
    outline-offset: 4px;
    outline-color: ${(props) => props.$outlineColor};
    transition: filter 250ms;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    width: 100%;
  }

  .shadow {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background: ${(props) => props.$shadowColor};
    border-radius: 8px;
    filter: blur(2px);
    will-change: transform;
    transform: translateY(2px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
  }

  .edge {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    border-radius: 8px;
    background: ${(props) =>
      props.$edgeColor ||
      `linear-gradient(
      to right,
      var(--color-gris-oscuro) 0%,
      ${props.$frontColor} 8%,
      var(--color-gris-oscuro) 92%,
      ${props.$frontColor} 100%
    )`};
  }

  .front {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    position: relative;
    border-radius: 8px;
    background: ${(props) => props.$frontColor};
    padding: 16px 32px;
    color: ${(props) => props.$textColor};
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    font-size: 1rem;
    transform: translateY(-4px);
    transition: transform 600ms cubic-bezier(0.3, 0.7, 0.4, 1);
  }

  .pushable:hover {
    filter: brightness(110%);
  }

  .pushable:hover .front {
    transform: translateY(-6px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
  }

  .pushable:active .front {
    transform: translateY(-2px);
    transition: transform 34ms;
  }

  .pushable:hover .shadow {
    transform: translateY(4px);
    transition: transform 250ms cubic-bezier(0.3, 0.7, 0.4, 1.5);
  }

  .pushable:active .shadow {
    transform: translateY(1px);
    transition: transform 34ms;
  }

  .pushable:focus:not(:focus-visible) {
    outline: none;
  }
`;

export default OurButton;
