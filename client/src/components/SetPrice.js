import React, { useState, useEffect } from "react";
import SupplyChain from "../contracts/SupplyChain.json";
import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";

window.ethereum.on("accountsChanged", () => {
    window.location.reload();
});

export const SetPrice = () => {
    const account = useSelector(selectAccount);
    const web3 = useSelector(selectWeb3);

    const [instance, setInstance] = useState();
    const [product, setProduct] = useState("");
    const [base, setBase] = useState(0);
    const [profitDis, setProfitDis] = useState(0);
    const [profitRet, setProfitRet] = useState(0);

    useEffect(() => {
        const initialize = async () => {
            try {
                const networkId = await web3.eth.net.getId();

                const deployedNetwork = SupplyChain.networks[networkId];
                const instance = new web3.eth.Contract(
                    SupplyChain.abi,
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

    const setPrice = async (event) => {
        event.preventDefault();
        await instance.methods
        .setPrice(product, base, profitDis, profitRet)
        .send({from: account});
    };

    return (
        <div className="container">
        <div className="header">Set Price of Item</div>
        <form className="add-form">

        <div className="form-control">
        <label>Product Name</label>
        <input
        type="text"
        value={product}
        onChange={(e) => setProduct(e.target.value)}
        />
        </div>

        <div className="form-control">
        <label>Base Price (wei)</label>
        <input
        type="number"
        min="0"
        value={base}
        onChange={(e) => setBase(e.target.value)}
        />
        </div>

        <div className="form-control">
        <label>Profit Percentage for Distributor</label>
        <input
        type="number"
        min="0"
        value={profitDis}
        onChange={(e) => setProfitDis(e.target.value)}
        />
        </div>

        <div className="form-control">
        <label>Profit Percentage for Retailer</label>
        <input
        type="number"
        min="0"
        value={profitRet}
        onChange={(e) => setProfitRet(e.target.value)}
        />
        </div>

        <button
        className="btn-grad"
        style={{ marginLeft: "0px", marginTop: "30px", outline: 'none', border: 'none' }}
        onClick={setPrice}>
        Submit
        </button>

        </form>
        </div>

    );
};