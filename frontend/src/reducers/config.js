import { actionsType } from '../actions/constants.js';

// default config for avoid undefined erros
const emptyConfig = {
	admin_user:true,
	store:{
		name:"",
		description:"",
		logo:"",
		url:"",
		qr:"img/qrsample.png"
	},
	color:{
		header:"#053e7b",
		footer:"#e9ebee",
		text:"#666666",
		link:"#053e7b"
	},
	chat_quick_answer:[
		"Hello, how can i help you",
		"Thanks for contact us"
	],
	order_options:{
		payment:{
			1:{
				id:1,
				name:"Cash"
			},
			2:{
				id:2,
				name:"Credit card"
			},
			3:{
				id:3,
				name:"Paypal"
			}
		},
		delivery:{
			1:{
				id:1,
				name:"Click and collect"
			},
			2:{
				id:2,
				name:"Postal service"
			},
			3:{
				id:3,
				name:"Uber eats"
			}
		},
		status:{
			1:{
				id:1,
				name:"Received",
				user_edited:false
			},
			2:{
				id:2,
				name:"Packing",
				user_edited:true,
			},
			3:{
				id:3,
				name:"Proccess 1",
				user_edited:true
			},
			4:{
				id:4,
				name:"Process 2",
				user_edited:true
			},
			5:{
				id:5,
				name:"Completed",
				user_edited:false
			},
			6:{
				id:6,
				name:"Canceled",
				internal:true
			}
		}
	}
}

export function configReducers(state = emptyConfig, action) {
    switch (action.type) {
    	case actionsType.CONFIG_STORE_NAME:
    		return {
    			...state,
    			store:{
    				...state.store,
    				name:action.payload
    			}
    		};
        default:
            return state;
    }
}