import React, { useState, useEffect } from "react";
import Roles from "../contracts/Roles.json";
import FarmerProfile from "./FarmerProfile";
import DistributorProfile from "./DistributorProfile";
import RetailerProfile from "./RetailerProfile";
import ConsumerProfile from "./ConsumerProfile";
import ColdStorageProfile from "./ColdStorageProfile";
import OfficialProfile from "./OfficialProfile";
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

	const getAllFarmers = async () => {
		const deployedNetwork = FarmerContract.networks[networkId];

		const instance = new web3.eth.Contract(
			FarmerContract.abi,
			deployedNetwork && deployedNetwork.address
			);

		let arr = await instance.methods.getFarmers().call();

		return arr;
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

	const getAllRetailers = async () => {
		const deployedNetwork = RetailerContract.networks[networkId];

		const instance = new web3.eth.Contract(
			RetailerContract.abi,
			deployedNetwork && deployedNetwork.address
			);

		let arr = await instance.methods.getRetailers().call();

		return arr;
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

	const getAllColdStorages = async () => {
		const deployedNetwork = ColdStorageContract.networks[networkId];

		const instance = new web3.eth.Contract(
			ColdStorageContract.abi,
			deployedNetwork && deployedNetwork.address
			);

		let arr = await instance.methods.getColdStorages().call();

		return arr;
	};

	useEffect(() => {
		const initialize = async () => {
			await getRole();
			console.log("Got role: " + roleId);

			if (roleId != undefined) {
				setLoading(false);
			}

		};

		initialize();
	}, [roleId, data]);


	if (request === "Login") {
		return <Login roleID={roleId} />;
	}
};
