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
    const [base, setBase] = useState(0);
    const [profitDis, setProfitDis] = useState(0);
    const [profitRet, setProfitRet] = useState(0);
    const [crop, setCrop] = useState("");
    const [cropTypes, setCropTypes] = useState({
        '': 'Select',
        'arecanut': 'Arecanut',
        'arhar/tur': 'Arhar/Tur',
        'bajra': 'Bajra',
        'banana': 'Banana',
        'barley': 'Barley',
        'bhindi': 'Bhindi',
        'black pepper': 'Black Pepper',
        'blackgram': 'Blackgram',
        'brinjal': 'Brinjal',
        'cabbage': 'Cabbage',
        'cardamom': 'Cardamom',
        'carrot': 'Carrot',
        'cashewnut': 'Cashewnut',
        'castor seed': 'Castor Seed',
        'chillies': 'Chillies',
        'citrus fruit': 'Citrus Fruit',
        'coconut': 'Coconut',
        'coffee': 'Coffee',
        'coriander': 'Coriander',
        'cotton': 'Cotton',
        'cowpea(lobia)': 'Cowpea (Lobia)',
        'drum stick': 'Drum Stick',
        'garlic': 'Garlic',
        'ginger': 'Ginger',
        'gram': 'Gram',
        'grapes': 'Grapes',
        'groundnut': 'Groundnut',
        'guar seed': 'Guar Seed',
        'horse-gram': 'Horse-Gram',
        'jack fruit': 'Jack Fruit',
        'jowar': 'Jowar',
        'jute': 'Jute',
        'khesari': 'Khesari',
        'korra': 'Korra',
        'lentil': 'Lentil',
        'linseed': 'Linseed',
        'maize': 'Maize',
        'mango': 'Mango',
        'masoor': 'Masoor',
        'mesta': 'Mesta',
        'mothbeans': 'Mothbeans',
        'mungbean': 'Mungbean',
        'niger seed': 'Niger Seed',
        'onion': 'Onion',
        'orange': 'Orange',
        'papaya': 'Papaya',
        'pineapple': 'Pineapple',
        'pomegranate': 'Pomegranate',
        'potato': 'Potato',
        'ragi': 'Ragi',
        'rapeseed &mustard': 'Rapeseed & Mustard',
        'redish': 'Radish',
        'rice': 'Rice',
        'rubber': 'Rubber',
        'safflower': 'Safflower',
        'samai': 'Samai',
        'sannhamp': 'Sannhamp',
        'sesamum': 'Sesamum',
        'small millets': 'Small Millets',
        'soyabean': 'Soyabean',
        'sugarcane': 'Sugarcane',
        'sunflower': 'Sunflower',
        'sweet potato': 'Sweet Potato',
        'tapioca': 'Tapioca',
        'tea': 'Tea',
        'tobacco': 'Tobacco',
        'tomato': 'Tomato',
        'turmeric': 'Turmeric',
        'turnip': 'Turnip',
        'urad': 'Urad',
        'varagu': 'Varagu',
        'wheat': 'Wheat'
    });


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
        .setPrice(crop, base, profitDis, profitRet)
        .send({from: account});
    };

    return (
        <div className="container">
        <div className="header">Set Price of Item</div>
        <form className="add-form">

        <div className="form-control">
        <label>Crop Name</label>
        <select className="drop-down" value={crop} onChange={(e) => setCrop(e.target.value)}>
        {
            Object.entries(cropTypes).map(([key, value]) => {
                return (
                    <option value={key}>{value}</option>
                    )
            })          
        }
        
        </select>
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