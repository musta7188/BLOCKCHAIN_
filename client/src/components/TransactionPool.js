import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import Transaction from "./Transaction";
import history from "../history";

const TRANSACTION_POOL_INTERVAL = 10000;

const TransactionPool = () => {
  const [transactionPoolMap, setTransactionPoolMap] = useState({});

  const fetchTransactionPoolMap = () => {
    fetch(`${document.location.origin}/api/transaction-poolMap`)
      .then((response) => response.json())
      .then((json) => setTransactionPoolMap(json));
  };

  const fetchTransactionMined = () => {
    fetch(`${document.location.origin}/api/mine-transactions`).then((response) => {
      if (response.status === 200) {
        alert("success");
        history.push("/blocks");
      } else {
        alert("Transaction was not completed");
      }
    });
  };

  useEffect(() => {
    fetchTransactionPoolMap();

    const fetchPoolInterval = setInterval(() => fetchTransactionPoolMap(), TRANSACTION_POOL_INTERVAL);

    return () => clearInterval(fetchPoolInterval);
  }, []);

  return (
    <div className="TransactionPool">
      <div>
        <Link to="/">Home</Link>
      </div>
      <h3>Transaction Pool</h3>
      {Object.values(transactionPoolMap).map((transaction) => (
        <div key={transaction.id}>
          <hr />
          <Transaction transaction={transaction} />
        </div>
      ))}
      <hr />
      <Button className="danger" onClick={fetchTransactionMined}>
        Start Mining Transaction
      </Button>
    </div>
  );
};

export default TransactionPool;
