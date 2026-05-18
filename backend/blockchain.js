const crypto = require("crypto");

let chain = [];

function createGenesisBlock() {
  return {
    index: 0,
    timestamp: new Date().toISOString(),
    data: {
      message: "Genesis Block",
      system: "EduVerify V2 Permissioned Blockchain"
    },
    previousHash: "0",
    hash: "GENESIS_HASH"
  };
}

chain.push(createGenesisBlock());

function calculateHash(block) {
  return crypto
    .createHash("sha256")
    .update(
      block.index +
      block.timestamp +
      JSON.stringify(block.data) +
      block.previousHash
    )
    .digest("hex");
}

function addBlock(data) {
  const previousBlock = chain[chain.length - 1];

  const block = {
    index: chain.length,
    timestamp: new Date().toISOString(),
    data,
    previousHash: previousBlock.hash
  };

  block.hash = calculateHash(block);
  chain.push(block);

  return block;
}

function getChain() {
  return chain;
}

function isChainValid() {
  for (let i = 1; i < chain.length; i++) {
    const currentBlock = chain[i];
    const previousBlock = chain[i - 1];

    if (currentBlock.hash !== calculateHash(currentBlock)) {
      return false;
    }

    if (currentBlock.previousHash !== previousBlock.hash) {
      return false;
    }
  }

  return true;
}

module.exports = {
  addBlock,
  getChain,
  isChainValid
};
