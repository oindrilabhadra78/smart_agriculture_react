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
    const [crop, setCrop] = useState("");
    const [loading, setLoading] = useState(true);
    const [ethValue, setEthValue] = useState(0);
    const [heading, setHeading] = useState("");
    const [seller, setSeller] = useState("");
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
            
            if (heading === "") {
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
    }, [roleId, heading, loading]);


    const buyItem = async (event) => {
        event.preventDefault();

        if (roleId == 2) {
            const receipt = await instance.methods
                .buyFromFarmer(crop, weight, seller)
                .send({ from: account, value: ethValue });
            alert("The Product IDs of the crop you purchased are " + receipt.events.ProductIDGeneratedDistributor.returnValues[0]);
        } else if (roleId == 3) {
            const receipt = await instance.methods
                .buyFromDistributor(crop, weight, seller)
                .send({ from: account, value: ethValue });
            alert("The Product IDs of the crop you purchased are " + receipt.events.ProductIDGeneratedRetailer.returnValues[0]);
        } else if (roleId == 4) {
            const receipt = await instance.methods
                .buyFromRetailer(crop, weight, seller)
                .send({ from: account, value: ethValue });
            alert("The Product IDs of the crop you purchased are " + receipt.events.ProductIDGeneratedConsumer.returnValues[0]);
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