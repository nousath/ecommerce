/***
API functions for access on lambda
encapsulated database access, authenticate user and create log access
*/
const mongo = require('./mongodb.js');
const reduxAction = require('./actions.js').reduxAction;

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
function createStore(){
	return new Promise((fullfill, reject)=>{
		const storeToken = randomToken();
		mongo.collection('store',collection=>{
			return collection.countDocuments(); // store count for get max id
		},count=>{
			// 1. insert DB store
			const storeId = count + 1;
			mongo.insert('store',{
					id:storeId,
					token:storeToken
				})
			.then(()=>{
				// 2. insert DB session with type AdminAnnonymous
				createSession(SESSION_ADMIN_ANNON, storeId)
					.then(sessionToken=>{
						// final result
						fullfill({
							storeToken:storeToken,
							sessionToken:sessionToken,
							result:'ok'
						});
						// 3. log
						mongo.log(storeId, 'create store', storeToken, 'annonymus');
					})
					.catch(reject);
			})
			.catch(reject);
		},reject);
	});
}

// encapsulated create new session
function createSession(rolType, storeId = '', userId = ''){
	return new Promise((fullfill,reject)=>{
		const sessionToken = randomToken();
		mongo.insert('session',{
				token:sessionToken,
				type:rolType, // visitoradmin
				userId:userId
			}, storeId)
		.then((insertedId)=>{
			fullfill(sessionToken);
		})
		.catch(reject);
	});
}

// encapsulated check storeToken and sessionToken exists
function checkStore(storeToken, sessionToken, createSessionIfFail = false){
	return new Promise((fullfill, reject)=>{
		if(storeToken === undefined || storeToken === null || storeToken === ''){
			reject({
				error:'Store token empty'
			});
			return;			
		}
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
					fullfill([storeObject, sessionObject]);
				}else{
					if(createSessionIfFail){
						// ux create a session for visitor user
						createSession(SESSION_VISITOR_ANNON, storeId)
							.then(sessionToken=>{
								sessionObject = {
									token:sessionToken,
									type:SESSION_VISITOR_ANNON
								};
								fullfill([storeObject, sessionObject]);
							})
							.catch(reject);
					}else{
						reject({
							error:'Session not found',
							detail:sessionToken
						});
					}
				}
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
			})
			.catch(()=>{
				// ux, dont stop for stop, create a new sessiontoken
				nextStep();
			})
		}
	});
}

// convert array to object for redux managment
function arrayToObject(result){
	return result.reduce(function ( total, current ) {
	    total[ current.id ] = current;
	    return total;
	}, {});
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
function getStore(storeToken, sessionToken = ''){
	return new Promise((fullfill, reject)=>{
		// step 1 get using parallel store and user info
		checkStore(storeToken, sessionToken, true)
			.then(([storeObject, sessionObject])=>{
				// step 2 get collections for all object filtered per store
				//console.log('Step2', storeObject, sessionObject);
				var redux = new Object();
				var waiting = 6;
				const nextStep = ()=>{
					waiting--;
					if(waiting == 0){
						// after get alls collections
						fullfill(redux);
					}
				};
				// api options
				const sessionToken = sessionObject.token;
				redux.backend = {
					sessionToken:sessionToken,
					storeToken:storeObject.token
				};
				// get product, category and config
				const storeId = storeObject.id;
				mongo.product(storeId).then(result=>{
					redux.products = arrayToObject(result);
				})
				.finally(nextStep);
				mongo.category(storeId).then(result=>{
					redux.categories = arrayToObject(result);
				})
				.finally(nextStep);
				mongo.config(storeId).then(result=>{
					if(result.length == 0){
						redux.config = {}
					}else{
						redux.config = result[0];
					}
				})
				.finally(nextStep);
				// cart, order, chat
				mongo.cart(storeId, sessionToken).then(result=>{
					redux.cart = result;
				})
				.finally(nextStep);
				mongo.order(storeId, sessionToken).then(result=>{
					redux.orders = arrayToObject(result);
				})
				.finally(nextStep);
				mongo.chat(storeId, sessionToken).then(result=>{
					redux.chats = arrayToObject(result);
				})
				.finally(nextStep);
				// TODO build redux object for admin
			})
			.catch(reject);	
	});
}

// update info database
function updateStore(storeToken, sessionToken, action){
	return new Promise((fullfill, reject)=>{
		checkStore(storeToken, sessionToken, false)
			.then(([storeObject, sessionObject])=>{
				// execute same redux frontend actions on database
				reduxAction(storeObject,sessionObject,action)
					.then(()=>{
						fullfill({
							result:'ok'
						})
					})
					.catch(reject);

			}).catch(reject);
	});
}

// save files into mongodb for easy download multiple products
function uploadFile(filecontent, storeToken, sessionToken){
	return new Promise((fullfill,reject)=>{
		checkStore(storeToken, sessionToken, false)
			.then(([storeObject, sessionObject])=>{
				const filename = randomToken();
				const storeId = storeObject.id;
				mongo.insert('file',{
						token:randomToken,
						file:filecontent
					},storeId)
				.then((result)=>{
					fullfill(filename);
				})
				.catch(reject)
			})
			.catch(reject)
	});
}

function getFiles(storeToken, sessionToken){

}

// exports
module.exports = {
	createStore:createStore,
	getStore:getStore,
	updateStore:updateStore,
	uploadFile:uploadFile,
	getFiles:getFiles
}