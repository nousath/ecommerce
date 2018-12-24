// actions product
import { PRODUCT_FILE } from '../actions/constants.js';

// upload file
export const productFile = (name, file) => ({
  type: PRODUCT_FILE,
  payload: {
  	name,
  	file
  }
})