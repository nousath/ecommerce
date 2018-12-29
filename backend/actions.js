// API updateStore
// process redux events and convert to mongo actions
const mongo = require('./mongodb.js');

function reduxAction(storeObject, sessionObject, action){
	return new Promise((fullfill,reject)=>{
		const storeId = storeObject.id;
		const payload = action.payload;
		switch(action.type){
			case 'PRODUCT_FILE': // new product
				mongo.insert('product',payload,storeId)
					.then(insertedId=>{
						fullfill();			
						mongo.log('Product created', object.name, storeId);
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