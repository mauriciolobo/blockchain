const SHA256 = require("crypto-js/sha256");
const _ = require("lodash");
const GUID = require("guid");

class Block {
  constructor(index, timestamp, data, previousHash = "") {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nounce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
      this.timestamp +
      JSON.stringify(this.data) +
      this.previousHash + this.nounce
    ).toString();
  }

  mineBlock(difficulty) {
    console.log('minning dificult: ' + difficulty);
    while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
      this.nounce++;
      this.hash = this.calculateHash();
    }
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.getGenesisBlock()];
    this.difficultyLog = 16;
  }

  getGenesisBlock() {
    return new Block(0, Date.now(), {}, "");
  }

  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLastBlock().hash;
    newBlock.mineBlock(Math.floor(Math.log2(this.difficultyLog++)));
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

const wallet = GUID.create().toString();
for (let index = 1; index <= 10; index++) {
  console.log('minning...');
  mlCoin.addBlock(new Block(index++, Date.now(), {
    wallet: wallet,
    amount: 10.0
  }));

  const walletTransactions = _.filter(mlCoin.chain, b => {
    return b.data.wallet == wallet
  });  

  let walletAmount = 0; 
  _.forEach(walletTransactions, b=>{
    walletAmount += b.data.amount;
  });
  console.log('Wallet "' + wallet +' amount ": ml$', walletAmount);
}