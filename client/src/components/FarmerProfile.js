import React from "react";
import NavBar from "./Navbar/NavBar";
import { Card, ListGroup } from "react-bootstrap";

window.ethereum.on("accountsChanged", () => {
  window.location.reload();
});

class FarmerProfile extends React.Component {
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
      Farmer
      </Card.Subtitle>
      <ListGroup variant="flush">
      <ListGroup.Item>Name : {this.props.name}</ListGroup.Item>
      <ListGroup.Item>Gender : {this.props.gender} </ListGroup.Item>
      <ListGroup.Item>
      State of residence : {this.props.stateOfResidence}
      </ListGroup.Item>
      <ListGroup.Item>
      Land Owned : {this.props.landOwned} acre
      </ListGroup.Item>
      <ListGroup.Item>
      Lattitude : {this.props.latitude}
      </ListGroup.Item>
      <ListGroup.Item>
      Longitude : {this.props.longitude}
      </ListGroup.Item>
      <ListGroup.Item>
      Verification Status : {this.props.isEligible}
      </ListGroup.Item>
      </ListGroup>
      </Card.Body>
      </Card>
      </div>
      </div>
      </div>
      );
  }
}

export default FarmerProfile;
