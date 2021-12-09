import { styled } from "../../utils/theme";
import { Link as LinkR } from "react-router-dom";

export const Nav = styled("nav", {
  background: "$primary",
  height: "80px",
  //marginTop: '-80px',
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1rem",
  position: "sticky",
  width: "100%",
  top: 0,
  zIndex: 5,

  "@bp1": {
    transition: "0.8s all ease",
  },
});

export const NavbarContainer = styled("div", {
  display: "flex",
  justifyContent: "space-between",
  height: "80px",
  maxWidth: "1200px",
  zIndex: 1,
  padding: "0px 24px",
});

export const NavLogo = styled(LinkR, {
  cursor: "pointer",
  color: "white",
  justifyContent: "flex-start",
  fontSize: "2rem",
  alignItems: "center",
  fontWeight: "bold",
  transition: "0.2s ease",
  textDecoration: "none",
  marginRight: "auto",
  marginLeft: "20px",

  "@bp2": {
    fontSize: "2.5rem",
    transition: "0.2s all ease",
  },

  "&:hover": {
    color: "white",
    textDecoration: "none",
    transform: "scale(1.15)",
    transition: "0.2s ease",
  },
});

export const NavIcon = styled("div", {
  display: "none",

  "@bp2": {
    display: "block",
    position: "absolute",
    top: 0,
    right: 0,
    height: "1.75rem",
    width: "1.75rem",
    transform: "translate(-100%, 60%)",
    fontSize: "1.8rem",
    cursor: "pointer",
    color: "#fff",
  },
});

export const NavMenu = styled("ul", {
  display: "flex",
  alignItems: "center",
  fontSize: "1.2rem",
  justifyContent: "center",
  listStyle: "none",
  textAlign: "center",

  color: "#fff",
  margin: 0,
  textDecoration: "none",
  "@bp2": {
    display: "none",
  },
});

export const NavMenuItem = styled("li", {
  height: "80px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
  marginLeft: 2,
  marginRight: 2,
});

export const NavLinks = styled(LinkR, {
  color: "#fff",
  display: "flex",
  alignItems: "center",
  textDecoration: "none",
  padding: "0 1rem",
  height: "100%",
  cursor: "pointer",
  transition: "0.2s ease",

  "&.active": {
    borderBottom: "3px solid $secondary",
  },

  "&:hover": {
    color: "white",
    textDecoration: "none",
    transform: "scale(1.1)",
    transition: "0.2s ease",
  },
});

export const NavBtn = styled("nav", {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "flex-end",
  marginLeft: "10px",
  marginRight: "10px",
  
  "@bp2": {
    display: "none",
  },
});

export const NavBtnLink = styled(LinkR, {
  borderRadius: "20px",
  background: "$secondary",
  whiteSpace: "nowrap",
  padding: "10px 20px",
  color: "$darkGrey",
  fontSize: "16px",
  outline: "none",
  border: "none",
  cursor: "pointer",
  transition: "all 0.1s ease-in-out",
  textDecoration: "none",

  "&:hover": {
    transform: "scale(1.1)",
    transition: "all 0.1s ease-in-out",
    textDecoration: "none",
    background: "#fff",
    color: "$darkGrey",
  },
});
