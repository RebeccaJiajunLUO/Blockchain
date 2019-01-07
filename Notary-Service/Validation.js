const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const Blockchain = require('./simpleChain.js');
const blockchain = new Blockchain();

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class Validation {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        this.blocks = [];
        // this.initializeMockData();
        // this.getBlockByIndex();
        this.postRequest();
    }


    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postRequest() {
        this.app.post("/requestValidation", async(req, res) => {
            const data = req.body.body;

            if(data == undefined || data === ''){
                res.status(404).json({
                    success: false,
                    message: "Please check your request, which might be empty, undefined, or in a wrong format."
                  })
            }
            else
            {
                const blockAux = new BlockClass.Block(data);
                await blockchain.addBlock(blockAux);
                // verify and return the most recently added block
                res.status(201).send(blockAux);

            }



            // res.json({
            //     success: true,
            //     data: "test postNewBlock"
            // })

            
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
module.exports = (app) => { return new Validation(app);}