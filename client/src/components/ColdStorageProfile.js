import NavBar from "./Navbar/NavBar";
import ColdStorageContract from "../contracts/ColdStorageContract.json";
import Roles from "../contracts/Roles.json";
import { Card, ListGroup } from "react-bootstrap";
import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";

window.ethereum.on("accountsChanged", () => {
    window.location.reload();
});

export const ColdStorageProfile = () => {
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

    const getColdStorage = async () => {
        const deployedNetwork = ColdStorageContract.networks[networkId];

        const instance = new web3.eth.Contract(
            ColdStorageContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        let obj = await instance.methods.getColdStorage(account).call();

        return obj;
    };


    useEffect(() => {
        const initialize = async () => {
            await getRole();
            console.log("Got role: " + roleId);

            if (roleId == 5) {
                if (data === undefined) {
                    var result = await getColdStorage();
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
        if (roleId == 5) {
            return (
                <div>
                <div className="profile">
                <h2>ColdStorage</h2>
                <p>Owner Name: {data._ownerName} </p> 
                <p>Latitude: {data._latitude < 0 ? (Math.abs(data._latitude).toString()+String.fromCharCode(176)+"S") : (data._latitude.toString()+String.fromCharCode(176)+"N")} </p>
                <p>Longitude: {data._longitude < 0 ? (Math.abs(data._longitude).toString()+String.fromCharCode(176)+"W") : (data._longitude.toString()+String.fromCharCode(176)+"E")} </p>
                <p>Price: {data._price} wei</p>
                <p>Capacity: {data._capacity} </p>
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