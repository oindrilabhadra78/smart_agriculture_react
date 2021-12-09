import React from "react";
import NavBar from "./Navbar/NavBar";
import { Card, ListGroup } from "react-bootstrap";

window.ethereum.on("accountsChanged", () => {
  window.location.reload();
});

class GovtProfile extends React.Component {
  render() {
    return (
      <div>
      <NavBar />
      <div className="row">
      <div className="col-7">
      </div>
      <div className="col-5">
      <Card style={{ width: "18rem" }}>
      <Card.Body>
      <Card.Title>Profile</Card.Title>
      <Card.Subtitle className="mb-2 text-muted">
      Government Official
      </Card.Subtitle>
      <ListGroup variant="flush">
      <ListGroup.Item>Name : {this.props.name}</ListGroup.Item>
      <ListGroup.Item>Contact : {this.props.govId}</ListGroup.Item>
      </ListGroup>
      </Card.Body>
      </Card>
      </div>
      </div>
      </div>
      );
  }
}

export default GovtProfile;
