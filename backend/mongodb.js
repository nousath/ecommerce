/**
MongoDB functions
*/
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://devuser:YbXi1QeK5^6Z@jjperez89-u11ho.mongodb.net/ecommerce?retryWrites=true";

// managed several petitions with same connections
var connection = '';
var dbInstance = '';
var countingActions = 0;

/**
 * connect to database 
 * Promise (connection)
 */
function DBconnect(){
	return new Promise((fullfill,reject) => {
		// if connection is already open
		if(connection !== '' && connection !== undefined){
			if(connection.isConnected()){
				//console.log('reuse dbInstance');
				fullfill(dbInstance);
				//disconnect(); 
				// NOTE; disconnect must be executed after all fullfill
				return;
			}
		}
		// create connection
		MongoClient.connect(uri,{ useNewUrlParser: true })
		  .then(conn => {
		  	//console.log('DB connected');
		  	connection = conn;
		  	dbInstance = conn.db('ecommerce'); // select database
		  	fullfill(dbInstance);
		  	//disconnect();
		  	// NOTE; disconnect must be executed after all fullfill
		  }).catch(err=>{
		  	DBError('DB connection '+err);
		  	reject();
		  	disconnect();
		  });
	});	
}

// close the connection
function DBdisconnect(){
	countingActions--;
	if(countingActions <= 0){
		//console.log('DB disconnecting');
		connection.close(false,()=>{
			//console.log('DB disconnect');
		});	
	}else{
		//console.log('Waiting functions for disconnect '+ countingActions);
	}
}

function DBError(message){
	console.log('DB ERROR '+message);
}

/***
 * create DB collections
 */
function DBcreateStructure(){
	DBconnect().then(db=>{
		const collections = ['store','session','user',
			'chat','log','order','cart',
			'config','product', 'category'];
		collections.forEach(collectionName=>{
			countingActions++;
			db.createCollection(collectionName)
				.then(()=>{
					// create index by storeId
					if(collectionName != 'store'){ // all excepts store
						DBcollection(collectionName,collection=>{
							return collection.createIndex('storeId');
						},()=>{
							console.log('index storeId on '+collectionName+' created');	
						});
					}
					console.log('collection '+collectionName+' created');
				})
				.catch(DBError)
				.finally(DBdisconnect);	
		});
	});
}
//DBcreateStructure(); // just call one time

// encapsulated functions connect db collection of mongodb driver
function DBcollection(collectionName, mongofunction = '', mongocallback = ''){
	if(mongofunction === ''){
		// create a promise
		return new Promise((fullfill,reject) => {
			countingActions++; // for parallel executions and coordinate disconect function
			DBconnect().then((db)=>{
				db.collection(collectionName, (err,collection)=>{
					if(err){
						DBError('get collection '+collectionName+ ' '+err);
						reject();		
					}else{
						fullfill(collection);	
					}
				});
			}).catch((err)=>{
				DBError('get collection '+collectionName+' '+err);
				reject();
			});
		});	
	}else{
		// use the promise, for encapsulated disconnect functionality
		DBcollection(collectionName).then(collection=>{
			mongofunction(collection). // find, insert, update, etc
			then(mongocallback) // result of mongodb function
			.catch(DBError)
			.finally(DBdisconnect);
		}).catch(DBError);
	}
}

// register log info
function DBLog(storeId, action, detail="", user = ""){
	DBcollection('log',collection=>{
		return collection.insertOne({
			storeId:storeId,
			action:action,
			detail:detail,
			user:user,
			timestamp:new Date().getTime()
		});
	})
}

// check if store exists, promise return store object
function DBStoreExists(storeToken){
	return new Promise((fullfill, reject)=>{
		DBcollection('store',collection=>{
			return collection.findOne({token:storeToken});
		},result=>{
			if(result !== undefined && result !== ''){
				fullfill(result);
			}else{
				DBLog(-1,'Store not found', storeToken);
				reject();
			}
		});
	});
}

/**
 * example of use 
DBconnect().then(()=>{
	
	DBcollection('test',collection=>{
		//mongofunction
		return collection.countDocuments();
	},count=>{ //then executed mongoresult
		console.log('conteo '+count);
	});

}).catch(DBError);
*/

// exports

module.exports = {
	connect: DBconnect,
	collection: DBcollection,
	log:DBLog,
	store:DBStoreExists,
}