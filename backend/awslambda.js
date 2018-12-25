/***
API functions for access on lambda
encapsulated database access, authenticate user and create log access
*/

const mongo = require('./mongodb.js');

// useful function for generate random, https://gist.github.com/6174/6062387
function randomToken() {
  return Math.random().toString(36).substring(2, 15) + 
  	Math.random().toString(36).substring(2, 15) +
  	Math.random().toString(36).substring(2, 15);
}

function APIError(err){
	console.log(err);
}

// user type constant
const USER_ADMIN = 'A';
const USER_SELLER = 'S';
const USER_VISITOR = 'V';

// session type constant
const SESSION_ADMIN = 'A';
const SESSION_VISITOR = 'V';
const SESSION_ADMIN_ANNON = 'AA'; // annonymus user
const SESSION_VISITOR_ANNON = 'VA';

// allow create store and products without email or sign up for UX and for show functionality and demos
function createStore(callback){
	mongo.connect().then(()=>{
		var storeId = 1;
		const storeToken = randomToken();
		mongo.collection('store',collection=>{
			return collection.countDocuments(); // store count for get max id
		},count=>{
			// 1. insert DB store
			storeId = count + 1;
			mongo.collection('store',collection=>{
				return collection.insertOne({
					id:storeId,
					token:storeToken,
					timestamp:new Date().getTime()
				});
			},(result)=>{
				// 2. insert DB store session with type AdminAnnonymous
				const sessionToken = randomToken();
				mongo.collection('session',collection=>{
					return collection.insertOne({
						token:sessionToken,
						storeId:storeId,
						type:SESSION_ADMIN_ANNON, // visitoradmin
						userId:'',
						timestamp:new Date().getTime()
					});
				},(result2)=>{
					// final result
					callback({
						store:storeToken,
						session:sessionToken
					});
					// 3. log
					mongo.log(storeId, 'create store', storeToken, 'annonymus');
				})
			})
		});
	})
	.catch(APIError);
}


// MAIN function, requested at software start, all frontend will build it base on this
// return redux object
function getStore(storeToken, sessionToken, callback){
	mongo.connect().then(()=>{
		// PROCESS 
		//1. check storeId exists DB store
		mongo.store(storeToken)
		.then(storeObject=>{


			// VOY AQUI, revisando funciones en paralelo


		})
		.catch(()=>{ // err
			callback({
				error:'Store not found',
				detail:storeToken
			});
		})
		//2. search DB product, filtered by storeId
		//3. search DB category filtered by storeId
		//4. search DB config filtered by storeId
		//5. if sessionId exists and get DB userId 
		//5.1 search DB cart filtered by storeId and userId
		//5.2 search DB chat filtered by storeId and userId
		//5.3 search DB order filtered by storeId and userId
		//6. if userId has rol seller or Admin
		//6.1 search DB order filtered by storeId and status not canceled and not completed
		//6.2 search DB chat filtered by storeId and conversation without answer
		//6.3 calculate config.statistis count visitor, count orders, count chat, all filtered by store
		//7. if userId has rol Admin
		//7.1 mark config with admin flag
		//8. if userId has rol visitor, omit config.chat_quick_answer
	})
	.catch(APIError);
}


// test
//createStore(console.log);

// test search store
mongo.connect().then(()=>{
	mongo.store('nf8demmykbh2y90nh8sy9fglb8qrfm6n5')
	.then(console.log)
	.catch(console.log);
} );
