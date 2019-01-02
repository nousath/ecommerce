// API updateStore
// process redux events and convert to mongo actions
const mongo = require('./mongodb.js');

function reduxAction(storeObject, sessionObject, action){
	return new Promise((fullfill,reject)=>{
		const storeId = storeObject.id;
		const payload = action.payload;
		switch(action.type){
			case 'PRODUCT_CREATE': // new product
				mongo.insert('product',{
						id:payload.id,
						name:payload.name
					},storeId)
					.then(insertedId=>{
						fullfill();	
						mongo.log('Product created', payload.name, storeId);
					})
					.catch(reject);
				break;
			case 'PRODUCT_UPLOAD_COMPLETE': // save token
				mongo.update('product',{id:payload.id},{"img.token":payload.token},storeId)
					.then(fullfill)
					.catch(reject);
				break;
			case 'PRODUCT_UPLOAD_ERROR': // error uploading
				mongo.update('product',{id:payload.id},{"img.error":true},storeId)
					.then(insertedId=>{
						fullfill();	
						mongo.log('Product upload error', payload.name, storeId);
					})
					.catch(reject);
				break;
			case 'CONFIG_STORE_NAME': // change store name
				mongo.update('config',{},{"store.name":payload.name},storeId,true)
					.then((result)=>{
						mongo.update('store',{id:storeId},{"url":payload.url}, storeId)
							.then(fullfill)
							.catch(reject);
					})
					.catch(reject);
				break;
			case 'NAVIGATE_CHANGE': // user ui
				mongo.update('session',{token:sessionObject.token},{"navigate":payload})
					.then(fullfill)
					.catch(reject);
				break;
			case 'NOTIFICATION_ERROR_FRONTEND': // error user ui
				mongo.log('Error UI', payload.message, storeId, sessionObject.userId)
					.then(fullfill)
					.catch(reject);
				break;
			default:
				reject({
					error:'Undefined action'
				});
				mongo.log('Error undefined action', object, storeId);
				break;
		}	
	});
};

module.exports = {
	reduxAction:reduxAction
}