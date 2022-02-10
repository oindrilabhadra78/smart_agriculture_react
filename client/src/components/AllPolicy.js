import PolicyContract from "../contracts/PolicyContract.json";
import { Card, ListGroup } from "react-bootstrap";
import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import { useSelector } from "react-redux";
import { Link, useSearchParams } from 'react-router-dom';
import React, { useState, useEffect } from "react";

window.ethereum.on("accountsChanged", () => {
    window.location.reload();
});

export const AllPolicy = () => {
    const account = useSelector(selectAccount);
    const web3 = useSelector(selectWeb3);

    const [instance, setInstance] = useState();
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    var scrollListItems;

    const getPolicy = async () => {
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = PolicyContract.networks[networkId];

        const instance = new web3.eth.Contract(
            PolicyContract.abi,
            deployedNetwork && deployedNetwork.address
            );

        let len = await instance.methods.viewNumPolicy().call();

        let listItems = [];
        for (let i = 0; i < len; i++) {
            let val = await instance.methods.viewPolicyDetails(i).call();
            listItems.push(val[1] + "\u27A0" + val[0]);
        }

        setData(listItems);
    };

    useEffect(() => {
        const initialize = async () => {
            var result;

            if (data.length == 0) {
                await getPolicy();
            } else {
                setLoading(false);
            }
        };

        initialize();
    }, [data]);

    function ListItem({ d }) {
        return (<li onClick={() => {
            window.open("/PolicyEligibility?name=" + d.content.split('\u27A0')[0] + "&id=" + d.content.split('\u27A0')[1], "_self"); 
        }
    } > 
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


    if (!loading) {
        return (
            <div> 
            <h4>Click on a policy to check you are eligible or not</h4>
            <List/> 
            </div>
            );
    } else {
        return (
            <div>
            <h3>Loading...</h3>
            </div>
            )
    }
};