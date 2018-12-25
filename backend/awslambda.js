/***
API functions for access on lambda
encapsulated database access, authenticate user and create log access
*/

const mongo = require('./mongodb.js');

mongo.connect().then(()=>{
	
	mongo.collection('store',collection=>{
		//mongofunction
		return collection.countDocuments();
	},count=>{ //then executed mongoresult
		console.log('conteo '+count);
	});

});