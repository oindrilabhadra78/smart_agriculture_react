import NavBar from "./Navbar/NavBar";
import SupplyChain2 from "../contracts/SupplyChain2.json";
import Roles from "../contracts/Roles.json";
import { Card, ListGroup } from "react-bootstrap";
import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";

window.ethereum.on("accountsChanged", () => {
    window.location.reload();
});

export const BuyItem = () => {
    const account = useSelector(selectAccount);
    const web3 = useSelector(selectWeb3);

    const [instance, setInstance] = useState();
    const [roleId, setRoleId] = useState(0);
    const [weight, setWeight] = useState(0);
    const [id, setId] = useState(0);
    const [loading, setLoading] = useState(true);
    const [ethValue, setEthValue] = useState(0);
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

                const deployedNetwork = SupplyChain2.networks[networkId];
                const instance = new web3.eth.Contract(
                    SupplyChain2.abi,
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
            
            if (heading == "") {
                if (roleId == 2) {
                    setHeading("Buy Item from Farmer");
                } else if (roleId == 3) {
                    setHeading("Buy Item from Distributor");
                } else if (roleId == 4) {
                    setHeading("Buy Item from Retailer");
                }
            } else {
                if (roleId == 2 || roleId == 3 || roleId == 4) {
                    setLoading(false);
                }
            }
        };

        initialize();
    }, [roleId, heading]);


    const buyItem = async (event) => {
        event.preventDefault();

        if (roleId == 2) {
            await instance.methods
                .sellToDistributor(id, weight, seller)
                .send({ from: account, value: ethValue });
        } else if (roleId == 3) {
            await instance.methods
                .sellToRetailer(id, weight, seller)
                .send({ from: account, value: ethValue });
        } else if (roleId == 4) {
            await instance.methods
                .sellToConsumer(id, weight, seller)
                .send({ from: account, value: ethValue });
        }
    };


    if (loading) {
        return <h3>Loading...</h3>;
    } else {
        return (
            <div className="container">
        <div className="header">{heading}</div>
        <form className="add-form">

        <div className="form-control">
        <label>Product ID</label>
        <input
        type="number" 
        min="0"
        value={id}
        onChange={(e) => setId(e.target.value)}
        />
        </div>

        <div className="form-control">
        <label>Weight</label>
        <input
        type="number" 
        min="0"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        />
        </div>

        <div className="form-control">
        <label>Seller Address</label>
        <input
        type="text"
        value={seller}
        onChange={(e) => setSeller(e.target.value)}
        />
        </div>

        <div className="form-control">
        <label>Price (in wei)</label>
        <input
        type="number"
        min="0"
        value={ethValue}
        onChange={(e) => setEthValue(e.target.value)}
        />
        </div>

        <button
        className="btn-grad"
        style={{ marginLeft: "0px", marginTop: "30px", outline: 'none', border: 'none' }}
        onClick={buyItem}>
        Submit
        </button>

        </form>
        </div>

        );
    }

};