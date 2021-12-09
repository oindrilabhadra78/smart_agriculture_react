import React from "react";
import "../App.css";
import { Redirect } from "react-router-dom";
import NavBar from "./Navbar/NavBar";
import { Link } from "react-router-dom";
import Container from "react-bootstrap/Container";

export const Login = ({ roleID }) => {
  console.log("Role is ",roleID)
  if (roleID == 1) {
    return <Redirect to="/FarmerProfile" />;
  } else if (roleID == 2) {
    return <Redirect to="/DistributorProfile" />;
  } else if (roleID == 3) {
    return <Redirect to="/RetailerProfile" />;
  } else if (roleID == 4){
    return <Redirect to="/ConsumerProfile" />;
  } else if (roleID == 5){
    return <Redirect to="/ColdStorageProfile" />;
  } else if (roleID == 6){
    return <Redirect to="/GovtProfile" />;
  }
  else
    return (
      <div>
        <NavBar />
        {roleID == 0 && (
          <Container>
            <h3>
              You have not registered, please register to access your profile
            </h3>
            <h4>
              If you have already registered, your registration form is still
              under the verification process. Please try again after some time.
            </h4>
            <Link to="/" className="btn">
              Home
            </Link>
          </Container>
        )}
      </div>
    );
};
