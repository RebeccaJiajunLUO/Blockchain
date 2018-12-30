/* ===== Persist data with LevelDB ===================================
|  Learn more: level: https://github.com/Level/level     |
|  =============================================================*/



const level = require('level');
const chainDB = './chaindata';
// const db = level(chainDB);

// Declaring a class
class LevelSandbox {
  constrcutor(){
    this.db = level(chainDB);
  }

    // Add data to levelDB with key and value (Promise)
    addLevelDBData(key, value) {
      //By using let self = this;, you can access the this object inside the Promise code.
        let self = this;
        return new Promise(function(resolve, reject) {
            self.db.put(key, value, function(err) {
                if (err) {
                    console.log('Block ' + key + ' submission failed', err);
                    reject(err);
                }
                resolve(value);
            });
        });
    }

    // Get data from levelDB with key (Promise)
    getLevelDBData(key){
      // because we are returning a promise we will need this to be able to reference 'this' inside the Promise constructor
        let self = this; 
        return new Promise(function(resolve, reject) {
            self.db.get(key, (err, value) => {
                if(err){
                    if (err.type == 'NotFoundError') {
                        resolve(undefined);
                    }else {
                        console.log('Block ' + key + ' get failed', err);
                        reject(err);
                    }
                }else {
                    resolve(value);
                }
            });
        });
    }

    // Add data to levelDB with value
    addDataToLevelDB(value) {
      let self = this;
      let i = 0;



      return new Promise(function(resolve,reject){
        self.db.createReadStream().on('data',function(data){
          i++;
        }).on('error',function(err){
          return console.log('Unable to read data stream!', err)
        }).on('close', function() {

          console.log('Block #' + i);

          //   self.addLevelDBData(i, value).then(value)=>{
          //   console.log('Block #' + i);
          // }.catch((error) => {console.log(error)});

          resolve(value);
        });
      })
    }
   


}

// // Add data to levelDB with key/value pair
// function addLevelDBData(key,value){
//   db.put(key, value, function(err) {
//     if (err) return console.log('Block ' + key + ' submission failed', err);
//   })
// }

// // Get data from levelDB with key
// function getLevelDBData(key){
//   db.get(key, function(err, value) {
//     if (err) return console.log('Not found!', err);
//     console.log('Value = ' + value);
//   })
// }

// // Add data to levelDB with value
// function addDataToLevelDB(value) {
//     let i = 0;
//     db.createReadStream().on('data', function(data) {
//           i++;
//         }).on('error', function(err) {
//             return console.log('Unable to read data stream!', err)
//         }).on('close', function() {
//           console.log('Block #' + i);
//           addLevelDBData(i, value);
//         });
// }

/* ===== Testing ==============================================================|
|  - Self-invoking function to add blocks to chain                             |
|  - Learn more:                                                               |
|   https://scottiestech.info/2014/07/01/javascript-fun-looping-with-a-delay/  |
|                                                                              |
|  * 100 Milliseconds loop = 36,000 blocks per hour                            |
|     (13.89 hours for 500,000 blocks)                                         |
|    Bitcoin blockchain adds 8640 blocks per day                               |
|     ( new block every 10 minutes )                                           |
|  ===========================================================================*/


// (function theLoop (i) {
//   setTimeout(function () {
//     addDataToLevelDB('Testing data');
//     if (--i) theLoop(i);
//   }, 100);
// })(10);

// Creating the levelSandbox class object
const db = new LevelSandbox();

// Creating Data
(function theLoop (i) {
    setTimeout(function () {
        //Test Object
        let objAux = {id: i, data: `Data #: ${i}`};
        db.addLevelDBData(i, JSON.stringify(objAux).toString()).then((result) => {
            if(!result) {
              console.log("Error Adding data");
            }else {
              console.log(result);
            }
        }).catch((err) => { console.log(err); });
        i++;
        if (i < 2) { 
          theLoop(i) 
        } 
    }, 5600);
  })(0);
