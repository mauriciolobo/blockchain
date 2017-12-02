const SHA256 = require("crypto-js/sha256");

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.index +
        this.timestamp +
        JSON.stringify(this.data) +
        this.previousHash
    ).toString();
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.getGenesisBlock()];
  }

  getGenesisBlock() {
    return new Block(0, Date.now(), {}, "");
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLastBlock().hash;
    newBlock.hash = newBlock.calculateHash();
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        console.log("invalid hash");
        return false;
      }
      if (currentBlock.previousHash !== previousBlock.hash) {
        console.log("invalid previous hash");
        return false;
      }
    }
    return true;
  }
}

const mlCoin = new Blockchain();
mlCoin.addBlock(new Block(1, Date.now(), { amount: 5 }));
mlCoin.addBlock(new Block(2, Date.now(), { amount: 10 }));

console.log(mlCoin);

console.log(mlCoin.isChainValid());
