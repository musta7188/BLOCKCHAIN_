import React, { useEffect, useState } from "react";
import Block from "./Block";
import { Link } from "react-router-dom";

const Blocks = () => {
  const [blocks, setBlocks] = useState([]);

  useEffect(() => {
    fetch(`${document.location.origin}/api/blocks`)
      .then((response) => response.json())
      .then((body) => setBlocks(body));
  }, []);

  console.log("blocks", blocks);

  return (
    <div>
      <div>
        <Link to="/">Home</Link>
      </div>
      <h3>Blocks</h3>
      {blocks.map((block, index) => (
        <Block key={block.hash} block={block} blockNumber={index}/>
      ))}
    </div>
  );
};

export default Blocks;
