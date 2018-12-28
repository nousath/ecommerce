/**
MongoDB functions
*/
const MongoClient = require('mongodb').MongoClient;
// mongoDB Atlas
//const uri = "mongodb+srv://devuser:YbXi1QeK5^6Z@jjperez89-u11ho.mongodb.net/ecommerce?retryWrites=true";
// localhost
const uri = "mongodb://localhost:27017/ecommerce?retryWrites=true";


// managed several petitions with same connections
var connection = '';
var connectionProcess = false; // case multiple petitions
var connectionWaiting = new Array(); 
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
				DBDebug('reuse dbInstance');
				fullfill(dbInstance);
				//disconnect(); 
				// NOTE; disconnect must be executed after all fullfill
				return;
			}
		}
		// if connection is in process
		if(connectionProcess){
			//save actions for later
			connectionWaiting.push({
				fullfill:fullfill,
				reject:reject
			});
			return;
		}
		// create connection
		connectionProcess = true;
		MongoClient.connect(uri,{ useNewUrlParser: true })
		  .then(conn => {
		  	DBDebug('DB connected');
		  	connection = conn;
		  	dbInstance = conn.db('ecommerce'); // select database
		  	fullfill(dbInstance);
		  	//disconnect();
		  	// NOTE; disconnect must be executed after all fullfill
		  }).catch(err=>{
		  	DBError('DB connection '+err);
		  	reject();
		  	disconnect();
		  }).finally(()=>{
		  	// waiting functions
		  	connectionProcess = false;
		  	connectionWaiting.forEach(waiting=>{
		  		if(dbInstance !== '' && dbInstance !== undefined){
		  			waiting.fullfill(dbInstance);
			  	}else{
			  		waiting.reject();
			  	}
		  	});
		  });
	});	
}

// close the connection
function DBdisconnect(){
	countingActions--;
	if(countingActions <= 0){
		DBDebug('DB disconnecting');
		connection.close(false,()=>{
			DBDebug('DB disconnect');
		});	
	}else{
		DBDebug('Waiting functions for disconnect '+ countingActions);
	}
}

function DBError(message){
	console.log('DB ERROR '+message);
}

function DBDebug(message){
	//console.log('DB Debug '+message);	
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
						DBcreateIndex(collectionName, 'storeId');
					}
					switch(collectionName){
						case 'store':
							DBcreateIndex(collectionName, 'token');
							break;
						case 'session':
							DBcreateIndex(collectionName, 'token');
							break;
						case 'cart':
							DBcreateIndex(collectionName, 'sessionToken');
							break;
						case 'order':
							DBcreateIndex(collectionName, 'sessionToken');
							break;
						case 'chat':
							DBcreateIndex(collectionName, 'sessionToken');
							break;
					}
					console.log('collection '+collectionName+' created');
				})
				.catch(DBError)
				.finally(DBdisconnect);	
		});
	});
}

function DBcreateIndex(collectionName, index){
	DBcollection(collectionName,collection=>{
		return collection.createIndex(index);
	},()=>{
		console.log('index '+index+' on '+collectionName+' created');	
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
		// use the promise, for encapsulated DBDisconnect and DBerror functionality
		DBcollection(collectionName).then(collection=>{
			mongofunction(collection). // find, insert, update, etc
			then(mongocallback) // result of mongodb function
			.catch(DBError)
			.finally(DBdisconnect);
		}).catch(DBError);
	}
}

/**
 * example of use 	
DBcollection('test',collection=>{
	//mongo promise
	return collection.countDocuments();
},count=>{ //then executed mongoresult
	console.log('conteo '+count);
});
*/

// register log info
function DBLog(action, detail="", storeId = '', user = ""){
	DBinsert('log', {
			action:action,
			detail:detail,
			user:user
		}, storeId);
}

// encapsulated search one row into collection
function DBDocumentExists(collectionName, findCriteria){
	return new Promise((fullfill, reject)=>{
		DBcollection(collectionName,collection=>{
			return collection.findOne(findCriteria);
		},result=>{
			if(result !== null){
				DBDebug(collectionName + ' found');
				fullfill(result);
			}else{
				DBLog('DB '+collectionName+' not found', findCriteria);
				reject(collectionName+' not found');
			}
		});
	});
}


// check if store exists, promise return store object
function storeExists(storeToken){
	return DBDocumentExists('store',{token:storeToken});
}

// check if session exists, promise return store object
function sessionExists(sessionToken){
	return DBDocumentExists('session',{token:sessionToken});
}

// check if session exists, promise return store object
function userExists(userId){
	return DBDocumentExists('user',{token:storeToken});	
}

// encapsulated search per storeId
function DBSearchByStore(collectionName, storeId){
	return new Promise((fullfill, reject)=>{
		if(storeId === '' || storeId === undefined || storeId === null){
			DBError('storeId request empty');
			reject()
		}else{
			DBcollection(collectionName,collection=>{
				return collection.find({storeId:storeId}).toArray();
			},fullfill);
		}
	});
}

// search products of store
function productSearch(storeId){
	return DBSearchByStore('product', storeId);
}

// search categories of store
function categorySearch(storeId){
	return DBSearchByStore('category', storeId);
}

// search config of store
function configSearch(storeId){
	return DBSearchByStore('config', storeId);
}

// encapsulated search per storeId and sessionId
function DBSearchBySession(collectionName, storeId, sessionToken){
	return new Promise((fullfill, reject)=>{
		if(storeId === '' || storeId === undefined || storeId === null){
			DBError('storeId request empty');
			reject()
		}else if(sessionToken === '' || sessionToken === undefined || sessionToken === null){
			DBError('sessionId request empty');
			reject()
		}else{
			DBcollection(collectionName,collection=>{
				return collection.find({sessionToken:sessionToken}).toArray();
				// NOTE: sessionId is unique key, indepent of store
			},fullfill);
		}
	});
}

// search cart
function cartSearch(storeId, sessionId){
	return DBSearchBySession('cart',storeId, sessionId);
}

function orderSearch(storeId, sessionId){
	return DBSearchBySession('order',storeId, sessionId);
	// TODO limit last 25
}

function chatSearch(storeId, sessionId){
	return DBSearchBySession('chat',storeId, sessionId);
	// TODO limit last 25
}

// insert
function DBinsert(collectionName, object, storeId = ''){
	return new Promise((fullfill, reject)=>{
		DBcollection(collectionName,collection=>{
			const addInfo = element=>{
				// add info time when it was created
				element.timestamp = new Date().getTime();
				// store
				if(storeId !== '' && storeId !== null){
					element.storeId = storeId;
				}
				return element;
			};
			if(object.length > 1){
				object = object.map(addInfo);
				return collection.insertMany(object);
			}else{
				return collection.insertOne(addInfo(object));
			}
		},(result)=>{
			if(result.result.ok === 1){
				fullfill(result.insertedId);	
			}else{
				reject({
						error:'Error inserting '+collectionName
					});
				if(collectionName != 'log'){ // avoid loop
					DBLog('DB error insert', collectionName, storeId);
				}
			}
		});
	});
}

function DBupdate(){

}

// exports
module.exports = {
	collection: DBcollection,
	log:DBLog,
	store:storeExists,
	session:sessionExists,
	product:productSearch,
	category:categorySearch,
	config:configSearch,
	cart:cartSearch,
	order:orderSearch,
	chat:chatSearch,
	insert:DBinsert,
	update:DBupdate
}