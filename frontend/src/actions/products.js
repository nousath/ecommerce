// actions product
import { actionsType } from '../actions/constants.js';

// upload file
export const productCreate = (id,name) => ({
  type: actionsType.PRODUCT_CREATE,
  payload:{
    id,
    name 
  }
})

export const productUploadProgress = (id, progress) =>({
  type: actionsType.PRODUCT_UPLOAD_PROGRESS,
  payload: {
  	id,
  	progress
  }	
})

export const productUploadError = (id) =>({
  type: actionsType.PRODUCT_UPLOAD_ERROR,
  payload: id
})

export const productUploadComplete = (id, token) => ({
  type: actionsType.PRODUCT_UPLOAD_COMPLETE,
  payload: {
  	id,
  	token
  }
})