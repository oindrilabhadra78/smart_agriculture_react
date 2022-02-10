import React, { useState, useEffect } from "react";
import { useParams } from 'react-router';
import NavBar from "../components/Navbar/NavBar";
import "../App.css";
import ReactScrollableList from "react-scrollable-list";
import getWeb3 from "../getWeb3";
import PolicyContract from "../contracts/PolicyContract.json";

import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";

window.ethereum.on("accountsChanged", () => {
    window.location.reload();
});

export const GrantPolicy = (props) => {
    const account = useSelector(selectAccount);
    const web3 = useSelector(selectWeb3);

    const [address, setAddress] = useState("");
    const [instance, setInstance] = useState();
    const [id, setId] = useState(0);
    const [ethValue, setEthValue] = useState(0);

    useEffect(() => {
        const initialize = async () => {
            try {
                const networkId = await web3.eth.net.getId();

                const deployedNetwork = PolicyContract.networks[networkId];
                const instance = new web3.eth.Contract(
                    PolicyContract.abi,
                    deployedNetwork && deployedNetwork.address
                );
                setInstance(instance);
            } catch (error) {
                // Catch any errors for any of the above operations.
                alert(
                    'Check console for details.'
                );
                console.error(error);
            }
        };

        initialize();
    }, []);

    const grantPolicy = async (event) => {
        event.preventDefault();
        const receipt = await instance.methods
        .transferFunds(id, address, Math.round(new Date().getTime() / 1000))
        .send({from: account, value: ethValue});

        if(!alert("If the farmer is eligible and the time gap is correct, then funds would be transferred to the respective farmer")) {
            window.location.reload();
        }
    };

    return (
        <div className="container">
        <div className="header">Grant Policy</div>
        <form className="add-form">

        <div className="form-control">
        <label>Policy ID</label>
        <input
        type="number" 
        min="0"
        value={id}
        onChange={(e) => setId(e.target.value)}
        />
        </div>

        <div className="form-control">
        <label>Farmer Address</label>
        <input
        type="text" 
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        />
        </div>

        <div className="form-control">
        <label>Ethers to be transferred (in wei)</label>
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
        onClick={grantPolicy}>
        Submit
        </button>

        </form>
        </div>
        );

};