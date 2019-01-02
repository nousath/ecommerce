/***
 * local http server for test api before upload amazon aws lambda
 */

const express = require("express");
const bodyParser = require("body-parser");
const formidable = require('formidable');
const ecommerce = require("./ecommerce.js");

// http server
var server = express();

// create application/json parser
var jsonParser = bodyParser.json()

//server.use(bodyParser.urlencoded({ extended: false }));
//server.use(bodyParser.json());

// create store
server.post('/createStore',(req,res)=>{
  ecommerce.createStore()
  	.then(result=>{
  		console.log('createStore',result);
  		res.json(result);
  	}).catch((err)=>{
  		res.json(err).end();
  		console.log('createStore error',err);
  	});
});

// get store info
server.post('/getStore',jsonParser,(req,res)=>{
  const data = req.body;
	ecommerce.getStore(data.storeToken, data.sessionToken, data.location)
  	.then(result=>{
  		console.log('getStore',result);
  		res.json(result);
  	}).catch((err)=>{
      console.log('getStore error',err);
  		res.json(err).end();
  	});
});

// update store info
server.post('/updateStore',jsonParser,(req,res)=>{
  const data = req.body;
  console.log('updateStore request', data.action);
  ecommerce.updateStore(data.storeToken, data.sessionToken, data.action)
  	.then(result=>{
  		console.log('updateStore',result);
  		res.json(result);
  	}).catch((err)=>{
  		res.json(err).end();
  		console.log('updateStore error',err);
  	});
});

// upload file
server.post('/upload', (req, res) => {
  new formidable.IncomingForm().parse(req, (err, data) => {
    if (err) {
      res.status(500).send(err)
    }
    ecommerce.uploadFile(data.file,data.storeToken,data.sessionToken)
      .then(result=>{
        console.log('updateFile',result);
        res.json(result);
      }).catch((err)=>{
        res.json(err).end();
        console.log('updateFile error',err);
      });
  })
})

server.listen(3001,function(){
  console.log("Started on PORT 3001");
})