import React, { useState, useLayoutEffect } from "react";
import styled from "styled-components";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  z-index: 99;
  background-color: ${({ theme }) => theme === 'dark' ? '#000' : '#fff'};
  color: ${({ theme }) => theme === 'dark' ? '#fff' : '#000'};

  .menu-button {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
    svg {
        fill: ${({ theme }) => theme === 'dark' ? '#fff' : '#000'}
    }
  }

  .menu-list {
    padding: 80px 40px;
    height: 100vh;
    box-shadow: -2px 0px 20px rgba(0, 0, 0, 0.2);
    ul {
        height: calc(100% - 100px);
        overflow: auto ;
        -ms-overflow-style: none; 
        scrollbar-width: none;
        &::-webkit-scrollbar {
            display: none;
        }
      li {
        padding: 10px 0px;
      }
    }
  }
`;

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  useLayoutEffect(() => {
    if (location.pathname === '/Drei-videoTexture' 
        || location.pathname === '/horizontal-tiles'
        || location.pathname === '/image-gallery'
        || location.pathname === '/toss-internship'

        )
    {
        setTheme('dark')
    } else {
        setTheme('light')
    }
  },[location])

  return (
    <Container theme={theme} >
      <div className="menu-button" onClick={() => setIsOpen((state) => !state)}>
        {isOpen
            ? <AiOutlineClose size={30} /> 
            : <AiOutlineMenu size={30} />
        }
      </div>

      {isOpen && (
        <div className="menu-list">
          <ul>
            <li>
              <Link to={"/"}>Flying Doughnut</Link>
            </li>
            <li>
              <Link to={"/camera-pan"}>Camera Pan</Link>
            </li>
            <li>
              <Link to={"/ball-pit"}>Ball Pit</Link>
            </li>
            <li>
              <Link to={"/confetti"}>confetti</Link>
            </li>
            <li>
              <Link to={"/Drei-videoTexture"}>Drei VideoTexture</Link>
            </li>
            <li>
              <Link to={"/horizontal-tiles"}>Horizontal Tiles</Link>
            </li>
            
            <li>
              <Link to={"/html-annotation"}>Html Annotation</Link>
            </li>
            <li>
              <Link to={"/image-gallery"}>Image Gallery</Link>
            </li>
            <li>
              <Link to={"/infinite-scroll"}>Infinite Scroll</Link>
            </li>
            <li>
              <Link to={"/red-ball-clump"}>Red Ball Clump</Link>
            </li>
            <li>
              <Link to={"/soft-shadows"}>Soft Shadows</Link>
            </li>
            <li>
              <Link to={"/spingy-boxes"}>Spingy Boxes</Link>
            </li>
            <li>
              <Link to={"/spiral-stair"}>Spiral Stair</Link>
            </li>
            <li>
              <Link to={"/toss-internship"}>Toss Internship</Link>
            </li>
            <li>
              <Link to={"/wobble-sphere"}>Wobble Sphere</Link>
            </li>
          </ul>
        </div>
      )}
    </Container>
  );
};

export default Header;
