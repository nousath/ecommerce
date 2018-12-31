import { actionsType } from '../actions/constants.js';

export function productsReducers(state = {}, action) {
    switch (action.type) {
    	case actionsType.PRODUCT_CREATE:
    		// create new product
    		return {
    			...state,
    			[action.payload.id]:{
    				id:action.payload.id,
    				name:action.payload.name,
    				img:{
                        token:"",
                        uploading:0,
                        uploadError:false
                    },
    				price:"",
    				description:"",
    				category:"",
    				available:true,
    				feature:false
    			}
            }
        case actionsType.PRODUCT_UPLOAD_PROGRESS:
            return {
                ...state,
                [action.payload.id]:{
                    ...state[action.payload.id],
                    img:{
                        ...state[action.payload.id].img,
                        uploading:action.payload.progress
                    }
                }
            }
        case actionsType.PRODUCT_UPLOAD_ERROR:
            return {
                ...state,
                [action.payload]:{
                    ...state[action.payload],
                    img:{
                        ...state[action.payload].img,
                        uploadError:true
                    }
                }
            }
        case actionsType.PRODUCT_UPLOAD_COMPLETE:
            return {
                ...state,
                [action.payload.id]:{
                    ...state[action.payload.id],
                    img:{
                        ...state[action.payload.id].img,
                        token:action.payload.token
                    }
                }
            }
        default:
            return state;
    }
}