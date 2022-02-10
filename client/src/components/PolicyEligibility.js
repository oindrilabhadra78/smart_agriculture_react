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

export const PolicyEligibility = (props) => {
    const account = useSelector(selectAccount);
    const web3 = useSelector(selectWeb3);

    const [data, setData] = useState(false);
    const [loading, setLoading] = useState(true);
    const [instance, setInstance] = useState();

    const query = new URLSearchParams(props.location.search);
    const name = query.get('name');
    const id = query.get('id');

    const checkEligibility = async () => {
        const receipt = await instance.methods
        .checkEligibility(id)
        .call({from: account});

        setData(receipt);        
    };

    useEffect(() => {
        const initialize = async () => {
            try {
                const networkId = await web3.eth.net.getId();

                const deployedNetwork = PolicyContract.networks[networkId];
                const instance = new web3.eth.Contract(
                    PolicyContract.abi,
                    deployedNetwork && deployedNetwork.address
                    );

                const receipt = await instance.methods
                .checkEligibility(id)
                .call({from: account});
                const verified = receipt ? "Yes" : "No";
                setData(verified); 

            } catch (error) {
                // Catch any errors for any of the above operations.
                alert(
                    `Check console for details.`
                    );
                console.error(error);
            }
        };

        initialize();

    }, []);

    return (
        <div className="profile">
        <p>Policy ID : {id} </p>
        <p>Policy Name : {name} </p>
        <h2>Eligible : {data} </h2>
        </div>
        );
};