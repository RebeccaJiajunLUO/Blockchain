const SHA256 = require('crypto-js/sha256');
const BlockClass = require('./Block.js');
const Blockchain = require('./simpleChain.js');
const blockchain = new Blockchain();

/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        this.blocks = [];
        this.initializeMockData();
        this.getBlockByIndex();
        this.postNewBlock();
    }

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/api/block/:index"
     *  Implement a GET Endpoint to retrieve a block by index (position in the array), url: "/api/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/block/:index", (req, res) => {
            // Add your code here
            try{
                let index = req.params.index;   
                
                let IndexOfBlock = blockchain.getBlock(index);
                // let IndexOfBlock = this.blocks[index];
                if(IndexOfBlock)
                {
                    res.send(IndexOfBlock);
                }
                else
                {
                    res.status(404).json({
                        success: false,
                        message: `Block ${req.params.index} is not found.`
                      })
                }
                

            }catch(error){
                res.status(404).json({
                    success: false,
                    message: `Block is not found.`
                  })
            }
            


        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/api/block"
     */
    postNewBlock() {
        this.app.post("/block", (req, res) => {
            // Add your code here

            let blockAux = new BlockClass.Block(req.body.body);
            console.log("body:"+req.body.body);
            
            let index = this.blocks.length;

            blockAux.height = index++;
            blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
            this.blocks.push(blockAux);

            // verify and return the most recently added block
            res.status(201).send(blockAux);


  



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
module.exports = (app) => { return new BlockController(app);}