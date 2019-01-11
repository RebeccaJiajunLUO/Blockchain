const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const Blockchain = require('./simpleChain.js');
const blockchain = new Blockchain();

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class ValidationController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        this.blocks = [];
        this.mempool = [];
        this.timeoutRequests = [];
        this.mempoolValid = [];
        // this.initializeMockData();
        // this.getBlockByIndex();
        this.postRequest();
        this.validateRequest();
    }


    /**
     * Implement a POST Endpoint to add a request object, url: "/requestValidation"
     */
    postRequest() {
        this.app.post("/requestValidation", async(req, res) => {

            try{
                const address = req.body.address;
                let  message,requestTimeStamp,timeLeft;
                const TimeoutRequestsWindowTime = 5*60*1000;

                if(address == undefined || address === ''){
                    res.status(404).json({
                        success: false,
                        message: "Please check your address, which might be empty, undefined, or in a wrong format."
                      })
                }
                else
                {
                    
                    let inMemory = this.mempool.hasOwnProperty(address);
                    

                    if(inMemory){
                        //if this request exits in memory pool
                        let timeElapse = (new Date().getTime().toString().slice(0,-3)) - this.mempool[address].requestTimeStamp;
                        timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
                        message = address +":" + this.mempool[address].requestTimeStamp + ":starRegistry";
                        requestTimeStamp =  this.mempool[address].requestTimeStamp;

                    }
                    else{
                        //add a new request in memory
                        requestTimeStamp = new Date().getTime().toString().slice(0,-3);
                        message = address +":" +  requestTimeStamp + ":starRegistry";
                        this.mempool[address] = {message, requestTimeStamp };
                        timeLeft = 300;

                        setTimeout(function(){
                            delete this.mempool[address];
                        },TimeoutRequestsWindowTime);                       

                    }              
                
                }
    
                res.json({
                    walletAddress: address,
                    requestTimeStamp: requestTimeStamp,
                    message: message,
                    validationWindow: timeLeft
                })



            }
            catch(error){
                res.status(404).json({
                    success: false,
                    message: `Validation request failed. ${error}`
                  })

            }
            
            
        });
    }

 /**
     * Implement a POST Endpoint to add a validRequest object, url: "/message-signature/validate"
*/
    validateRequest(){
        this.app.post("/message-signature/validate", async(req, res) => {
            try{

                const address = req.body.address;
                const signature = req.body.signature;
                let  message,requestTimeStamp,timeLeft,validresult;
                const TimeoutRequestsWindowTime = 5*60*1000;

                let inMemory = this.mempool.hasOwnProperty(address);
                
                if(inMemory){
                    //Verify your windowTime
                    requestTimeStamp = this.mempool[address].requestTimeStamp;
                    let timeElapse = (new Date().getTime().toString().slice(0,-3)) - requestTimeStamp;
                    timeLeft = (TimeoutRequestsWindowTime/1000) - timeElapse;
                    message = this.mempool[address].message;
                    //Verify the signature, always fail 
                    const bitcoinMessage = require('bitcoinjs-message'); 
                    let isValid = bitcoinMessage.verify(message, address, signature);
                    console.log(isValid);


                    if(isValid){
                        validresult = {
                            registerStar : true,
                            status : {
                                address: address,
                                requestTimeStamp: requestTimeStamp,
                                message: message,
                                validationWindow: timeLeft,
                                messageSignature: true
                             }
                        };
                        this.mempoolValid.push(validresult);
                    }
                    else{
                        validresult = {
                             registerStar : false,
                             message: 'The message signature is verified to be false and it is invalid!',
                             messageSignature: false
                    }
                }
                res.send(validresult);
                }
                //if request in not in memory pool
                else{
                    res.status(404).json({
                        success: false,
                        message: `Please go to \requestValidation to get a message that you need to sign with your wallet.`
                      })

                }
            }
            catch(error){
                res.status(404).json({
                    success: false,
                    message: `Message-signature failed. ${error}`
                  })
            }
        });

    }

    

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    initializeMockData() {
        if(this.blocks.length === 0){
            for (let index = 0; index < 10; index++) {
                let blockAux = new BlockClass.Block(`Test Data #${index}`);
                blockAux.height = index;
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                this.blocks.push(blockAux);
            }
        }


    }


}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new ValidationController(app);}