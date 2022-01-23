import SupplyChain from "../contracts/SupplyChain.json";
import { Card, ListGroup } from "react-bootstrap";
import { selectAccount, selectWeb3 } from "../redux/account/accountSlice";
import Popup from "../utils/Popup";
import NavBar from "./Navbar/NavBar";
import { useSelector } from "react-redux";
import { Link } from 'react-router-dom';
import React, { useState, useEffect } from "react";

window.ethereum.on("accountsChanged", () => {
  window.location.reload();
});

export const CropIds = (props) => {
  const account = useSelector(selectAccount);
  const web3 = useSelector(selectWeb3);
  var networkId;

  const [instance, setInstance] = useState();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [details, setDetails] = useState();
  const [address, setAddress] = useState("");

  const getCropIdList = async () => {
    networkId = await web3.eth.net.getId();

    const deployedNetwork = SupplyChain.networks[networkId];
    const instance = new web3.eth.Contract(
      SupplyChain.abi,
      deployedNetwork && deployedNetwork.address
      );
    let numPerOwner = await instance.methods.getNumProductsPerOwner(props.match.params.crop, props.match.params.stage, props.match.params.owner).call();
    let listItems = [];
    for (let i = 0;i<numPerOwner;i++) {
      let pdtId = await instance.methods.getProductPerOwner(props.match.params.crop, props.match.params.stage, props.match.params.owner, i).call();
      listItems.push(pdtId);
    }

    return listItems;
  };

  useEffect(() => {
    const initialize = async () => {
      if (data.length == 0) {
        var result = await getCropIdList();
        setData(result);
      }
      else {
        setLoading(false);
      }  
    };

    initialize();
    
  }, [data]);

  var scrollListItems;

  function ListItem({ d }) {
    const [checked, setChecked] = useState(false);
    return (<li>{d.content}</li>                       
     );
  }

  function List() {
    return (<ol className="unverified-list disabled"> {
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

  if (loading)
    return (
      <h3>Loading...</h3>
      );
  else
    return (
      <div> 
      <List/> 
      </div>
      );

};