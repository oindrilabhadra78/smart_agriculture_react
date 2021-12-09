import React, { useState } from "react";
import NavBar from "../components/Navbar/NavBar";
import "../App.css";
import TopCarousel from "../components/TopCarousel";
import Sidebar from "../components/Sidebar/Sidebar";

export const HomePage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* <Sidebar isOpen={isOpen} toggle={toggle} /> */}
      <NavBar toggle={toggle} />
      <div>Welcome to home page!</div>
    </div>
  );
};
