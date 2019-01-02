// actions config
import { actionsType } from '../actions/constants.js';

export const storeName = (name) => {
	const url = name.replace(" ","_");
	return {
		  type: actionsType.CONFIG_STORE_NAME,
		  payload: {
		  	name: name,
		  	url: url
		}
	}
};