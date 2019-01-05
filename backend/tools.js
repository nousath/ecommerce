// utils

// useful function for generate random, https://gist.github.com/6174/6062387
function randomToken() {
  return Math.random().toString(36).substring(2, 15) + 
  	Math.random().toString(36).substring(2, 15) +
  	Math.random().toString(36).substring(2, 15);
}

// check all options for variable empty
function isEmpty(variable){
	return variable === undefined || 
		variable === null || 
		variable === '' ||
		variable === "undefined" ||
		variable === "null";
}

// convert array to object for redux managment
function arrayToObject(result){
	return result.reduce(function ( total, current ) {
	    total[ current.id ] = current;
	    return total;
	}, {});
}

// remove attr _id, storeId, sessionToken
function DBCleanInternals(result){
	if(result === undefined || result === '' || result === null){
		return result;
	}else{
		return result.map((doc)=>{
			const forDelete = ['_id','storeId','sessionToken'];
			for(var i = 0; i < forDelete.length; i++){
				delete doc[forDelete[i]];
			}
			return doc;
		});
	}	
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

module.exports = {
	randomToken:randomToken,
	isEmpty:isEmpty,
	arrayToObject:arrayToObject,
	DBCleanInternals:DBCleanInternals,
	// constant
	USER_ADMIN:USER_ADMIN,
	USER_SELLER:USER_SELLER,
	USER_VISITOR:USER_VISITOR,
	SESSION_ADMIN:SESSION_ADMIN,
	SESSION_VISITOR:SESSION_VISITOR,
	SESSION_ADMIN_ANNON:SESSION_ADMIN_ANNON,
	SESSION_VISITOR_ANNON:SESSION_VISITOR_ANNON
}