import React, { useState, useEffect } from "react";
import { useParams } from 'react-router';
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


export const GetAll = (props) => {
    const account = useSelector(selectAccount);
    const web3 = useSelector(selectWeb3);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    var scrollListItems;

    const getFarmers = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = FarmerContract.networks[networkId];

        const instance = new web3.eth.Contract(
            FarmerContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        let len = await instance.methods.countFarmers().call();

        let listItems = [];
        for (let i = 0; i < len; i++) {
            let val = await instance.methods.getNumFarmer(i).call();
            listItems.push(val);
        }

        setData(listItems);
    };

    const getDistributors = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = DistributorContract.networks[networkId];

        const instance = new web3.eth.Contract(
            DistributorContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        let len = await instance.methods.countDistributors().call();

        let listItems = [];
        for (let i = 0; i < len; i++) {
            let val = await instance.methods.getNumDistributor(i).call();
            listItems.push(val);
        }

        setData(listItems);
    };

    const getRetailers = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = RetailerContract.networks[networkId];

        const instance = new web3.eth.Contract(
            RetailerContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        let len = await instance.methods.countRetailers().call();

        let listItems = [];
        for (let i = 0; i < len; i++) {
            let val = await instance.methods.getNumRetailer(i).call();
            listItems.push(val);
        }

        setData(listItems);
    };

    const getConsumers = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = ConsumerContract.networks[networkId];

        const instance = new web3.eth.Contract(
            ConsumerContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        let len = await instance.methods.countConsumers().call();

        let listItems = [];
        for (let i = 0; i < len; i++) {
            let val = await instance.methods.getNumConsumer(i).call();
            listItems.push(val);
        }

        setData(listItems);
    };

    const getColdStorages = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = ColdStorageContract.networks[networkId];

        const instance = new web3.eth.Contract(
            ColdStorageContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        let len = await instance.methods.countColdStorages().call();

        let listItems = [];
        for (let i = 0; i < len; i++) {
            let val = await instance.methods.getNumColdStorage(i).call();
            listItems.push(val);
        }

        setData(listItems);
    };

    const getOfficials = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = GovernmentContract.networks[networkId];

        const instance = new web3.eth.Contract(
            GovernmentContract.abi,
            deployedNetwork && deployedNetwork.address
        );

        let len = await instance.methods.countOfficials().call();

        let listItems = [];
        for (let i = 0; i < len; i++) {
            let val = await instance.methods.getNumOfficial(i).call();
            listItems.push(val);
        }

        setData(listItems);
    };


    useEffect(() => {
        const initialize = async () => {
            var result;

            if (data.length == 0) {
                if (props.match.params.role == "farmers") {
                    await getFarmers();

                } else if (props.match.params.role == "distributors") {
                    await getDistributors();

                } else if (props.match.params.role == "retailers") {
                    await getRetailers(); 

                } else if (props.match.params.role == "consumers") {
                    await getConsumers();

                } else if (props.match.params.role == "officials") {
                    await getOfficials();

                } else if (props.match.params.role == "coldStorages") {
                    await getColdStorages();

                }

            } else {
                setLoading(false);
            }

        };

        initialize();
    }, [data]);

    function ListItem({ d }) {
        const [checked, setChecked] = useState(false);
        return (<li> 
            {d.content} 
            </li>);
    }

    function List() {
        return (<ol className="unverified-list"> {
            scrollListItems.map((d) => {
                return <ListItem d = { d } />;
            })
        } </ol>);
    }

    scrollListItems = [];
        for (let i = 0; i < data.length; i++) {
            scrollListItems.push({
                id: i,
                content: data[i]
            });
        }

    return (
        <div> 
        <List/> 
        </div>
    );
};