import React, { useState } from "react";
import { Button } from "react-bootstrap";
import Transaction from "./Transaction";

const Block = ({ block, blockNumber}) => {
  const [showTransaction, setShowTransaction] = useState(false);

  const toggleTransaction = () => {
    setShowTransaction(!showTransaction);
  };

  const showTransactionElement = () => {
    const { data } = block;
    const dataTransform = JSON.stringify(data);

    const showData =
      dataTransform.length > 15
        ? `${dataTransform.substring(0, 15)}...`
        : dataTransform;

    if (showTransaction) {
      return (
        <div>
          {data.map((transaction) => (
            <div key={transaction.id}>
              <hr />
              <Transaction transaction={transaction} />
            </div>
          ))}
          <br />
          <Button
            className="custom-button"
            size="sm"
            onClick={toggleTransaction}
          >
            Hide Info
          </Button>
        </div>
      );
    }

    return (
      <div>
         <div>Block Number: {blockNumber===0? "Genesis Block": blockNumber}</div>
        Data: {showData}
        <br/>
        <Button
          className="custom-button"
          size="sm"
          onClick={toggleTransaction}
        >
          Display Info
        </Button>
      </div>
    );
  };

  const { timestamp, hash } = block;

  const hashDisplay = `${hash.substring(0, 5)}...`;

  return (
    <div className="Block">
      <h4 className="block-title">Block</h4>
      <div>Hash: {hashDisplay}</div>
      <div>Timestamp: {new Date(timestamp).toLocaleString()}</div>
      {showTransactionElement()}
    </div>
  );
};

export default Block;

