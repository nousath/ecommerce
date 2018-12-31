/**
 * reductors connect to backend for persistence
 * 
 */
import { updateStore } from '../store/backend.js';
import { actionsType } from '../actions/constants.js';

export function backendReducers(state = {}, action) {
	const dontSend = [
		actionsType.NOTIFICATION_ERROR_BACKEND, 
		actionsType.NOTIFICATION_CLOCK,
		actionsType.PRODUCT_UPLOAD_PROGRESS
		];
	const avoid = dontSend.filter(actionOmit=>{
		return actionOmit === action.type
	});
	if(avoid.length === 0 && action.type.search('@@redux') === -1){ // avoid loop or internal actions
	    updateStore(state,action);
	}
    // reducers dont change redux state just send info to backend
    return state;
}