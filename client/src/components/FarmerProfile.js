import NavBar from "./Navbar/NavBar";
import FarmerContract from "../contracts/FarmerContract.json";
import Roles from "../contracts/Roles.json";
import { Card, ListGroup } from "react-bootstrap";
import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

window.ethereum.on("accountsChanged", () => {
    window.location.reload();
});

/*class FarmerProfile extends React.Component {
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

export default FarmerProfile;*/


export const FarmerProfile = () => {
    const account = useSelector(selectAccount);
    const web3 = useSelector(selectWeb3);

    const [roleId, setRoleId] = useState();
    const [data, setData] = useState();
    const [loading, setLoading] = useState(true);

    var networkId;

    const getRole = async () => {
        try {
            networkId = await web3.eth.net.getId();

            const deployedNetwork = Roles.networks[networkId];

            const instance = new web3.eth.Contract(
                Roles.abi,
                deployedNetwork && deployedNetwork.address
                );

            var _roleId = await instance.methods
            .getRole(account)
            .call();

            setRoleId(_roleId);
        } catch (error) {
            alert(`Error while collecting General details`);
            console.error(error);
        }
    };

    const getFarmer = async () => {
        const deployedNetwork = FarmerContract.networks[networkId];

        const instance = new web3.eth.Contract(
            FarmerContract.abi,
            deployedNetwork && deployedNetwork.address
            );

        let obj = await instance.methods.getFarmer(account).call();

        return obj;
    };


    useEffect(() => {
        const initialize = async () => {
            await getRole();
            console.log("Got role: " + roleId);

            if (roleId == 1) {
                if (data === undefined) {
                    var result = await getFarmer();
                    setData(result);
                } else {
                    setLoading(false);
                }
            }
        };

        initialize();
    }, [roleId, data]);

    console.log(loading);

    if (loading) {
        return <h3>Loading</h3>;
    } else {
        if (roleId == 1) {
            return (
                <div>
                <div className="profile">
                <h2>Farmer</h2>
                <p>Name: {data._name} </p>           
                <p className="capitalize">State Of Residence: {data._stateOfResidence} </p>
                <p>Land Owned= {data._landOwned} acres </p>
                <p>Gender: {data._gender} </p>
                <p>Latitude: {data._latitude < 0 ? (Math.abs(data._latitude).toString()+String.fromCharCode(176)+"S") : (data._latitude.toString()+String.fromCharCode(176)+"N")} </p>
                <p>Longitude: {data._longitude < 0 ? (Math.abs(data._longitude).toString()+String.fromCharCode(176)+"W") : (data._longitude.toString()+String.fromCharCode(176)+"E")} </p>
                </div>

                </div>
                );
        } else {
            return (
                <div>
                <h2>Not authenticated</h2>
                <a href="/">Home</a>
                </div>
                );
        }
    }
};