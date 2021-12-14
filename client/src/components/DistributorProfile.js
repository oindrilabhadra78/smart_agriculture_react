import NavBar from "./Navbar/NavBar";
import DistributorContract from "../contracts/DistributorContract.json";
import Roles from "../contracts/Roles.json";
import { Card, ListGroup } from "react-bootstrap";
import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

window.ethereum.on("accountsChanged", () => {
    window.location.reload();
});


/*class DistributorProfile extends React.Component {
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
      Distributor
      </Card.Subtitle>
      <ListGroup variant="flush">
      <ListGroup.Item>Name : {this.props.name}</ListGroup.Item>
      <ListGroup.Item>Contact : {this.props.contact}</ListGroup.Item>
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

export default DistributorProfile;*/

export const DistributorProfile = () => {
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

    const getDistributor = async () => {
        const deployedNetwork = DistributorContract.networks[networkId];

        const instance = new web3.eth.Contract(
            DistributorContract.abi,
            deployedNetwork && deployedNetwork.address
            );

        let obj = await instance.methods.getDistributor(account).call();

        return obj;
    };


    useEffect(() => {
        const initialize = async () => {
            await getRole();
            console.log("Got role: " + roleId);

            if (roleId == 2) {
                if (data === undefined) {
                    var result = await getDistributor();
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
        return <h1>Loading</h1>;
    } else {
        if (roleId == 2) {
            return (
                <div>
                <div className="profile">
                <h2>Distributor</h2>
                <p>Name: {data._name} </p>           
                <p>Contact: {data._contact}</p>
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