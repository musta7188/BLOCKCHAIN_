import React from "react";
import { render } from "react-dom";
import App from "./components/App";
import "./index.css";
import history from "./history";
import { Router, Switch, Route } from "react-router-dom";
import Blocks from "./components/Blocks";
import MakeTransaction from "./components/MakeTransaction";
import TransactionPool from "./components/TransactionPool";
import Login from "../src/components/Login";

const Disconnect = () => {
  localStorage.removeItem("walletAddress");
  localStorage.removeItem("walletBalance");
  history.push("/login");
  return null;
};

render(
  <Router history={history}>
    <Switch>
      <Route exact={true} path="/" component={App} />
      <Route path="/login" component={Login} />
      <Route path="/blocks" component={Blocks} />
      <Route path="/make-transaction" component={MakeTransaction} />
      <Route path="/transaction-pool" component={TransactionPool} />
      <Route path="/disconnect" component={Disconnect} />
    </Switch>
  </Router>,
  document.getElementById("root")
);

