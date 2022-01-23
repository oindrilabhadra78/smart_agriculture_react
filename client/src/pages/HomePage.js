import React, { useState } from "react";
import NavBar from "../components/Navbar/NavBar";
import "../App.css";
import TopCarousel from "../components/TopCarousel";
import Sidebar from "../components/Sidebar/Sidebar";
import Popup from "../utils/Popup";
import { Link } from 'react-router-dom';
import getWeb3 from "../getWeb3";
import FarmerContract from "../contracts/FarmerContract.json";
import DistributorContract from "../contracts/DistributorContract.json";
import RetailerContract from "../contracts/RetailerContract.json";
import ConsumerContract from "../contracts/ConsumerContract.json";
import GovernmentContract from "../contracts/GovernmentContract.json";
import ColdStorageContract from "../contracts/ColdStorageContract.json";
import SupplyChain from "../contracts/SupplyChain.json";

import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";

window.ethereum.on("accountsChanged", () => {
  window.location.reload();
});

export const HomePage = () => {
  const account = useSelector(selectAccount);
  const web3 = useSelector(selectWeb3);

  const [isOpen, setIsOpen] = useState(false);
  const [isSeen1, setIsSeen1] = useState(false);
  const [isSeen2, setIsSeen2] = useState(false);
  const [isSeen3, setIsSeen3] = useState(false);
  const [isSeen4, setIsSeen4] = useState(false);
  const [isSeen5, setIsSeen5] = useState(false);
  const [isSeen6, setIsSeen6] = useState(false);
  const [isSeen7, setIsSeen7] = useState(false);
  const [isSeen8, setIsSeen8] = useState(false);
  const [view1, setView1] = useState(false);
  const [view2, setView2] = useState(false);
  const [view3, setView3] = useState(false);
  const [view4, setView4] = useState(false);
  const [view5, setView5] = useState(false);
  const [view6, setView6] = useState(false);
  const [view7, setView7] = useState(false);
  const [view8, setView8] = useState(false);

  const [address, setAddress] = useState("");
  const [data, setData] = useState();
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

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  const togglePopup1 = () => {
    setIsSeen1(!isSeen1);
    setAddress("");
    setView1(false);
    setData();
  };

  const togglePopup2 = () => {
    setIsSeen2(!isSeen2);
    setAddress("");
    setView2(false);
    setData();
  };

  const togglePopup3 = () => {
    setIsSeen3(!isSeen3);
    setAddress("");
    setView3(false);
    setData();
  };

  const togglePopup4 = () => {
    setIsSeen4(!isSeen4);
    setAddress("");
    setView4(false);
    setData();
  };

  const togglePopup5 = () => {
    setIsSeen5(!isSeen5);
    setAddress("");
    setView5(false);
    setData();
  };

  const togglePopup6 = () => {
    setIsSeen6(!isSeen6);
    setAddress("");
    setView6(false);
    setData();
  };

  const togglePopup7 = () => {
    setIsSeen7(!isSeen7);
    setAddress("");
    setView7(false);
    setData();
  };

  const togglePopup8 = () => {
    setIsSeen8(!isSeen8);
    setAddress("");
    setView8(false);
    setData();
  };

  var networkId;
  var formDesign =
  <div className="form-control">
  <label>Address</label> 
  <input
  type="text"
  onChange={(e) => setAddress(e.target.value)} />   
  </div>;

  var formDesign2 =
  <div className="form-control">
  <label>Crop Name</label>
  <select className="drop-down" value={address} onChange={(e) => setAddress(e.target.value)}>
  {
    Object.entries(cropTypes).map(([key, value]) => {
      return (
        <option value={key}>{value}</option>
        )
    })          
  }
  </select>
  </div>;

  const getFarmerDetails = async (event) => {
    event.preventDefault();

    networkId = await web3.eth.net.getId();
    const deployedNetwork = FarmerContract.networks[networkId];

    const instance = new web3.eth.Contract(
      FarmerContract.abi,
      deployedNetwork && deployedNetwork.address
      );

    let obj = await instance.methods.getFarmer(address).call();
    setData(obj);

    setView1(true);
  };

  const getDistributorDetails = async (event) => {
    event.preventDefault();

    networkId = await web3.eth.net.getId();
    const deployedNetwork = DistributorContract.networks[networkId];

    const instance = new web3.eth.Contract(
      DistributorContract.abi,
      deployedNetwork && deployedNetwork.address
      );

    let obj = await instance.methods.getDistributor(address).call();
    setData(obj);

    setView2(true);
  };

  const getRetailerDetails = async (event) => {
    event.preventDefault();

    networkId = await web3.eth.net.getId();
    const deployedNetwork = RetailerContract.networks[networkId];

    const instance = new web3.eth.Contract(
      RetailerContract.abi,
      deployedNetwork && deployedNetwork.address
      );

    let obj = await instance.methods.getRetailer(address).call();
    setData(obj);

    setView3(true);
  };

  const getConsumerDetails = async (event) => {
    event.preventDefault();

    networkId = await web3.eth.net.getId();
    const deployedNetwork = ConsumerContract.networks[networkId];

    const instance = new web3.eth.Contract(
      ConsumerContract.abi,
      deployedNetwork && deployedNetwork.address
      );

    let obj = await instance.methods.getConsumer(address).call();
    setData(obj);

    setView4(true);
  };

  const getColdStorageDetails = async (event) => {
    event.preventDefault();

    networkId = await web3.eth.net.getId();
    const deployedNetwork = ColdStorageContract.networks[networkId];

    const instance = new web3.eth.Contract(
      ColdStorageContract.abi,
      deployedNetwork && deployedNetwork.address
      );

    let obj = await instance.methods.getColdStorage(address).call();
    setData(obj);

    setView5(true);
  };

  const getOfficialDetails = async (event) => {
    event.preventDefault();

    networkId = await web3.eth.net.getId();
    const deployedNetwork = GovernmentContract.networks[networkId];

    const instance = new web3.eth.Contract(
      GovernmentContract.abi,
      deployedNetwork && deployedNetwork.address
      );

    let obj = await instance.methods.getOfficial(address).call();
    setData(obj);

    setView6(true);
  };

  const getItemDetails = async (event) => {
    event.preventDefault();

    networkId = await web3.eth.net.getId();
    const deployedNetwork = SupplyChain.networks[networkId];

    const instance = new web3.eth.Contract(
      SupplyChain.abi,
      deployedNetwork && deployedNetwork.address
      );

    let obj = await instance.methods.getItems(address).call();
    setData(obj);

    setView7(true);
  };

  const getCropPricing = async (event) => {
    event.preventDefault();

    networkId = await web3.eth.net.getId();
    const deployedNetwork = SupplyChain.networks[networkId];

    const instance = new web3.eth.Contract(
      SupplyChain.abi,
      deployedNetwork && deployedNetwork.address
      );

    let obj = await instance.methods.getCropPrices(address).call();
    setData(obj);

    setView8(true);
  };

  return (
    <div>
    <NavBar toggle={toggle} />
    <div className="btn-group">    

    <button className="home-button" onClick={togglePopup1}>
    Get Details of Farmer
    </button>
    {isSeen1 && <Popup
      content={
        <>
        <div className="container">
        <form className="add-form">
        {formDesign}
        <button
        className="btn-grad"
        style={{ margin: "auto", marginTop: "30px", outline: 'none', border: 'none' }}
        onClick={getFarmerDetails}>Submit</button>
        {view1 && <div className="profile">
        <h2>Farmer</h2>
        <p>Name: {data._name} </p>           
        <p className="capitalize">State Of Residence: {data._stateOfResidence} </p>
        <p>Land Owned= {data._landOwned} acres </p>
        <p>Gender: {data._gender} </p>
        <p>Latitude: {data._latitude < 0 ? (Math.abs(data._latitude).toString()+String.fromCharCode(176)+"S") : (data._latitude.toString()+String.fromCharCode(176)+"N")} </p>
        <p>Longitude: {data._longitude < 0 ? (Math.abs(data._longitude).toString()+String.fromCharCode(176)+"W") : (data._longitude.toString()+String.fromCharCode(176)+"E")} </p>
        </div>
      }
      </form>
      </div>     

      </>
    }
    handleClose={togglePopup1}
    />
  }

  <button className="home-button" onClick={togglePopup2}>
  Get Details of Distributor
  </button>
  {isSeen2 && <Popup
    content={
      <>
      <div className="container">
      <form className="add-form">

      {formDesign}
      <button
      className="btn-grad"
      style={{ margin: "auto", marginTop: "30px", outline: 'none', border: 'none' }}
      onClick={getDistributorDetails}>Submit</button>
      {view2 && <div className="profile">
      <h2>Distributor</h2>
      <p>Name: {data._name} </p>           
      <p>Contact: {data._contact}</p>
      <p>Latitude: {data._latitude < 0 ? (Math.abs(data._latitude).toString()+String.fromCharCode(176)+"S") : (data._latitude.toString()+String.fromCharCode(176)+"N")} </p>
      <p>Longitude: {data._longitude < 0 ? (Math.abs(data._longitude).toString()+String.fromCharCode(176)+"W") : (data._longitude.toString()+String.fromCharCode(176)+"E")} </p>
      </div>
    }
    </form>
    </div>

    <
    />
  }
  handleClose = { togglePopup2 }
  />
}

<button className = "home-button"
onClick = { togglePopup3 } >
Get Details of Retailer </button> { isSeen3 && <Popup
  content={
    <>
    <div className="container">
    <form className="add-form">

    {formDesign}
    <button
    className="btn-grad"
    style={{ margin: "auto", marginTop: "30px", outline: 'none', border: 'none' }}
    onClick={getRetailerDetails}>Submit</button>
    {view3 && <div className="profile">
    <h2>Retailer</h2>
    <p>Name: {data._name} </p>           
    <p>Contact: {data._contact} </p>
    <p>Latitude: {data._latitude < 0 ? (Math.abs(data._latitude).toString()+String.fromCharCode(176)+"S") : (data._latitude.toString()+String.fromCharCode(176)+"N")} </p>
    <p>Longitude: {data._longitude < 0 ? (Math.abs(data._longitude).toString()+String.fromCharCode(176)+"W") : (data._longitude.toString()+String.fromCharCode(176)+"E")} </p>
    </div>
  }
  </form>
  </div>     

  </>
}
handleClose={togglePopup3}
/>
}

<button className="home-button" onClick={togglePopup4}>
Get Details of Consumer
</button>
{isSeen4 && <Popup
  content={
    <>
    <div className="container">
    <form className="add-form">

    {formDesign}
    <button
    className="btn-grad"
    style={{ margin: "auto", marginTop: "30px", outline: 'none', border: 'none' }}
    onClick={getConsumerDetails}>Submit</button>
    {view4 && <div className="profile">
    <h2>Consumer</h2>
    <p>Name: {data._name} </p>           
    <p>Contact: {data._contact}</p>
    </div>
  }
  </form>
  </div>     

  </>
}
handleClose={togglePopup4}
/>
}

<button className="home-button" onClick={togglePopup5}>
Get Details of Cold Storage
</button>
{isSeen5 && <Popup
  content={
    <>
    <div className="container">
    <form className="add-form">

    {formDesign}
    <button
    className="btn-grad"
    style={{ margin: "auto", marginTop: "30px", outline: 'none', border: 'none' }}
    onClick={getColdStorageDetails}>Submit</button>
    {view5 && <div className="profile">
    <h2>ColdStorage</h2>
    <p>Owner Name: {data._ownerName} </p> 
    <p>Latitude: {data._latitude < 0 ? (Math.abs(data._latitude).toString()+String.fromCharCode(176)+"S") : (data._latitude.toString()+String.fromCharCode(176)+"N")} </p>
    <p>Longitude: {data._longitude < 0 ? (Math.abs(data._longitude).toString()+String.fromCharCode(176)+"W") : (data._longitude.toString()+String.fromCharCode(176)+"E")} </p>
    <p>Price: {data._price} wei</p>
    <p>Capacity: {data._capacity} </p>
    </div>
  }
  </form>
  </div>     

  </>
}
handleClose={togglePopup5}
/>
}

<button className="home-button" onClick={togglePopup6}>
Get Details of Government Official
</button>
{isSeen6 && <Popup
  content={
    <>
    <div className="container">
    <form className="add-form">

    {formDesign}
    <button
    className="btn-grad"
    style={{ margin: "auto", marginTop: "30px", outline: 'none', border: 'none' }}
    onClick={getOfficialDetails}>Submit</button>
    {view6 && <div className="profile">
    <h2>Government Official</h2>
    <p>Name: {data._name} </p>           
    <p>Employee Id: {data._govId}</p>

    </div>
  }
  </form>
  </div>     

  </>
}
handleClose={togglePopup6}
/>
}

<button className="home-button" onClick={togglePopup7}>
Trace Item by Id
</button>
{isSeen7 && <Popup
  content={
    <>
    <div className="container">
    <form className="add-form">

    {formDesign}
    <button
    className="btn-grad"
    style={{ margin: "auto", marginTop: "30px", outline: 'none', border: 'none' }}
    onClick={getItemDetails}>Submit</button>
    {view7 && <div className="profile" style={{minWidth: "500px"}}>
    <h2>Item</h2>
    <p>Owner ID: {data.ownerID} </p>  
    <p>Farmer ID: {data.farmerID} </p>
    <p>Distributor ID: {data.distributorID} </p>  
    <p>Retailer ID: {data.retailerID} </p>
    <p>Consumer ID: {data.consumerID} </p>
    <p>Product Type: {data.productType} </p>
    <p>Weight: {data.weight} </p>
    </div>
  } 
  </form>
  </div>     

  </>
}
handleClose={togglePopup7}
/>
}

<button className="home-button" onClick={togglePopup8}>
Get Crop Prices
</button>
{isSeen8 && <Popup
  content={
    <>
    <div className="container">
    <form className="add-form">
    {formDesign2}
    <button
    className="btn-grad"
    style={{ margin: "auto", marginTop: "30px", outline: 'none', border: 'none' }}
    onClick={getCropPricing}>Submit</button>
    {view8 && <div className="profile">
    <h2>Prices of {cropTypes[address]}</h2>
    <p>Price for Distributor: {data.priceForDistributor} wei </p>
    <p>Price for Retailer: {data.priceForRetailer} wei </p>
    <p>Price for Consumer: {data.priceForConsumer} wei </p>
    </div>
  }
  </form>
  </div>     

  </>
}
handleClose={togglePopup8}
/>
}


<Link to="/GetAll/farmers" style={{ textDecoration: 'none' }}>
<button className="home-button">
Get All Farmers
</button>
</Link>
<Link to="/GetAll/distributors" style={{ textDecoration: 'none' }}>
<button className="home-button">
Get All Distributors
</button>
</Link>
<Link to="/GetAll/retailers" style={{ textDecoration: 'none' }}>
<button className="home-button">
Get All Retailers
</button>
</Link>
<Link to="/GetAll/consumers" style={{ textDecoration: 'none' }}>
<button className="home-button">
Get All Consumers
</button>
</Link>
<Link to="/GetAll/coldStorages" style={{ textDecoration: 'none' }}>
<button className="home-button">
Get All Cold Storages
</button>
</Link>
<Link to="/GetAll/officials" style={{ textDecoration: 'none' }}>
<button className="home-button">
Get All Government Officials
</button>
</Link>
<Link to="/CropOwners" style={{ textDecoration: 'none' }}>
<button className="home-button">
Get All Crop Owners
</button>
</Link>
</div>
</div>

);
};