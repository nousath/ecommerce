// actions product
import { actionsType } from '../actions/constants.js';

// upload file
export const productFile = (name, file) => ({
  type: actionsType.PRODUCT_FILE,
  payload: {
  	name,
  	file
  }
})