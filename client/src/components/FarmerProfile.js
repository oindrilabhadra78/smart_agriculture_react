import NavBar from "./Navbar/NavBar";
import FarmerContract from "../contracts/FarmerContract.json";
import Roles from "../contracts/Roles.json";
import { Card, ListGroup } from "react-bootstrap";
import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";

window.ethereum.on("accountsChanged", () => {
    window.location.reload();
});

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

                <div>
                <Link to="/HarvestItem" style={{ textDecoration: 'none' }}>
                <button className="btn-grad" style={{ border: 'none', outline: 'none', margin: "auto", marginTop: "50px" }}>
                Harvest Item
                </button>
                </Link>
                <Link to="/NearestSeller" style={{ textDecoration: 'none' }}>
                <button className="btn-grad" style={{ border: 'none', outline: 'none', margin: "auto", marginTop: "50px" }}>
                Find Nearest Cold Storage
                </button>
                </Link>
                <Link to="/AllPolicy" style={{ textDecoration: 'none' }}>
                <button className="btn-grad" style={{ border: 'none', outline: 'none', margin: "auto", marginTop: "50px" }}>
                View All Policies
                </button>
                </Link>
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