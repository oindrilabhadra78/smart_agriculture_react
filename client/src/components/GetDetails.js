import React, {
    useState,
    useEffect
} from "react";
import {
    useParams
} from 'react-router';
import NavBar from "../components/Navbar/NavBar";
import "../App.css";
import ReactScrollableList from "react-scrollable-list";
import getWeb3 from "../getWeb3";
import FarmerContract from "../contracts/FarmerContract.json";
import DistributorContract from "../contracts/DistributorContract.json";
import RetailerContract from "../contracts/RetailerContract.json";
import ConsumerContract from "../contracts/ConsumerContract.json";
import GovernmentContract from "../contracts/GovernmentContract.json";
import ColdStorageContract from "../contracts/ColdStorageContract.json";

import {
    selectAccount,
    selectWeb3
} from "../redux/account/accountSlice";
import {
    useSelector
} from "react-redux";

window.ethereum.on("accountsChanged", () => {
    window.location.reload();
});


export const GetDetails = (props) => {
    const account = useSelector(selectAccount);
    const web3 = useSelector(selectWeb3);

    const [data, setData] = useState();
    const [hash, setHash] = useState("");
    const [loading, setLoading] = useState(true);

    var verified;

    const getFarmerDetails = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = FarmerContract.networks[networkId];

        const instance = new web3.eth.Contract(
            FarmerContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        let obj = await instance.methods.getFarmer(props.match.params.id).call({ from: account });
        let hash = await instance.methods.getHash(props.match.params.id).call({ from: account });
        return {roleObject: obj, fileHash: hash};
    };

    const getDistributorDetails = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = DistributorContract.networks[networkId];

        const instance = new web3.eth.Contract(
            DistributorContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        let obj = await instance.methods.getDistributor(props.match.params.id).call({ from: account });
let hash = await instance.methods.getHash(props.match.params.id).call({ from: account });
        return {roleObject: obj, fileHash: hash};
    };

    const getRetailerDetails = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = RetailerContract.networks[networkId];

        const instance = new web3.eth.Contract(
            RetailerContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        let obj = await instance.methods.getRetailer(props.match.params.id).call({ from: account });
        let hash = await instance.methods.getHash(props.match.params.id).call({ from: account });
        return {roleObject: obj, fileHash: hash};
    };

    const getColdStorageDetails = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = ColdStorageContract.networks[networkId];

        const instance = new web3.eth.Contract(
            ColdStorageContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        let obj = await instance.methods.getColdStorage(props.match.params.id).call({ from: account });
        let hash = await instance.methods.getHash(props.match.params.id).call({ from: account });
        return {roleObject: obj, fileHash: hash};
    };


    useEffect(() => {
        const initialize = async () => {
            var result;

            if (data === undefined) {
                if (props.match.params.role == "farmer") {
                    result = await getFarmerDetails();
                    setData(result.roleObject);
                    setHash(result.fileHash);
                } else if (props.match.params.role == "distributor") {
                    result = await getDistributorDetails();
                    setData(result.roleObject);
                    setHash(result.fileHash);
                } else if (props.match.params.role == "retailer") {
                    result = await getRetailerDetails();
                    setData(result.roleObject);
                    setHash(result.fileHash);
                } else if (props.match.params.role == "coldStorage") {
                    result = await getColdStorageDetails();
                    setData(result.roleObject);
                    setHash(result.fileHash);
                }

            } else {
                setLoading(false);
            }

        };

        initialize();
    }, [data]);


    const verifyUser = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = GovernmentContract.networks[networkId];

        const instance = new web3.eth.Contract(
            GovernmentContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        if (props.match.params.role == "farmer") {
            await instance.methods.setFarmerAsEligible(props.match.params.id).send({ from: account });
        } else if (props.match.params.role == "distributor") {
            await instance.methods.setDistributorAsEligible(props.match.params.id).send({ from: account });
        } else if (props.match.params.role == "retailer") {
            await instance.methods.setRetailerAsEligible(props.match.params.id).send({ from: account });
        } else if (props.match.params.role == "coldStorage") {
            await instance.methods.setColdStorageAsEligible(props.match.params.id).send({ from: account });
        }
        window.location.reload(false);
    }

    const viewIdCard = async () => {
        window.open("https://ipfs.infura.io/ipfs/"+hash, '_blank');
    }

    if (loading) {
        return <h3>Loading</h3>;
    } else if (props.match.params.role == "farmer") {
        verified = data._isEligible ? "Yes" : "No";
        return (<div style={{marginTop: "100px"}}>
        	<div className="profile">
      <h2>Farmer</h2>
      <p>Name: {data._name} </p>           
      <p>State Of Residence: {data._stateOfResidence} </p>
      <p>Land Owned: {data._landOwned} </p>
      <p>Gender: {data._gender} </p>
      <p>Latitude: {data._latitude} </p>
      <p>Longitude: {data._longitude} </p>
      <p>Verified: {verified} </p>
      <button type="button" onClick={viewIdCard}>View ID Card</button>
      </div>
      <div>      	
      	<button type="button" className = "btn-grad" style={{ border: 'none', outline: 'none', margin: "auto" }} onClick={async () => {await verifyUser();}}>
            Verify User
            </button>
      </div>      
      </div>);
    } else if (props.match.params.role == "distributor") {
        verified = data._isEligible ? "Yes" : "No";
        return (<div style={{marginTop: "100px"}}>
            <div className="profile">
      <h2>Distributor</h2>
      <p>Name: {data._name} </p>           
      <p>Contact: {data._contact}</p>
      <p>Latitude: {data._latitude} </p>
      <p>Longitude: {data._longitude} </p>
      <p>Verified: {verified} </p>
      <button type="button" onClick={viewIdCard}>View ID Card</button>
      </div>

      <div>      	
      	<button type="button" className = "btn-grad" style={{ border: 'none', outline: 'none', margin: "auto" }} onClick={async () => {await verifyUser();} }>
            Verify User
            </button>
      </div>

      </div>);
    } else if (props.match.params.role == "retailer") {
        verified = data._isEligible ? "Yes" : "No";
        return (<div style={{marginTop: "100px"}}>
            <div className="profile">
      <h2>Retailer</h2>
      <p>Name: {data._name} </p>           
      <p>Contact: {data._contact} </p>
      <p>Latitude: {data._latitude} </p>
      <p>Longitude: {data._longitude} </p>
      <p>Verified: {verified} </p>
      <button type="button" onClick={viewIdCard}>View ID Card</button>
      </div>

      <div>      	
      	<button type="button" className = "btn-grad" style={{ border: 'none', outline: 'none', margin: "auto" }} onClick={async () => {await verifyUser();}}>
            Verify User
            </button>
      </div>
      </div>);
    } else if (props.match.params.role == "coldStorage") {
        verified = data._isEligible ? "Yes" : "No";
        return (
            <div style={{marginTop: "100px"}}>
            <div className="profile">
      <h2>ColdStorage</h2>
      <p>Owner Name: {data._ownerName} </p> 
      <p>Latitude: {data._latitude} </p>
      <p>Longitude: {data._longitude} </p>
      <p>Price: {data._price} </p>
      <p>Capacity: {data._capacity} </p>
      <p>Verified: {verified} </p>
      <button type="button" onClick={viewIdCard}>View ID Card</button>
      </div>

      <div>      	
      	<button type="button" className = "btn-grad" style={{ border: 'none', outline: 'none', margin: "auto" }} onClick={async () => {await verifyUser();}}>
            Verify User
            </button>
      </div>
      </div>
        );
    }
};