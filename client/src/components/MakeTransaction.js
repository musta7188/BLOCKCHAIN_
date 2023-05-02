import React, { useState } from "react";
import { FormControl, FormGroup, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import history from "../history";

const MakeTransaction = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState(0);

  const updateRecipient = (event) => {
    setRecipient(event.target.value);
  };

  const updateAmount = (event) => {
    const value = event.target.value;
    setAmount(value === "" ? "" : Number(value));
  };

  const makeTransaction = () => {
    fetch(`${document.location.origin}/api/make-transaction`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipient, amount }),
    })
      .then((response) => response.json())
      .then((json) => {
        alert(json.message || json.type);
        history.push("/transaction-pool");
      });
  };

  return (
    <div className="MakeTransaction">
      <Link to="/">Home</Link>
      <h3>Make a transaction</h3>
      <FormGroup>
        <FormControl
          type="text"
          placeholder="recipient"
          value={recipient}
          onChange={updateRecipient}
          className="form-input"
        />
      </FormGroup>
      <FormGroup>
        <FormControl
          type="number"
          placeholder="amount"
          value={amount}
          onChange={updateAmount}
          className="form-input"
        />
      </FormGroup>
      <div>
        <Button
          // variant="outline-danger"
          className="futuristic-btn"
          onClick={makeTransaction}
        >
          Submit Transaction
        </Button>
      </div>
    </div>
  );
};

export default MakeTransaction;
