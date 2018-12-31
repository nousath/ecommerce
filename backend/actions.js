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
				mongo.update('config',{},{"store.name":payload},storeId,true)
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