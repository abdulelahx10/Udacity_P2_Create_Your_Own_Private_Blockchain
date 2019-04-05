/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

const SHA256 = require('crypto-js/sha256');
const LevelSandbox = require('./LevelSandbox.js');
const Block = require('./Block.js');

class Blockchain {

    constructor() {
        this.bd = new LevelSandbox.LevelSandbox();
        this.generateGenesisBlock();
    }

    // Helper method to create a Genesis Block (always with height= 0)
    // You have to options, because the method will always execute when you create your blockchain
    // you will need to set this up statically or instead you can verify if the height !== 0 then you
    // will not create the genesis block
    generateGenesisBlock() {
        this.getBlockHeight().then((count) => {
            if (count == 0) {
                block.height = count;
                block.time = new Date().getTime().toString().slice(0, -3);
                block.hash = SHA256(JSON.stringify(block)).toString();
                this.bd.addLevelDBData(count, block).then((result) => {
                    console.log(`Genesis block created: ${result}`);
                }).catch((err) => {
                    console.log(err);
                });
            }
        }).catch((err) => {
            console.log(err);
        });
    }

    // Get block height, it is a helper method that return the height of the blockchain
    getBlockHeight() {
        return new Promise(function (resolve, reject) {
            this.bd.getBlocksCount().then((count) => {
                resolve(count);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    // Add new block
    addBlock(block) {
        return new Promise(function (resolve, reject) {
            this.getBlockHeight().then((count) => {
                block.height = count;
                block.time = new Date().getTime().toString().slice(0, -3);
                this.getBlock(count - 1).then((previousBlock) => {
                    block.previousBlockHash = previousBlock.hash;
                    block.hash = SHA256(JSON.stringify(block)).toString();
                    this.bd.addLevelDBData(count, block).then((result) => {
                        resolve(result);
                    }).catch((err) => {
                        reject(err);
                    });
                }).catch((err) => {
                    reject(err);
                });
            }).catch((err) => {
                reject(err);
            });
        });

    }

    // Get Block By Height
    getBlock(height) {
        // Add your code here
        return new Promise(function (resolve, reject) {
            this.bd.getLevelDBData(height).then((block) => {
                resolve(block);
            }).catch((err) => {
                reject(err);
            });
        });
    }

    // Validate if Block is being tampered by Block Height
    validateBlock(height) {
        // Add your code here
    }

    // Validate Blockchain
    validateChain() {
        // Add your code here
    }

    // Utility Method to Tamper a Block for Test Validation
    // This method is for testing purpose
    _modifyBlock(height, block) {
        let self = this;
        return new Promise((resolve, reject) => {
            self.bd.addLevelDBData(height, JSON.stringify(block).toString()).then((blockModified) => {
                resolve(blockModified);
            }).catch((err) => {
                console.log(err);
                reject(err)
            });
        });
    }

}

module.exports.Blockchain = Blockchain;