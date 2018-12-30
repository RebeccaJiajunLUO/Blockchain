
// Http library
const http = require('http');

//Step 1. Import crypto-js/sha256
const SHA256 = require('crypto-js/sha256');


// Http port
const port = 8080;

//Mock Data
var blocks = [];
let block_1 = {"height":"0","body":"Udacity Blockchain Developer", "time": 1538509789};
let block_2 = {"height":"1","body":"Udacity Blockchain Developer Rock!", "time": 1538509789};
blocks.push(block_1);
blocks.push(block_2);
let block = blocks.pop();

//Step 2. Configure web service
/**
 * Take the block_2 data from the array "blocks" and generate the hash to be written into the response.
 */
//Add your code here



// Configure web service
/*因为实际开发中,我们需要返回对应的中文以及对应的的文本格式

     * 所以我们需要设置对应的响应头,响应头决定了对应的返回数据的格式以及编码格式

     * writeHead:这个方法有两个参数,第一个参数表示对应的编码的状态值,第二个表示对应的设置*/

const app = http.createServer(function (request, response){
response.writeHead(200, {"Content-Type": "application/json"});
// let block = {"height":"0","body":"123"};

// response.write(JSON.stringify(block));
let hash = SHA256(JSON.stringify(block)).toString();

response.write(hash);
response.end();
});




// Notify console
console.log("Web Server started on port 8080\nhttp://localhost:"+port);
// Start server with http port
app.listen(port);