import { actionsType } from '../actions/constants.js';

export function configReducers(state = {}, action) {
    switch (action.type) {
    	case actionsType.CONFIG_STORE_NAME:
    		return {
    			...state,
    			store:{
    				...state.store,
    				name:action.payload.name,
    				url:action.payload.url
    			}
    		};
        default:
            return state;
    }
}