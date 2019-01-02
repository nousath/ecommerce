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
import { reduxGetState, reduxCreateStore, reduxSubscribe } from '../store/redux.js';
const lodash = require('lodash');
const axios = require('axios');
const apiurl = 'http://localhost:3000';
// save localStorage with other name
const sessionTokenItem = 'buffer1'; 
const storeTokenItem = 'buffer2';
const reduxTokenItem = 'temp1';

// indexonload function, search sessionToken and storeToken for localStorage
// if doesnt exists, generate request for create it
export function backendLoad(){
	return new Promise((fullfill,reject)=>{	
		// case server is not responding
		const notBackend = (err)=>{
			loadRedux(); // create empty redux with localStorage
			reject(err);
		}
		// check backend for last info
		const storeToken = localStorage.getItem(storeTokenItem);
		const sessionToken = localStorage.getItem(sessionTokenItem);
		const location = window.location.pathname;
		if((storeToken === null || storeToken === undefined || storeToken === "undefined") // not exists
			&& (location === '/')){ 
			createStore()
				.then(loadRedux)
				.then(fullfill)
				.catch(notBackend);
		}else{
			// getStoreInfo
			getStore(storeToken,sessionToken,location)
				.then(loadRedux)
				.then(fullfill)
				.catch(notBackend);
		}
	});
}

// create redux object, after request info from backend
function loadRedux(initialState){
	var reduxObject = '';
	// not info from backend
	if(initialState === '' || initialState === undefined || initialState === null){
		const offlineInfo = localStorage.getItem(reduxTokenItem);
		if(offlineInfo !== null && offlineInfo !== undefined && offlineInfo !== "undefined"){
			reduxObject = JSON.parse(offlineInfo);
		}
	}else{
		reduxObject = initialState;
		// save tokens to localStorage 
		const backend = reduxObject.backend;
		localStorage.setItem(storeTokenItem,backend.storeToken);
		localStorage.setItem(sessionTokenItem,backend.sessionToken);
	}
	reduxCreateStore(reduxObject);
	// subscribe localstorage
	reduxSubscribe(
			lodash.throttle(()=>{
				localStorage.setItem(reduxTokenItem,JSON.stringify(reduxGetState()));
			},1500));
}

function createStore(){
	return new Promise((fullfill,reject)=>{
		api('createStore').then(response=>{
			if(response.result === 'ok'){
				fullfill({
					// default redux object
					backend:{
						storeToken:response.storeToken,
						sessionToken:response.sessionToken
					},
					config:{
						admin_user:true
					}
				});
			}else{
				reject();
			}
		}).catch(reject);
	});
}

// receive redux state and actions from reducers
export function updateStore(state, action){
	return new Promise((fullfill,reject)=>{
		const storeToken = state.storeToken;
		const sessionToken = state.sessionToken;

		// TODO, typing actions wait until end typing
		// TODO, save actions to indexedDB and send groups to backend

		api('updateStore',{
			storeToken:storeToken,
			sessionToken:sessionToken,
			action:action
		})
		.then(fullfill)
		.catch(reject);
	});
}

function getStore(storeTokenParam = '', sessionTokenParam = '', location = ''){
	return new Promise((fullfill,reject)=>{
		var storeToken = storeTokenParam;
		var sessionToken = sessionTokenParam;
		if(storeToken === ''){
			const state = reduxGetState();
			storeToken = state.backend.storeToken;
			sessionToken = state.backend.sessionToken;
		}
		api('getStore',{
				storeToken:storeToken,
				sessionToken:sessionToken,
				location:location
			})
			.then(fullfill)
			.catch(reject);
	});
}

// api create
const httpClient = axios.create();
httpClient.defaults.timeout = 3000;
httpClient.defaults.baseURL = apiurl

// send api
function api(action, data=''){
	return new Promise((fullfill, reject)=>{
		httpClient.post(action, data)
			.then((response)=>{
				const data = response.data;
				if(data.error !== '' && data.error !== undefined){
					reject(data.error);
				}else{
					fullfill(data);	
				}
			})
			.catch(err=>{
				// convert err object to text
				reject(err.message);
			});
	});
	
}