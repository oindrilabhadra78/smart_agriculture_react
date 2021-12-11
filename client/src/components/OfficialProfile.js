import NavBar from "./Navbar/NavBar";
import GovernmentContract from "../contracts/GovernmentContract.json";
import Roles from "../contracts/Roles.json";
import { Card, ListGroup } from "react-bootstrap";
import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";

window.ethereum.on("accountsChanged", () => {
    window.location.reload();
});

export const OfficialProfile = () => {
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

    const getGovt = async () => {
        const deployedNetwork = GovernmentContract.networks[networkId];

        const instance = new web3.eth.Contract(
            GovernmentContract.abi,
            deployedNetwork && deployedNetwork.address
            );

        let obj = await instance.methods.getOfficial(account).call();

        return obj;
    };


    useEffect(() => {
        const initialize = async () => {
            await getRole();
            console.log("Got role: " + roleId);

            if (roleId == 6) {
                if (data === undefined) {
                    var result = await getGovt();
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
        if (roleId == 6) {
            return (
            <div>
            <h1>Government Official</h1>
            <h3>Name:{data._name} </h3>           
            <h3>Employee Id:{data._govId}</h3>

            <Link to="/UnverifiedActors">
            <button type="button">
            Unverified Actors
            </button>
            </Link>

            <Link to="/VerifyActors">
            <button type="button">
            Verify Actors
            </button>
            </Link>

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

