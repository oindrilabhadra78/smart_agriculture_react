import React from "react";
import NavBar from "./Navbar/NavBar";
import { Card, ListGroup } from "react-bootstrap";

window.ethereum.on("accountsChanged", () => {
  window.location.reload();
});

class ColdStorageProfile extends React.Component {
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
      Cold Storage
      </Card.Subtitle>
      <ListGroup variant="flush">
      <ListGroup.Item>Owner name : {this.props.ownerName}</ListGroup.Item>
      <ListGroup.Item>
      Lattitude : {this.props.latitude}
      </ListGroup.Item>
      <ListGroup.Item>
      Longitude : {this.props.longitude}
      </ListGroup.Item>
      <ListGroup.Item>
      Capacity : {this.props.capacity}
      </ListGroup.Item>
      <ListGroup.Item>
      Price : {this.props.price}
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

export default ColdStorageProfile;
