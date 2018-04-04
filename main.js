const SHA256 = require("crypto-js/sha256");

class Client{
    constructor(clientAddress, balence, warehouse){
        this.clientAddress = clientAddress;
        this.balence = balence;
        this.warehouse = warehouse;
    }
    getBalencePoint(){
        return this.balence;
    }

    checkWarehouse(){
        return this.warehouse;
    }
    exchangePresent(pointNeeded, present){
        this.balence -= pointNeeded;
        this.warehouse.push(present);
        let transactionsRecord = new Transaction(this.clientAddress, pointNeeded, present);
        return transactionsRecord;
    }

}

class Transaction{
    constructor(clientAddress, point, present){
        this.clientAddress = clientAddress; // 用戶地址
        this.point = point; // 兌換物品所需點數
        this.present = present; // 用戶兌換的物品
    }
}

class Block{
    constructor(timestamp, transactions, previousHash = ""){
        this.timestap = timestamp;
        this.transaction = transactions;
        this.previousHash = previousHash;
        this.hashValue = this.calculateHash();
        this.nounce = 0;
    }

    calculateHash(){
        return SHA256(this.nounce + this.timestap + this.previousHash + JSON.stringify(this.transaction)).toString();
    }

    minBlock(diffculty){
        let string0 = "";
        for(let i = 0; i < diffculty; i++){
            string0 += "0";
        }

        while(this.hashValue.substring(0, diffculty) !== string0){
            this.nounce += 1;
            this.hashValue = this.calculateHash();
        }
        console.log("BLOCK MINED: " + this.hashValue);
    }
}

class Blockchain{
    constructor(){
        this.chain = [this.createGenesisBlock()];
        this.diffculty = 3;
        this.pendingTransactions = [];
    }

    createGenesisBlock(){  // 創始區塊
        return new Block(Date.parse("2018-01-01"), [], "0")
    }

    getlatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    createTransaction(transaction){
        this.pendingTransactions.push(transaction);
    }

    minePendingTransactions(){
        let block = new Block(Date.now(), this.pendingTransactions, this.getlatestBlock().hashValue);
        block.minBlock(this.diffculty);

        console.log("Block has been successfully mined!!!");

        this.chain.push(block);

        this.pendingTransactions = []; // 重置待挖礦的交易紀錄
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++){
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

var Hank = new Client("402", 2000, []);
var Juddy = new Client("404", 6000, ["100$ coupon"]);
console.log(Hank.getBalencePoint());
console.log(Hank.checkWarehouse());


var CSR = new Blockchain();
CSR.createTransaction(Hank.exchangePresent(500, "30$ coupon"));
console.log(Hank.getBalencePoint());
console.log(Hank.checkWarehouse());

CSR.createTransaction(Hank.exchangePresent(1200, "1 strabucks"));
console.log(Hank.getBalencePoint());
console.log(Hank.checkWarehouse());

console.log(JSON.stringify(CSR, null, 4));
console.log("----------------------------------------------------------")

console.log("Strat mining...");
CSR.minePendingTransactions();

CSR.createTransaction(Hank.exchangePresent(100, "1 cityCoffee"));
console.log(JSON.stringify(CSR, null, 4));
console.log("----------------------------------------------------------")

console.log(Hank.getBalencePoint());
console.log(Hank.checkWarehouse());

console.log("Strat mining...");
CSR.minePendingTransactions();

console.log(JSON.stringify(CSR, null, 4));