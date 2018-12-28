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

// TODO: separate download image of getStore
// TODO: APIError, DBLog save to db return api response

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
	var storeId = 1;
	const storeToken = randomToken();
	mongo.collection('store',collection=>{
		return collection.countDocuments(); // store count for get max id
	},count=>{
		// 1. insert DB store
		storeId = count + 1;
		mongo.insert('store',{
				id:storeId,
				token:storeToken
			})
		.then(()=>{
			// 2. insert DB store session with type AdminAnnonymous
			const sessionToken = randomToken();
			mongo.insert('session',{
					token:sessionToken,
					type:SESSION_ADMIN_ANNON, // visitoradmin
					userId:''
				}, storeId)
			.then(()=>{
				// final result
				callback({
					store:storeToken,
					session:sessionToken,
					result:'ok'
				});
				// 3. log
				mongo.log(storeId, 'create store', storeToken, 'annonymus');
			});
		});
	});
}

// encapsulated check storeToken and sessionToken exists
function checkStore(storeToken, sessionToken){
	return new Promise((fullfill, reject)=>{
		// step 1 get using parallel store and user info
		var storeObject = null;
		var sessionObject = null;
		var waiting = 1; // wait all functions
		const nextStep = ()=>{
			waiting--;
			if(waiting == 0){
				// security check session from same store
				const storeId = storeObject.id;
				if(sessionObject !== null){
					if(storeId != sessionObject.storeId){
						// security violation
						reject({
							error:'Session token from other store'
						});
						mongo.log(storeId, 'Security session from other store', sessionObject.token, '');
						return;
					}
				}
				fullfill([storeObject, sessionObject]);
			}
		};
		// store 
		mongo.store(storeToken).then(result=>{
			storeObject = result;
			nextStep();
		}).catch(()=>{ // err
			reject({
				error:'Store not found',
				detail:storeToken
			});
		});
		// session
		if(sessionToken != ''){
			waiting++;
			mongo.session(sessionToken).then(result=>{
				sessionObject = result;
				nextStep();
			}).catch(()=>{ // err
				reject({
					error:'Session not found',
					detail:sessionToken
				});
			});
		}
	});
}


// MAIN function, requested at software start, all frontend will build it base on this
// return redux object
// PROCESS 
//1. check storeId exists DB store
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
function getStore(storeToken, sessionToken = '', callback){
	// step 1 get using parallel store and user info
	checkStore(storeToken, sessionToken)
		.then(([storeObject, sessionObject])=>{
			// step 2 get collections for all object filtered per store
			//console.log('Step2', storeObject, sessionObject);
			var redux = new Object();
			var waiting = 3;
			const nextStep = ()=>{
				waiting--;
				if(waiting == 0){
					// after get alls collections
					callback(redux);
				}
			};
			// get product, category and config
			const storeId = storeObject.id;
			mongo.product(storeId).then(result=>{
				redux.product = result;
			})
			.finally(nextStep);
			mongo.category(storeId).then(result=>{
				redux.category = result;
			})
			.finally(nextStep);
			mongo.config(storeId).then(result=>{
				redux.config = result;
			})
			.finally(nextStep);

			// cart, order, chat
			if(sessionObject !== null){
				waiting += 3;
				const sessionToken = sessionObject.token;
				mongo.cart(storeId, sessionToken).then(result=>{
					redux.cart = result;
				})
				.finally(nextStep);
				mongo.order(storeId, sessionToken).then(result=>{
					redux.order = result;
				})
				.finally(nextStep);
				mongo.chat(storeId, sessionToken).then(result=>{
					redux.chat = result;
				})
				.finally(nextStep);
			}
			// TODO build redux object for admin
		}).catch(callback);
}

// update info database
function updateStore(storeToken, sessionToken, action, key, object, callback){
	checkStore(storeToken, sessionToken)
		.then(([storeObject, sessionObject])=>{
			const storeId = storeObject.id;
			switch(action){
				case 'product':
					mongo.insert('product',object,storeId)
						.then(insertedId=>{
							callback({
								result:'ok'
							});
							mongo.log('Product created', object.name, storeId);
						})
						.catch(callback);
					break;
			}
		}).catch(callback);
}

// exports
module.exports = {
	createStore:createStore,
	getStore:getStore,
	updateStore:updateStore
}

// MAIN test
createStore(console.log);
updateStore('m1dkvbyuh8dmckld3l0fgm8lup1h2a6', 'iamkfni2dyslzwr0i9x18lj1w8v7jscno',
	'product', '', {name:'test'},console.log);
getStore('m1dkvbyuh8dmckld3l0fgm8lup1h2a6', 'iamkfni2dyslzwr0i9x18lj1w8v7jscno', console.log);