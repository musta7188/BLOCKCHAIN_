import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { initMetaMask, getBalance } from "../../../Digital_wallet/MetaMask";
import history from "../history";
import { Button } from "react-bootstrap";
const App = () => {
  const [walletInfo, setWalletInfo] = useState({});
  const storedAddress = localStorage.getItem("walletAddress");
  const storedBalance = localStorage.getItem("walletBalance");

  useEffect(() => {
    const fetchWalletInfo = async () => {
      const response = await fetch(
        `${document.location.origin}/api/info-wallet`
      );
      const data = await response.json();
      setWalletInfo(data);
    };

    fetchWalletInfo();
  }, []);

  const { address, balance } = walletInfo;

  const connectMetaMask = async () => {
    const accounts = await initMetaMask();
    if (accounts) {
      const metamaskWalletAddress = accounts[0];
      const metamaskWalletBalance = await getBalance(metamaskWalletAddress);

      setWalletInfo({
        address: metamaskWalletAddress,
        balance: metamaskWalletBalance,
      });
    }
  };

  const disconnectMetaMask = async () => {
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("walletBalance");
    setWalletInfo({
      address: "",
      balance: "",
    });
    history.push("/login");
  };

  return (
    <div className="App">
      <h1 className="app-title">Blockchain Explorer</h1>
      <img className="logo" src={logo} alt="Logo" />
      <br />
      <div className="menu-bar">
        <Link className="nav-link" to="/blocks">
          Blocks
        </Link>
        <Link className="nav-link" to="/make-transaction">
          Make a Transaction
        </Link>
        <Link className="nav-link" to="/transaction-pool">
          Transaction Pool
        </Link>
        <Button className="custom-button" size="sm" onClick={connectMetaMask}>
          Connect to MetaMask
        </Button>
        <br />
        <Button
          className="custom-button"
          size="sm"
          onClick={disconnectMetaMask}
        >
          Disconnect from MetaMask
        </Button>
      </div>
      <div className="InfoWallet">
        <div>address: {storedAddress || address} </div>
        <div> balance: {storedBalance || balance || 0} </div>
      </div>
    </div>
  );
};

export default App;
