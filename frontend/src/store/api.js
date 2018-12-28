/**
 * reductors connect to backend for persistence
 */
import redux from '../store/index.js';
import { apiSession } from '../actions/api.js';
const axios = require('axios');
const apiurl = 'http://localhost:3000';
const sessionTokenItem = 'buffer1'; // save localStorage with other name
const storeTokenItem = 'buffer2';

function createStore(){
	return new Promise((fullfill,reject)=>{
		api('createStore').then(response=>{
			const data = response.data;
			if(data.result === 'ok'){
				const storeToken = data.storeToken;
				const sessionToken = data.sessionToken;
				// save redux object
				redux.dispatch(apiSession(storeToken,sessionToken));
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
		const state = redux.getState();
		const storeToken = state.api.storeToken;
		const sessionToken = state.api.sessionToken;
		api('getStore',{
			storeToken:storeToken,
			sessionToken:sessionToken
		})
			.then(response=>{
				const data = response.data;
				console.log(data);
				if(data.result === 'ok'){
					fullfill();
				}else{
					reject();
				}
			})
			.catch(reject);
	});
}

// indexonload function, search sessionToken and storeToken for localStorage
// if doesnt exists, generate request for create it
export function checkBackend(){
	return new Promise((fullfill,reject)=>{	
		const storeToken = localStorage.getItem(storeTokenItem);
		const sessionToken = localStorage.getItem(sessionTokenItem);	
		if(storeToken === null || storeToken === undefined || storeToken === "undefined"){ // does exists
			createStore()
				.then(fullfill)
				.catch(reject);
		}else{
			// save on redux object
			redux.dispatch(apiSession(storeToken,sessionToken));
			// getStoreInfo
			getStore()
				.then(fullfill)
				.catch(reject);
		}
	});
}

// send api
function api(action, data=''){
	return axios.post(apiurl+'/'+action, data);
}