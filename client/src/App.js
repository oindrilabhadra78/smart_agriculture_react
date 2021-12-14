import React, { useState, useEffect } from "react";
import "./App.css";

import { HomePage } from "./pages/HomePage";
import { RegisterPage } from "./pages/RegisterPage";
import { RouteHandler } from "./components/RouteHandler";
import { FarmerProfile } from "./components/FarmerProfile";
import { DistributorProfile } from "./components/DistributorProfile";
import { RetailerProfile } from "./components/RetailerProfile";
import { ConsumerProfile } from "./components/ConsumerProfile";
import { ColdStorageProfile } from "./components/ColdStorageProfile";
import { OfficialProfile } from "./components/OfficialProfile";
import { UnverifiedActors } from "./components/UnverifiedActors";
import { GetDetails } from "./components/GetDetails";

import { Switch, Router, Route } from "react-router";

import { setAccount, setWeb3 } from "./redux/account/accountSlice";
import { useDispatch } from "react-redux";

import { isAuthenticated } from "./redux/account/accountSlice";
import { useSelector } from "react-redux";

import { Redirect } from "react-router-dom";

import getWeb3 from "./getWeb3";
import history from "./history";

function App() {
  const dispatch = useDispatch();
  const auth = useSelector(isAuthenticated);

  const [load, setLoad] = useState(true);

  useEffect(() => {
    let mounted = true;
    const initialize = async () => {
      try {
        // Get web3 instance and account, and set it to redux state
        const web_3 = await getWeb3();
        const accounts = await web_3.eth.getAccounts();

        if (mounted) {
          dispatch(setAccount(accounts[0]));
          dispatch(setWeb3(web_3));
        }
      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(`Failed to load web3, or get account Check console for details.`);
        console.error(error);
      }
    };
    initialize();

    return () => (mounted = false);
  }, []);

  useEffect(() => {
    if (auth) {
      setLoad(false);
    }
  }, [auth]);

  return (
    <div>
      {load ? 
        <h4>Loading...</h4> :
        <Router history={history}>
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/Register" component={RegisterPage} />
            <Route path="/FarmerProfile" component={FarmerProfile} />
            <Route path="/OfficialProfile" component={OfficialProfile} />
            <Route path="/DistributorProfile" component={DistributorProfile} />
            <Route path="/ConsumerProfile" component={ConsumerProfile} />
            <Route path="/RetailerProfile" component={RetailerProfile} />
            <Route path="/ColdStorageProfile" component={ColdStorageProfile} />
            <Route path="/UnverifiedActors" component={UnverifiedActors} />
            <Route path="/GetDetails/:role/:id" render={(props) => <GetDetails {...props} />} />
            {auth ? (
              <Route path="/Login"
                component={() => <RouteHandler request="Login" />} />
            ) : (
              <Redirect to="/" />
            )}
          </Switch>
        </Router>
      }
    </div>
  );
}

export default App;
