/**
 * connect to backend
 */
const axios = require('axios');
const apiurl = 'localhost:8000';
var storeToken = '';
var sessionToken = '';

function createStore(){
	return new Promise((fullfill,reject)=>{
		http('createStore').then(response=>{
			console.log(response);
			if(response.result === 'ok'){
				storeToken = response.storeToken;
				sessionToken = response.sessionToken;
				fullfill();
			}else{
				reject();
			}
		}).catch(reject);
	});
}

function updateStore(key, object){

}

// send api
function http(action, data=''){
	return axios.post(apiurl+'/'+action, data);
}

// exports
module.exports = {
	createStore:createStore,
	updateStore:updateStore
}