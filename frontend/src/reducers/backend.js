/**
 * reductors connect to backend for persistence
 * 
 */
import { updateStore } from '../store/backend.js';
import { actionsType } from '../actions/constants.js';

export function backendReducers(state = {}, action) {
	const dontSend = [
		actionsType.NOTIFICATION_ERROR_BACKEND, 
		actionsType.NOTIFICATION_CLOCK
		];
	const avoid = dontSend.filter(actionOmit=>{
		return actionOmit === action.type
	});
	if(avoid.length !== 0){ // avoid loop
	    updateStore(state,action);
	}
    // reducers dont change redux state just send info to backend
    return state;
}