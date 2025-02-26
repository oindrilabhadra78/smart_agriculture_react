import React, {
    useState,
    useEffect
} from "react";
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
    Link
} from 'react-router-dom';

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

export const UnverifiedActors = () => {
    const account = useSelector(selectAccount);
    const web3 = useSelector(selectWeb3);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [choice, setChoice] = useState("");

    const [farmerInstance, setFarmerInstance] = useState();
    const [distributorInstance, setDistributorInstance] = useState();
    const [retailerInstance, setRetailerInstance] = useState();
    const [coldStorageInstance, setColdStorageInstance] = useState();

    var scrollListItems = [];
    var option;

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

                const deployedNetwork4 = ColdStorageContract.networks[networkId];
                const instance4 = new web3.eth.Contract(
                    ColdStorageContract.abi,
                    deployedNetwork4 && deployedNetwork4.address
                );
                setColdStorageInstance(instance4);

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

    const getUnverifiedFarmers = async () => {

        let len = await farmerInstance.methods.getNumUnverifiedFarmers().call({
            from: account
        });

        let listItems = [];
        for (let i = 0; i < len; i++) {
            let val = await farmerInstance.methods.getUnverifiedFarmer(i).call({
                from: account
            });
            listItems.push(val);
        }

        setData(listItems);
    };

    const getUnverifiedDistributors = async () => {

        let len = await distributorInstance.methods.getNumUnverifiedDistributors().call({
            from: account
        });

        let listItems = [];
        for (let i = 0; i < len; i++) {
            let val = await distributorInstance.methods.getUnverifiedDistributor(i).call({
                from: account
            });
            listItems.push(val);
        }

        setData(listItems);
    };

    const getUnverifiedRetailers = async () => {

        let len = await retailerInstance.methods.getNumUnverifiedRetailers().call({
            from: account
        });

        let listItems = [];
        for (let i = 0; i < len; i++) {
            let val = await retailerInstance.methods.getUnverifiedRetailer(i).call({
                from: account
            });
            listItems.push(val);
        }

        setData(listItems);
    };

    const getUnverifiedColdStorages = async () => {

        let len = await coldStorageInstance.methods.getNumUnverifiedColdStorages().call({
            from: account
        });

        let listItems = [];
        for (let i = 0; i < len; i++) {
            let val = await coldStorageInstance.methods.getUnverifiedColdStorage(i).call({
                from: account
            });
            listItems.push(val);
        }

        setData(listItems);
    };

    function ListItem({ d }) {
        const [checked, setChecked] = useState(false);
        return (<li onClick = {() => {window.open("/GetDetails/" + choice + "/" + d.content, "_self");}}> 
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


    const viewActors = async () => {
        if (choice == "farmer") {
            await getUnverifiedFarmers();
        } else if (choice == "distributor") {
            await getUnverifiedDistributors();
        } else if (choice == "retailer") {
            await getUnverifiedRetailers();
        } else if (choice == "coldStorage") {
            await getUnverifiedColdStorages();
        }

    };

    scrollListItems = [];
    for (let i = 0; i < data.length; i++) {
        scrollListItems.push({
            id: i,
            content: data[i]
        });
    }

    if (scrollListItems.length == 0)
        return (<div className="container">
            <h3 style={{textAlign:"center"}}> Select which unverified users you want to view </h3> 
            <div className="containerOuter">
            <div className="containerInner" value = {choice} onChange = { (e) => setChoice(e.target.value) } >

            <input type = "radio" className="hidden" id="input1" value = "farmer" name = "role" /> 
            <label class="entry" for="input1"><div class="circle"></div><div class="entry-label">Farmer</div></label>
            <input type = "radio" className="hidden" id="input2" value = "distributor" name = "role" /> 
            <label class="entry" for="input2"><div class="circle"></div><div class="entry-label">Distributor</div></label>
            <input type = "radio" className="hidden" id="input3" value = "retailer" name = "role" /> 
            <label class="entry" for="input3"><div class="circle"></div><div class="entry-label">Retailer</div></label> 
            <input type = "radio" className="hidden" id="input4" value = "coldStorage" name = "role" />
            <label class="entry" for="input4"><div class="circle"></div><div class="entry-label">Cold Storage</div></label> 
            <div class="highlight"></div>
            <div class="overlay"></div>
            </div>
            </div>
            <button className = "btn-grad" style = {{ border: 'none', outline: 'none', margin: "auto", marginTop: "50px" }} onClick = {viewActors}> Submit </button>

            </div>);

    else
        return (
            <div> 
            <List/> 
            </div>

        );
};