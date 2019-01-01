import { actionsType } from '../actions/constants.js';

export function navigateReducers(state = "", action) {
    switch (action.type) {
    	case actionsType.NAVIGATE_CHANGE:
			return action.payload;
        default:
            return state;
    }
}