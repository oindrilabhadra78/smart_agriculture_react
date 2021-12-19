import React, { useState, useEffect } from "react";
import NavBar from "../components/Navbar/NavBar";
import "../App.css";
import getWeb3 from "../getWeb3";
import FarmerContract from "../contracts/FarmerContract.json";
import DistributorContract from "../contracts/DistributorContract.json";
import RetailerContract from "../contracts/RetailerContract.json";
import ConsumerContract from "../contracts/ConsumerContract.json";
import GovernmentContract from "../contracts/GovernmentContract.json";
import ColdStorageContract from "../contracts/ColdStorageContract.json";
import Geocode from "react-geocode";
import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";
import { create } from "ipfs-http-client";

window.ethereum.on("accountsChanged", () => {
	window.location.reload();
});

/*
Geocode.setApiKey("AIzaSyAvNAnb5wi2tmKUU6E0uwkjSN75yRdJhY4");
Geocode.setRegion("in");
Geocode.fromAddress("Delhi").then(
	(response) => {
		const { lat, lng } = response.results[0].geometry.location;
		console.log(lat, lng);
	},
	(error) => {
		console.error(error);
	}
	);
*/

export const RegisterPage = () => {
	const account = useSelector(selectAccount);
	const web3 = useSelector(selectWeb3);

	const [farmerInstance, setFarmerInstance] = useState();
	const [distributorInstance, setDistributorInstance] = useState();
	const [retailerInstance, setRetailerInstance] = useState();
	const [consumerInstance, setConsumerInstance] = useState();
	const [coldStorageInstance, setColdStorageInstance] = useState();
	const [governmentInstance, setGovernmentInstance] = useState();

	const [role, setRole] = useState("");
	const [name, setName] = useState("");
	const [stateOfResidence, setStateOfResidence] = useState("");
	const [landOwned, setLandOwned] = useState(0);
	const [latitude, setLatitude] = useState(0);
	const [longitude, setLongitude] = useState(0);
	const [gender, setGender] = useState("");
	const [contact, setContact] = useState("");
	const [empId, setEmpId] = useState("");
	const [capacity, setCapacity] = useState(0);
	const [price, setPrice] = useState(0);
	const [fileState, setFileState] = useState(null);

	const ipfs = create({ host: 'ipfs.infura.io', port: '5001', protocol: 'https', apiPath: '/api/v0' });

	useEffect(() => {
		const initialize = async () => {
			try {
				const networkId = await web3.eth.net.getId();

				const deployedNetwork1 = FarmerContract.networks[networkId];
				const instance1 = new web3.eth.Contract(
					FarmerContract.abi,
					deployedNetwork1 && deployedNetwork1.address
					);
				setFarmerInstance(instance1);

				const deployedNetwork2 = DistributorContract.networks[networkId];
				const instance2 = new web3.eth.Contract(
					DistributorContract.abi,
					deployedNetwork2 && deployedNetwork2.address
					);
				setDistributorInstance(instance2);

				const deployedNetwork3 = RetailerContract.networks[networkId];
				const instance3 = new web3.eth.Contract(
					RetailerContract.abi,
					deployedNetwork3 && deployedNetwork3.address
					);
				setRetailerInstance(instance3);

				const deployedNetwork4 = ConsumerContract.networks[networkId];
				const instance4 = new web3.eth.Contract(
					ConsumerContract.abi,
					deployedNetwork4 && deployedNetwork4.address
					);
				setConsumerInstance(instance4);

				const deployedNetwork5 = ColdStorageContract.networks[networkId];
				const instance5 = new web3.eth.Contract(
					ColdStorageContract.abi,
					deployedNetwork5 && deployedNetwork5.address
					);
				setColdStorageInstance(instance5);

				const deployedNetwork6 = GovernmentContract.networks[networkId];
				const instance6 = new web3.eth.Contract(
					GovernmentContract.abi,
					deployedNetwork6 && deployedNetwork6.address
					);
				setGovernmentInstance(instance6);

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

	const addRole = async (event) => {
		event.preventDefault();
		var fileUpload;

		if (role === "farmer") {
			fileUpload = await ipfs.add(fileState);
			console.log(fileUpload.path);
			await farmerInstance.methods
			.addFarmer(name, stateOfResidence, gender, landOwned, latitude, longitude)
			.send({
				from: account,
				gas: 4712388,
				gasPrice: 1
			});
		} else if (role === "distributor") {
			fileUpload = await ipfs.add(fileState);
			console.log(fileUpload);
			await distributorInstance.methods
			.addDistributor(name, contact, latitude, longitude)
			.send({
				from: account,
				gas: 4712388,
				gasPrice: 1
			});
		} else if (role === "retailer") {
			fileUpload = await ipfs.add(fileState);
			console.log(fileUpload);
			await retailerInstance.methods
			.addRetailer(name, contact, latitude, longitude)
			.send({
				from: account,
				gas: 4712388,
				gasPrice: 1
			});
		} else if (role === "consumer") {
			await consumerInstance.methods
			.addConsumer(name, contact)
			.send({
				from: account,
				gas: 4712388,
				gasPrice: 1
			});
		} else if (role === "govt") {
			await governmentInstance.methods
			.addGovtOfficial(name, empId)
			.send({
				from: account,
				gas: 4712388,
				gasPrice: 1
			});
		} else if (role === "coldStorage") {
			fileUpload = await ipfs.add(fileState);
			console.log(fileUpload);
			await coldStorageInstance.methods
			.addColdStorage(name, latitude, longitude, capacity, price)
			.send({
				from: account,
				gas: 4712388,
				gasPrice: 1
			});
		}
		window.location.reload();
	};

	const captureFile = async (event) => {
		event.preventDefault();
		const file = event.target.files[0];
		const reader = new window.FileReader();
		reader.readAsArrayBuffer(file);
		reader.onloadend = () => {
			setFileState(Buffer(reader.result));
		}
	};

	var options;
	if (role === "") {
		options = null;
	} else if (role === "farmer") {
		options = <div>
		<div className="form-control">
		<label>Name</label>
		<input
		type="text"
		value={name}
		onChange={(e) => setName(e.target.value)}
		/>
		</div>

		<div className="form-control">
		<label>Area of Land owned</label>
		<input
		type="number" 
		min="0"
		value={landOwned}
		onChange={(e) => setLandOwned(e.target.value)}
		/>
		</div>

		<div className="form-control">
		<label>State of Residence</label>
		<select className="drop-down"
		value={stateOfResidence}
		onChange={(e) => setStateOfResidence(e.target.value)}
		>
		<option value="">Select</option>
		<option value="kerala">Kerala</option>
		<option value="bihar">Bihar</option>
		<option value="andhrapradesh">Andhra Pradesh</option>
		<option value="telangana">Telangana</option>
		<option value="goa">Goa</option>
		<option value="maharasthra">Maharasthra</option>
		<option value="arunachalpradesh">Arunachal Pradesh</option>
		<option value="assam">Assam</option>
		<option value="chhattisgarh">Chhattisgarh</option>
		<option value="gujarat">Gujarat</option>
		<option value="haryana">Haryana</option>
		<option value="himachalpradesh">Himachal Pradesh</option>
		<option value="jharkhand">Jharkhand</option>
		<option value="karnataka">Karnataka</option>
		<option value="madhyapradesh">Madhya Pradesh</option>
		<option value="manipur">Manipur</option>
		<option value="meghalaya">Meghalaya</option>
		<option value="mizoram">Mizoram</option>
		<option value="nagaland">Nagaland</option>
		<option value="odisha">Odisha</option>
		<option value="punjab">Punjab</option>
		<option value="rajasthan">Rajasthan</option>
		<option value="sikkim">Sikkim</option>
		<option value="tamilnadu">Tamil Nadu</option>
		<option value="tripura">Tripura</option>
		<option value="uttarpradesh">Uttar Pradesh</option>
		<option value="uttarakhand">Uttarakhand</option>
		<option value="westbengal">West Bengal</option>
		</select>
		</div>

		<div className="form-control">
		<label>Latitude</label>
		<input
		type="number" 
		min="-90"
		max="90"
		value={latitude}
		onChange={(e) => setLatitude(e.target.value)}
		/>
		</div>

		<div className="form-control">
		<label>Longitude</label>
		<input
		type="number" 
		min="-180"
		max="180"
		value={longitude}
		onChange={(e) => setLongitude(e.target.value)}
		/>
		</div>

		<div className="form-control">
		<label>Gender</label>
		<select className="drop-down"
		value={gender}
		onChange={(e) => setGender(e.target.value)}
		>
		<option value="">Select</option>
		<option value="male">Male</option>
		<option value="female">Female</option>
		<option value="other">Other</option>
		</select>
		</div>

		<div>
		<label className="file-upload">Identity Card</label>
		<input type="file" onChange={captureFile} />
		</div>
		
		</div>;

	} else if (role === "distributor" || role === "retailer") {
		options = <div>
		<div className="form-control">
		<label>Name</label>
		<input
		type="text"
		value={name}
		onChange={(e) => setName(e.target.value)}
		/>
		</div>

		<div className="form-control">
		<label>Contact details</label>
		<input
		type="text"
		value={contact}
		onChange={(e) => setContact(e.target.value)}
		/>
		</div>

		<div className="form-control">
		<label>Latitude</label>
		<input
		type="number" 
		min="-90"
		max="90"
		value={latitude}
		onChange={(e) => setLatitude(e.target.value)}
		/>
		</div>

		<div className="form-control">
		<label>Longitude</label>
		<input
		type="number" 
		min="-180"
		max="180"
		value={longitude}
		onChange={(e) => setLongitude(e.target.value)}
		/>
		</div>

		<div>
		<label className="file-upload">Identity Card</label>
		<input type="file" onChange={captureFile} />
		</div>

		</div>;
	} else if (role === "consumer") {
		options = <div>
		<div className="form-control">
		<label>Name</label>
		<input
		type="text"
		value={name}
		onChange={(e) => setName(e.target.value)}
		/>
		</div>

		<div className="form-control">
		<label>Contact details</label>
		<input
		type="text"
		value={contact}
		onChange={(e) => setContact(e.target.value)}
		/>
		</div>
		</div>;
	} else if (role === "govt") {
		options = <div>
		<div className="form-control">
		<label>Name</label>
		<input
		type="text"
		value={name}
		onChange={(e) => setName(e.target.value)}
		/>
		</div>

		<div className="form-control">
		<label>Employee ID</label>
		<input
		type="text"
		value={empId}
		onChange={(e) => setEmpId(e.target.value)}
		/>
		</div>
		</div>;
	} else if (role === "coldStorage") {
		options = <div>
		<div className="form-control">
		<label>Name</label>
		<input
		type="text"
		value={name}
		onChange={(e) => setName(e.target.value)}
		/>
		</div>

		<div className="form-control">
		<label>Latitude</label>
		<input
		type="number" 
		min="-90"
		max="90"
		value={latitude}
		onChange={(e) => setLatitude(e.target.value)}
		/>
		</div>

		<div className="form-control">
		<label>Longitude</label>
		<input
		type="number" 
		min="-180"
		max="180"
		value={longitude}
		onChange={(e) => setLongitude(e.target.value)}
		/>
		</div>

		<div className="form-control">
		<label>Capacity</label>
		<input
		type="number" 
		min="0"
		value={capacity}
		onChange={(e) => setCapacity(e.target.value)}
		/>
		</div>

		<div className="form-control">
		<label>Price</label>
		<input
		type="number" 
		min="0"
		value={price}
		onChange={(e) => setPrice(e.target.value)}
		/>
		</div>

		<div>
		<label className="file-upload">Identity Card</label>
		<input type="file" onChange={captureFile} />
		</div>

		</div>;
	}

	return (
		<div>
		<h4 style={{ textAlign: "center" }}>Account address: {account}</h4>
		<div className="container">
		<div className="header">Registration</div>
		<form className="add-form">
		<div className="form-control">
		<label>Register As</label>
		<select className="drop-down"
		value={role}
		onChange={(e) => setRole(e.target.value)}
		>
		<option value="">Select</option>
		<option value="farmer">Farmer</option>
		<option value="distributor">Distributor</option>
		<option value="retailer">Retailer</option>
		<option value="consumer">Consumer</option>
		<option value="govt">Government Official</option>
		<option value="coldStorage">Cold Storage Owner</option>
		</select>
		</div>

		<div>
		{options}
		</div>

		<button
		className="btn-grad"
		style={{ marginLeft: "0px", marginTop: "30px", outline: 'none', border: 'none' }}
		onClick={addRole}
		>
		Submit
		</button>
		</form>
		</div>
		</div>
		);
};