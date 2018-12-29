/**

DESIGN NOTE
using tools redux-thunk, saga, redux-refetch
the process will be
1. the user generate an event 
2. generate a request to backend, dispatch event loading
3. when callback or promise for backend is completed, dispatch event complete
4. if backend fail then dispatch event fail
5. then reducers update redux store and update react components to the user


for UX user dont wait to backend and mobile offline, we apply
1. the user generate an event
2. (previous step 5) reducers update redux and react components
3. save redux store to localStorage
4. on app startup if offline request redux store from localStorage, for online request it from backend
5. because actions will process for all reductors
    this reductor will generate a request with store delta
    the data event will save on indexedDB for offline
6. when it is online the data event will send to backend
7. backend will send data event to other user for realtime
8. if request failed use redux time travel or reload from backend

benefits: 
* user does not have to wait backend
* business logic for react - redux component
will be separate for backend and processing logic

cons:
* if there are error with backend, no persistence.
wrong information will be show it to the user
however making a good testing process there will be few errors.
and normally 2% (or less) request backend will fail then dont force user wait in other 98% request
 */
import { reduxGetState, reduxCreateStore, reduxDispatch, reduxSubscribe } from '../store/redux.js';
import { backendSession } from '../actions/backend.js';
const lodash = require('lodash');
const axios = require('axios');
const apiurl = 'http://localhost:3000';
const sessionTokenItem = 'buffer1'; // save localStorage with other name
const storeTokenItem = 'buffer2';
const reduxTokenItem = 'buffer3';


// indexonload function, search sessionToken and storeToken for localStorage
// if doesnt exists, generate request for create it
export function backendLoad(){
	return new Promise((fullfill,reject)=>{	
		// load redux object from localStorage
		const reduxObject = localStorage.getItem(reduxTokenItem);
		if(reduxObject === null || reduxObject === undefined || reduxObject === "undefined"){
			reduxCreateStore();
		}else{
			reduxCreateStore(JSON.parse(reduxObject));
		}
		// check backend for last info
		const storeToken = localStorage.getItem(storeTokenItem);
		const sessionToken = localStorage.getItem(sessionTokenItem);
		// subscribe localstorage
		const nextStep = (result)=>{
			fullfill(result);
			reduxSubscribe(
					lodash.throttle(()=>{
						localStorageSave();
					},1500));
		};
		if(storeToken === null || storeToken === undefined || storeToken === "undefined"){ // does exists
			createStore()
				.then(nextStep)
				.catch(reject);
		}else{
			// save on redux object
			reduxDispatch(backendSession(storeToken,sessionToken));
			// getStoreInfo
			getStore()
				.then(nextStep)
				.catch(reject);
		}
	});
}

// redux suscribe event save to localStorage
function localStorageSave(){
	localStorage.setItem(reduxTokenItem,JSON.stringify(reduxGetState()));
}

function createStore(){
	return new Promise((fullfill,reject)=>{
		api('createStore').then(response=>{
			const data = response.data;
			if(data.result === 'ok'){
				const storeToken = data.storeToken;
				const sessionToken = data.sessionToken;
				// save redux object
				reduxDispatch(backendSession(storeToken,sessionToken));
				// save localStorage
				localStorage.setItem(storeTokenItem,storeToken);
				localStorage.setItem(sessionTokenItem,sessionToken);
				fullfill();
			}else{
				reject();
			}
		}).catch(reject);
	});
}

export function updateStore(key, object){

}

function getStore(){
	return new Promise((fullfill,reject)=>{
		const state = reduxGetState();
		const storeToken = state.backend.storeToken;
		const sessionToken = state.backend.sessionToken;
		api('getStore',{
			storeToken:storeToken,
			sessionToken:sessionToken
		})
			.then(response=>{
				const data = response.data;
				fullfill(data);
			})
			.catch(reject);
	});
}

// send api
function api(action, data=''){
	return axios.post(apiurl+'/'+action, data);
}