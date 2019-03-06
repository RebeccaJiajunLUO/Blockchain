//connect to local blockchain 
//have a connection from your local ganache blockchain to web3.
var Web3 = require('web3')

var web3 = new Web3('HTTP://127.0.0.1:7545')

// console.log(web3)
// web3.eth.getAccounts().then(accounts => console.log(accounts));

/*Create a transaction programmatically that sends 
Ether between 2 ganache accounts*/

var EthereumTransaction = require("ethereumjs-tx")

// -- Step 2: Set the sending and receiving addresses for the transaction.
var sendingAddress = '0xDafB60dFe61586317cc3DCFe13a33e3B389D0C4F'
var receivingAddress = '0x070796E97da2b35051626dE23A37d428871C3A8a'

// -- Step 3: Check the balances of each address
web3.eth.getBalance(sendingAddress).then(console.log)
web3.eth.getBalance(receivingAddress).then(console.log)

/*##########################
##  CREATE A TRANSACTION  ##
##########################*/

// -- Step 4: Set up the transaction using the transaction variables as shown
var rawTransaction = {
    nonce: 1,
    to: receivingAddress,
    gasPrice: 20000000,
    gasLimit: 30000,
    value: 100,
    data: ""
}

/*##########################
##  Sign the Transaction  ##
##########################*/

// -- Step 7: Sign the transaction with the Hex value of the private key of the sender
var privateKeySender = '930e9b9d813857c56bfb7695ff341548902ea4aca16fc5227b89bd18173c3383'
var privateKeySenderHex = new Buffer.from(privateKeySender, 'hex');
var transaction = new EthereumTransaction(rawTransaction)
transaction.sign(privateKeySenderHex)

/*#########################################
##  Send the transaction to the network  ##
#########################################*/

// -- Step 8: Send the serialized signed transaction to the Ethereum network.
var serializedTransaction = transaction.serialize();
web3.eth.sendSignedTransaction(serializedTransaction);
