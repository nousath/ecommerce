/**
 * reductors connect to backend for persistence
 * 
 */
import { actionsType } from '../actions/constants.js';

export function backendReducers(state = {}, action) {
    switch (action.type) {
    	case actionsType.BACKEND_SESSION: // save api storeToken and sessionToken
    		return {
    			...state,
    			storeToken:action.payload.storeToken,
				sessionToken:action.payload.sessionToken
    		}
    	case actionsType.CONFIG_STORE_NAME:
    		//console.log('state',state);
    		//console.log('action',action);

    		// VOY AQUI, al iniciar cargar el storeId y el sessionId
    		// adicional enviar la peticion de actualizar ambiente


    		break;
    	default:
    		return state;
    }
    // reducers dont change redux state
    return state;
}