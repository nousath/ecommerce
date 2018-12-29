import { actionsType } from '../actions/constants.js';
import _ from 'lodash';

export function productsReducers(state = {}, action) {
    switch (action.type) {
    	case actionsType.PRODUCT_FILE:
    		console.log("filename: ", action.payload.name);
    		console.log("file: ", action.payload.file);
    		// create new product
    		const newid = _.size(state) + 1;
    		return {
    			...state,
    			[newid]:{
    				id:newid,
    				name:action.payload.name,
    				img:action.payload.file,
    				price:"",
    				description:"",
    				category:"",
    				available:true,
    				feature:false
    			}
    		}
        default:
            return state;
    }
}