import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Web3 from "web3";
import history from "../history";
import { initMetaMask, getBalance } from "../../../Digital_wallet/MetaMask";

const Login = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);

  const connectMetaMask = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.enable();
        const accounts = await web3.eth.getAccounts();
        const address = accounts[0];
        const balance = await getBalance(address);
        setWalletAddress(address);
        setWalletBalance(balance);

        // Store wallet address and balance in local storage
        localStorage.setItem("walletAddress", address);
        localStorage.setItem("walletBalance", balance);

        // Navigate to the main app page after successful login
        history.push("/");
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
      }
    } else {
      alert("MetaMask not detected. Please install MetaMask and try again.");
    }
  };

  const enterAsViewer = () => {
    // Navigate to the main app page as a viewer
    history.push("/");
  };

  return (
    <div className="Login">
      <h3>Login</h3>
      <Button
        className="custom-button"
        size="sm"
        onClick={connectMetaMask}
      >
        Connect to MetaMask
      </Button>
      <p>or</p>
      
      <Button
        className="custom-button"
        size="sm"
        onClick={enterAsViewer}
      >
        Enter as Viewer
      </Button>
  
    </div>
  );
};

export default Login;
