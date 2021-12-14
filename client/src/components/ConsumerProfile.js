import NavBar from "./Navbar/NavBar";
import ConsumerContract from "../contracts/ConsumerContract.json";
import Roles from "../contracts/Roles.json";
import { Card, ListGroup } from "react-bootstrap";
import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

window.ethereum.on("accountsChanged", () => {
    window.location.reload();
});

/*class ConsumerProfile extends React.Component {
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
      Consumer
      </Card.Subtitle>
      <ListGroup variant="flush">
      <ListGroup.Item>Name : {this.props.name}</ListGroup.Item>
      <ListGroup.Item>Contact : {this.props.contact}</ListGroup.Item>
      </ListGroup>
      </Card.Body>
      </Card>
      </div>
      </div>
      </div>
      );
  }
}

export default ConsumerProfile;*/


export const ConsumerProfile = () => {
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

    const getConsumer = async () => {
        const deployedNetwork = ConsumerContract.networks[networkId];

        const instance = new web3.eth.Contract(
            ConsumerContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        let obj = await instance.methods.getConsumer(account).call();

        return obj;
    };


    useEffect(() => {
        const initialize = async () => {
            await getRole();
            console.log("Got role: " + roleId);

            if (roleId == 4) {
                if (data === undefined) {
                    var result = await getConsumer();
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
        if (roleId == 4) {
            return (
                <div>
                <div className="profile">
                <h2>Consumer</h2>
                <p>Name: {data._name} </p>           
                <p>Contact: {data._contact}</p>
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