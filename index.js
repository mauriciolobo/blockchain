const crypto = require('crypto');

class Block {
  constructor(timestamp, lastHash, hash, data) {
    this.timestamp = timestamp;
    this.hash = hash;
    this.lastHash = lastHash;
    this.data = data;
  }

  static genesis() {
    return new Block(Date.now(), '', 'g3n3515', undefined);
  }

  static mine(lastBlock, data) {
    var timestamp = Date.now();
    var lastHash = lastBlock.hash;
    var hash = Block.generateHash(timestamp, lastHash, data);
    return new Block(timestamp, lastHash, hash, data);
  }

  static generateHash(timestamp, lastHash, data) {
    return crypto.createHash('sha256').update(`${timestamp}${lastHash}${JSON.stringify(data)}`).digest('base64');
  }
}

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  mineBlock(data) {
    var block = Block.mine(this.chain[this.chain.length - 1], data);
    this.chain.push(block);
    return block;
  }

  replaceChain(chain) {
    if (this.validate(chain)) {
      this.chain = chain;
      return chain;
    }
  }

  validate(chain) {
    if (this.chain.length > chain.length) {
      console.log('Current chain is longer than new one');
      return false;
    }    
    if(this.chain[0].data !== undefined){
      console.log('Genesis data should be empty');
      return false;
    }
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const hash = Block.generateHash(block.timestamp, chain[i-1].hash, block.data);
      if(hash !== block.hash){
        console.log('invalid block');
        return false;
      }
    }
    return true;
  }
}


var bc = new Blockchain();

//Valid mining
bc.mineBlock({
  value: 1
});
bc.mineBlock({
  value: 2
});

//Should replace blockchain with a valid chain
var newChain = bc.replaceChain(bc.chain);
console.log('Valid chain: ', newChain);

//SHOULD FAIL THE CHAIN REPLACE (shows 'invalid block' message and return undefined):
var fakeChain = [...bc.chain];
fakeChain[1].data = {value:10};
console.log('Fake chain should be undefined: ', bc.replaceChain(fakeChain));


// ---------//TESTING GENERATE BLOCKS
var genesisBlock = Block.genesis();
console.log(genesisBlock);

var block1 = Block.mine(genesisBlock, {value: 1});
console.log(block1);

var block2 = Block.mine(block1, {value: 2});
console.log(block2);