const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;   
    }
}

class Block{
    constructor( timestamp, transactions, previousHash = ''){
        this.timestamp = timestamp;
        this.transactions = transactions; 
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash(){
        return SHA256(this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(difficulty){
        //a while loop to see if the hash has 0's and how many and too see if it matches the required amount (difficulty) if not than add that many zeros (join)
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log("Block mined: " + this.hash);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock(){
        return new Block("01/01/2017", "Gensis Block", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions);
        block.mineBlock(this.difficulty);

        console.log('Block mined succesfully!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.miningReward)
        ];
    }

    createTranscation(transaction){
        this.pendingTransactions.push(transaction);
    }
    
    getBalanceOfAddress(address){
        let balance = 0;

        //A loop to check each block in the chain 
        for (const block of this.chain){
                for (const trans of block.transactions){
                    if(trans.fromAddress === address){
                       balance -= trans.amount;
                    }

                    if(trans.toAddress === address){
                       balance += trans.amount;
                    }
                }
        }
        return balance;
    }

    isChainValid(){
        for(let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if(currentBlock.hash !== currentBlock.calculateHash()){
                return false;
            }

            if(currentBlock.previousHash !== previousBlock.hash){
                return false;
            }
        }

        return true;
    }
}

let savjeeCoin = new Blockchain();
savjeeCoin.createTranscation(new Transaction('address1','address2', 100));
savjeeCoin.createTranscation(new Transaction('address2','address1', 50));

console.log('\n starting the miner...');
savjeeCoin.minePendingTransactions('sharoze-address');

console.log('\nBalance of Sharoze is:', savjeeCoin.getBalanceOfAddress('sharoze-addresss'));

console.log('\n starting the miner again...');
savjeeCoin.minePendingTransactions('sharoze-address');

console.log('\nBalance of Sharoze is:', savjeeCoin.getBalanceOfAddress('sharoze-addresss'));
