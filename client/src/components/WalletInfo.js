import React from "react";

const WalletInfo = ({ walletAddress, walletBalance }) => {
  return (
    <div className="WalletInfo">
      <p>Wallet Address: {walletAddress}</p>
      <p>Wallet Balance: {walletBalance} ETH</p>
    </div>
  );
};

export default WalletInfo;
