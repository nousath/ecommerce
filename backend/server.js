/***
 * local http server for test api before upload amazon aws lambda
 */

const express = require("express");
const bodyParser = require("body-parser");
const ecommerce = require("./ecommerce.js");

// http server
var server = express();

// encoded body request as json
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// create store
server.post('/createStore',(req,res)=>{
  ecommerce.createStore()
  	.then(result=>{
  		console.log('createStore',result);
  		res.json(result);
  	}).catch((err)=>{
  		res.status(500).end();
  		console.log('createStore error',err);
  	});
});

// get store info
server.post('/getStore',(req,res)=>{
  const data = req.body;
	ecommerce.getStore(data.storeToken, data.sessionToken)
  	.then(result=>{
  		console.log('getStore',result);
  		res.json(result);
  	}).catch((err)=>{
  		res.status(500).end();
  		console.log('getStore error',err);
  	});
});

// update store info
server.post('/updateStore',(req,res)=>{
  const data = req.body;
  console.log('updateStore request', data.action);
  ecommerce.updateStore(data.storeToken, data.sessionToken, data.action)
  	.then(result=>{
  		console.log('updateStore',result);
  		res.json(result);
  	}).catch((err)=>{
  		res.status(500).end();
  		console.log('updateStore error',err);
  	});
});

server.listen(3001,function(){
  console.log("Started on PORT 3001");
})