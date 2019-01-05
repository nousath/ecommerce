import { actionsType } from '../actions/constants.js';

export function chatsReducers(state = {}, action) {
    switch (action.type) {
    	case actionsType.CHAT_SEND:
    		return {
    			...state,
    			[action.payload.id]:{
    				id:action.payload.id,
					message:action.payload.message,
					timestamp:action.payload.timestamp,
					request:action.payload.request
    			}
    		}
        default:
            return state;
    }
}


export function chatTypingReducers(state = "", action) {
    switch (action.type) {
    	case actionsType.CHAT_TYPING:
    		return action.payload;
        default:
            return state;
    }
}

// chat info from others session
export function chatsAdminReducers(state = {}, action) {
    switch (action.type) {
        default:
            return state;
    }
}