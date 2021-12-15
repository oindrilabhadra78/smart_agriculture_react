import React, { useState, useEffect } from "react";
import SupplyChain2 from "../contracts/SupplyChain2.json";
import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";

window.ethereum.on("accountsChanged", () => {
    window.location.reload();
});

export const StoreItem = () => {
    const account = useSelector(selectAccount);
    const web3 = useSelector(selectWeb3);

    const [instance, setInstance] = useState();
    const [id, setId] = useState(0);
    const [weight, setWeight] = useState(0);
    const [coldStorage, setColdStorage] = useState("");

    useEffect(() => {
        const initialize = async () => {
            try {
                const networkId = await web3.eth.net.getId();

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
        };

        initialize();
    }, []);

    const storeItem = async (event) => {
        event.preventDefault();
        await instance.methods
        .storeItem(id, weight, coldStorage)
        .send({from: account});
    };

    return (
        <div className="container">
		<div className="header">Store Item</div>
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
		<label>Cold Storage Address</label>
		<input
		type="text" 
		value={coldStorage}
		onChange={(e) => setColdStorage(e.target.value)}
		/>
		</div>

		<button
		className="btn-grad"
		style={{ marginLeft: "0px", marginTop: "30px", outline: 'none', border: 'none' }}
		onClick={storeItem}>
		Submit
		</button>

		</form>
		</div>

    );
};