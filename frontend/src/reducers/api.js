/**
 * reductors connect to backend for persistence
 */
import { CONFIG_STORE_NAME, API_SESSION } from '../actions/constants.js';

export function apiReducers(state = {}, action) {
    switch (action.type) {
    	case API_SESSION: // save api storeToken and sessionToken
    		console.log('action', action);
    		return {
    			...state,
    			storeToken:action.payload.storeToken,
				sessionToken:action.payload.sessionToken
    		}
    	case CONFIG_STORE_NAME:
    		console.log('state',state);
    		console.log('action',action);

    		// VOY AQUI, al iniciar cargar el storeId y el sessionId
    		// adicional enviar la peticion de actualizar ambiente


    		break;
    	default:
    		return state;
    }
    // reducers dont change redux state
    return state;
}