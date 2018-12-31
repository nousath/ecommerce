import { actionsType } from '../actions/constants.js';
import { notificationClock } from '../actions/notifications.js';
import { reduxDispatch, reduxGetState } from '../store/redux.js';

// show error one per one
function clock(){
    setTimeout(()=>{
        const state = reduxGetState();
        if(state.notifications.length > 0){
            reduxDispatch(notificationClock());
        }   
    }, 5000);
}
clock();

export function notificationsReducers(state = [], action) {
    switch (action.type) {
    	case actionsType.NOTIFICATION_ERROR_FRONTEND:
            // add item to array
    		return [
    			...state,
    			action.payload
    		]
        case actionsType.NOTIFICATION_CLOCK:
            if(state.length === 0){
                return state
            }else{
                clock();
                return [
                    ...state.splice(0,1)
                ]
            }
        default:
            return state;
    }
}