import React from "react";

import {
  SidebarContainer,
  Icon,
  CloseIcon,
  SidebarLink,
  SidebarWrapper,
  SidebarMenu,
  SidebarBtnWrap,
  SidebarButton,
} from "./SidebarStyled";
const Sidebar = ({ isOpen, toggle }) => {
  return (
    <SidebarContainer isOpen={isOpen} onClick={toggle}>
      <Icon onClick={toggle}>
        <CloseIcon />
      </Icon>
      <SidebarWrapper>
        <SidebarMenu>
          <SidebarLink to="/FarmerPage">Farmer</SidebarLink>
          <SidebarLink to="/OfficialPage">Official</SidebarLink>
          <SidebarLink to="/ColdStoragePage">Cold Storage</SidebarLink>
          <SidebarLink to="/BuyColdStorage">Buy Cold Storage</SidebarLink>
        </SidebarMenu>
      </SidebarWrapper>
      <SidebarBtnWrap>
        <SidebarButton to="/Login">Profile</SidebarButton>
      </SidebarBtnWrap>
    </SidebarContainer>
  );
};

export default Sidebar;
