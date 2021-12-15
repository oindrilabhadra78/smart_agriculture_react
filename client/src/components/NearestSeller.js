import NavBar from "./Navbar/NavBar";
import DistanceOptimizer from "../contracts/DistanceOptimizer.json";
import Roles from "../contracts/Roles.json";
import { Card, ListGroup } from "react-bootstrap";
import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";

window.ethereum.on("accountsChanged", () => {
    window.location.reload();
});

export const NearestSeller = () => {
    const account = useSelector(selectAccount);
    const web3 = useSelector(selectWeb3);

    const [instance, setInstance] = useState();
    const [roleId, setRoleId] = useState(0);
    const [loading, setLoading] = useState(true);
    const [heading, setHeading] = useState("");
    const [seller, setSeller] = useState("");

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

    useEffect(() => {
        const initialize = async () => {
            try {
                networkId = await web3.eth.net.getId();

                const deployedNetwork = DistanceOptimizer.networks[networkId];
                const instance = new web3.eth.Contract(
                    DistanceOptimizer.abi,
                    deployedNetwork && deployedNetwork.address
                );
                setInstance(instance);
            } catch (error) {
                // Catch any errors for any of the above operations.
                alert(
                    `Failed to load web3, accounts, or contract. Check console for details.`
                );
                console.error(error);
            }

            await getRole();

            var nearestSeller;

            if (heading == "") {
                if (roleId == 1) {
                    setHeading("Nearest Cold Storage");
                } else if (roleId == 2) {
                    setHeading("Nearest Farmer");
                } else if (roleId == 3) {
                    setHeading("Nearest Distributor");
                }
            } else {
                if (roleId == 1 || roleId == 2 || roleId == 3) {
                    setLoading(false);
                    nearestSeller = await getNearestSeller();
                }
            }

            setSeller(nearestSeller);
        };

        initialize();
    }, [roleId, heading, seller]);


    const getNearestSeller = async () => {
        var nearestSeller = "";
        if (roleId == 1) {
            nearestSeller = await instance.methods
                .getNearestColdStorage()
                .call({ from: account });
        } else if (roleId == 2) {
            nearestSeller = await instance.methods
                .getNearestFarmer()
                .call({ from: account });
        } else if (roleId == 3) {
            nearestSeller = await instance.methods
                .getNearestDistributor()
                .call({ from: account });
            console.log(roleId);
        }

        return nearestSeller;
    };


    if (loading) {
        return <h3>Loading...</h3>;
    } else {
        return (
            <div className="container" style={{minHeight: "50px",  lineHeight: "100px", textAlign: "center"}}>
            <div className="header">{heading}</div>
            <span style={{borderRadius: "8px", lineHeight: "64px", width: "520px", boxShadow: "0 5px 7px -1px rgba(51, 51, 51, 0.23)", fontSize: "20px",
            "fontFamily": "Segoe UI", "margin": "50px auto", "textAlign": "center", display: "inline-block", verticalAlign: "middle"}}>{seller}</span> </div>

        );
    }

};