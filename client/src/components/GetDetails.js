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

	return ( <
		div > {
			props.match.params.id
		} <
		/div>
	);
};