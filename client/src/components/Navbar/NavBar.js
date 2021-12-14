import React from "react";
import {
  Nav,
  NavLogo,
  NavbarContainer,
  NavIcon,
  NavMenu,
  NavMenuItem,
  NavLinks,
  NavBtn,
  NavBtnLink,
} from "./NavbarStyled";
import { MenuOutline } from "@styled-icons/evaicons-outline";

const NavBar = ({ toggle }) => {
  return (
    // <Navbar collapseOnSelect bg="dark" variant="dark">
    //   <Navbar.Brand href="/">Farmicy</Navbar.Brand>
    //   <Nav className="mr-auto">
    //     <NavDropdown title="Registration" id="basic-nav-dropdown">
    //       <NavDropdown.Item href="/FarmerPage">Farmer</NavDropdown.Item>
    //       <NavDropdown.Item href="/OfficialPage">
    //         Government Official{" "}
    //       </NavDropdown.Item>
    //       <NavDropdown.Item href="/ColdStoragePage">
    //         Cold Storage
    //       </NavDropdown.Item>
    //     </NavDropdown>
    //     <Nav.Link href="/BuyColdStorage">Buy Cold Storage</Nav.Link>
    //   </Nav>
    //   <Nav>
    //     <Nav.Link href="/login">Profile</Nav.Link>
    //   </Nav>
    // </Navbar>
    <Nav>
      <NavLogo to="/">Smart Farming</NavLogo>
      <NavbarContainer>
        <NavIcon onClick={toggle}>
          <MenuOutline/>
        </NavIcon>
        
      </NavbarContainer>
      <NavBtn>
        <NavBtnLink to="/Login">Login</NavBtnLink>
      </NavBtn>
      <NavBtn style={{marginRight: "40px"}}>
        <NavBtnLink to="/Register">Register</NavBtnLink>
      </NavBtn>
    </Nav>
  );
};

export default NavBar;
