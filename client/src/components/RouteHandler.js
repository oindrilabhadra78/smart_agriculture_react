import React, { useState, useEffect } from "react";
import Roles from "../contracts/Roles.json";
import FarmerProfile from "./FarmerProfile";
import DistributorProfile from "./DistributorProfile";
import RetailerProfile from "./RetailerProfile";
import ConsumerProfile from "./ConsumerProfile";
import ColdStorageProfile from "./ColdStorageProfile";
import GovtProfile from "./GovtProfile";
import FarmerContract from "../contracts/FarmerContract.json";
import DistributorContract from "../contracts/DistributorContract.json";
import RetailerContract from "../contracts/RetailerContract.json";
import ConsumerContract from "../contracts/ConsumerContract.json";
import GovernmentContract from "../contracts/GovernmentContract.json";
import ColdStorageContract from "../contracts/ColdStorageContract.json";
import { Login } from "./login";

import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";

window.ethereum.on("accountsChanged", () => {
	window.location.reload();
});

let networkId;

export const RouteHandler = ({ request }) => {
	const account = useSelector(selectAccount);
	const web3 = useSelector(selectWeb3);

	const [roleId, setRoleId] = useState();
	const [data, setData] = useState();
	const [loading, setLoading] = useState(true);

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

	const getFarmer = async () => {
		const deployedNetwork = FarmerContract.networks[networkId];

		const instance = new web3.eth.Contract(
			FarmerContract.abi,
			deployedNetwork && deployedNetwork.address
			);

		let obj = await instance.methods.getFarmer(account).call();

		return obj;
	};

	const getAllFarmers = async () => {
		const deployedNetwork = FarmerContract.networks[networkId];

		const instance = new web3.eth.Contract(
			FarmerContract.abi,
			deployedNetwork && deployedNetwork.address
			);

		let arr = await instance.methods.getFarmers().call();

		return arr;
	};

	const getDistributor = async () => {
		const deployedNetwork = DistributorContract.networks[networkId];

		const instance = new web3.eth.Contract(
			DistributorContract.abi,
			deployedNetwork && deployedNetwork.address
			);

		let obj = await instance.methods.getDistributor(account).call();

		return obj;
	};

	const getAllDistributors = async () => {
		const deployedNetwork = DistributorContract.networks[networkId];

		const instance = new web3.eth.Contract(
			DistributorContract.abi,
			deployedNetwork && deployedNetwork.address
			);

		let arr = await instance.methods.getDistributors().call();

		return arr;
	};

	const getRetailer = async () => {
		const deployedNetwork = RetailerContract.networks[networkId];

		const instance = new web3.eth.Contract(
			RetailerContract.abi,
			deployedNetwork && deployedNetwork.address
			);

		let obj = await instance.methods.getRetailer(account).call();

		return obj;
	};

	const getAllRetailers = async () => {
		const deployedNetwork = RetailerContract.networks[networkId];

		const instance = new web3.eth.Contract(
			RetailerContract.abi,
			deployedNetwork && deployedNetwork.address
			);

		let arr = await instance.methods.getRetailers().call();

		return arr;
	};

	const getConsumer = async () => {
		const deployedNetwork = ConsumerContract.networks[networkId];

		const instance = new web3.eth.Contract(
			ConsumerContract.abi,
			deployedNetwork && deployedNetwork.address
			);

		let obj = await instance.methods.getConsumer(account).call();

		return obj;
	};

	const getAllConsumers = async () => {
		const deployedNetwork = ConsumerContract.networks[networkId];

		const instance = new web3.eth.Contract(
			ConsumerContract.abi,
			deployedNetwork && deployedNetwork.address
			);

		let arr = await instance.methods.getConsumers().call();

		return arr;
	};

	const getColdStorage = async () => {
		const deployedNetwork = ColdStorageContract.networks[networkId];

		const instance = new web3.eth.Contract(
			ColdStorageContract.abi,
			deployedNetwork && deployedNetwork.address
			);

		let obj = await instance.methods.getColdStorage(account).call();

		return obj;
	};

	const getAllColdStorages = async () => {
		const deployedNetwork = ColdStorageContract.networks[networkId];

		const instance = new web3.eth.Contract(
			ColdStorageContract.abi,
			deployedNetwork && deployedNetwork.address
			);

		let arr = await instance.methods.getColdStorages().call();

		return arr;
	};

	const getOfficial = async () => {
		const deployedNetwork = GovernmentContract.networks[networkId];

		const instance = new web3.eth.Contract(
			GovernmentContract.abi,
			deployedNetwork && deployedNetwork.address
			);

		let obj = await instance.methods.getOfficial(account).call();

		return obj;
	};

	useEffect(() => {
		const initialize = async () => {
			await getRole();
			console.log("Got role: " + roleId);

			if (isFarmer() && request === "FarmerProfile") {
				if (data == undefined) {
					var result = await getFarmer();
					console.log(result);
					setData(result);
				} else {
					console.log("Farmer set it");
					setLoading(false);
				}
			} else if (isGovernmentOfficial() && request === "GovtProfile") {
				if (data == undefined) {
					var result = await getOfficial();
					console.log(result);
					setData(result);
				} else setLoading(false);
			} else if(isDistributor() && request === "DistributorProfile"){
				if (data === undefined)
				{
					console.log("Distributor profile requested")
					var result = await getDistributor();
					setData(result);
				}else setLoading(false);
			} else if(isRetailer() && request === "RetailerProfile"){
				if (data === undefined){
					var result = await getRetailer();
					setData(result);
				} else setLoading(false);
			} else if(isConsumer() && request === "ConsumerProfile"){
				if (data === undefined){
					var result = await getConsumer();
					setData(result);
				}else setLoading(false);
			} else if(isColdStorage() && request === "ColdStorageProfile"){
				if (data === undefined){
					var result = await getColdStorage();
					setData(result);
				}else setLoading(false);
			}
			else if (roleId != undefined) {
				setLoading(false);
			}

		};

		initialize();
	}, [roleId, data]);


	const isFarmer = () => {
		if (roleId == 1) return true;
		return false;
	};

	const isDistributor = () =>{
		if(roleId == 2) return true;
		return false;
	}

	const isRetailer = () =>{
		if(roleId == 3) return true;
		return false;
	}

	const isConsumer = () =>{
		if(roleId == 4) return true;
		return false;
	}

	const isColdStorage = () => {
		if (roleId == 5) return true;
		return false;
	};

	const isGovernmentOfficial = () => {
		if (roleId == 6) return true;
		return false;
	};


	if (request === "FarmerProfile") {
		console.log(loading);
		if (loading) {
			return <h1>Loading</h1>;
		} else {
			if (isFarmer()) {
				return (
				<FarmerProfile
				name={data._name}
				stateOfResidence={data._details._stateOfResidence}
				landOwned={data._landOwned}
				gender={data._gender}
				latitude={data._latitude}
				longitude={data._longitude}
				isEligible={data._isEligible}
				/>
				);
			} else {
				return (
				<div>
				<h2>Not authenticated</h2>
				<a href="/">Home</a>
				</div>
				);
			}
		}
	} else if (request === "DistributorProfile") {
		console.log(loading);
		if (loading) {
			return <h1>Loading</h1>;
		} else {
			if (isDistributor()) {
				return (
					<DistributorProfile
					name={data._name}            
					contact={data._contact}
					latitude={data._latitude}
					longitude={data._longitude}
					isEligible={data._isEligible}
					/>
					);
			} else {
				return (
					<div>
					<h2>Not authenticated</h2>
					<a href="/">Home</a>
					</div>
					);
				}
			}
		} else if (request === "RetailerProfile") {
			console.log(loading);
			if (loading) {
				return <h1>Loading</h1>;
			} else {
				if (isRetailer()) {
					return (
						<RetailerProfile
						name={data._name}            
						contact={data._contact}
						latitude={data._latitude}
						longitude={data._longitude}
						isEligible={data._isEligible}
						/>
						);
				} else {
					return (
						<div>
						<h2>Not authenticated</h2>
						<a href="/">Home</a>
						</div>
						);
					}
				}
			} else if (request === "ConsumerProfile") {
				console.log(loading);
				if (loading) {
					return <h1>Loading</h1>;
				} else {
					if (isConsumer()) {
						return (
							<ConsumerProfile
							name={data._name}            
							contact={data._contact}
							/>
							);
					} else {
						return (
							<div>
							<h2>Not authenticated</h2>
							<a href="/">Home</a>
							</div>
							);
						}
					}
				} else if (request === "GovtProfile") {
					console.log(loading);
					if (loading) {
						return <h1>Loading</h1>;
					} else {
						if (isGovernmentOfficial()) {
							return (
								<GovtProfile
								name={data._name}            
								empId={data._empId}
								isEligible={data._isEligible}
								/>
								);
						} else {
							return (
								<div>
								<h2>Not authenticated</h2>
								<a href="/">Home</a>
								</div>
								);
							}
						}
					} else if (request === "ColdStorageProfile") {
						console.log(loading);
						if (loading) {
							return <h1>Loading</h1>;
						} else {
							if (isColdStorage()) {
								return (
									<ColdStorageProfile
									ownerName={data._ownerName}  
									latitude={data._latitude}
									longitude={data._longitude}
									price={data._price}
									capacity={data._capacity}
									isEligible={data._isEligible}
									/>
									);
							} else {
								return (
									<div>
									<h2>Not authenticated</h2>
									<a href="/">Home</a>
									</div>
									);
								}
							}
						} else if (request === "Login") {
							return <Login roleID={roleId} />;
						}
					};