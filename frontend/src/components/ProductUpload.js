import React from 'react';
import { reduxDispatch, reduxGetState } from '../store/redux.js';
import { productCreate, productUploadProgress, productUploadError, productUploadComplete } from '../actions/products.js';
import _ from 'lodash';
const axios = require('axios');
const pako = require('pako'); // zlib
const apiUploadProduct = 'http://localhost:3000/upload';

// UI for upload new product, just input file
class ProductUpload extends React.Component{
	uploadHandler(event){
		const files = event.target.files;
		// FileList is not an array, then donot use forEach
		for(var i = 0; i < files.length; i++){
			this.uploadFile(files[i]);
		}
	}
	uploadFile(file){
		const state = reduxGetState();
		const newid = _.size(state.product) + 1;
		reduxDispatch(productCreate(newid,file.name));
		getBase64(file)
			.then(filecontent=>{
				const filecompress = compress(filecontent);
				reduxDispatch(productUploadProgress(newid, 10));
				upload(filecompress,status=>{
						reduxDispatch(productUploadProgress(newid, status));
					})
					.then(fileToken=>{
						reduxDispatch(productUploadComplete(newid, fileToken));
					}).catch(()=>{
						reduxDispatch(productUploadError(newid));
					})
			})
			.catch(()=>{
				reduxDispatch(productUploadError(newid));
			})
	}
	render(){
		return <input type="file" placeholder="Images" multiple="multiple" onChange={this.uploadHandler.bind(this)} />
	}	
}

// convert file to base64
function getBase64(file){
	return new Promise((fullfill,reject)=>{
		// local reading for compress
		const reader = new FileReader();
		reader.onload = ()=>{
	   		fullfill(reader.result);
	    };
	    reader.onerror = ()=>{
	    	reject();
	    };
	    reader.readAsDataURL(file);
	});
}
function compress(filecontent){
	const binaryString = pako.deflate(filecontent, { to: 'string' });
	return btoa(binaryString);
}
function decompress(gzip){
	const binaryString = atob(gzip);
	return pako.inflate(binaryString, { to: 'string' }); 
}
function upload(filecontent, progressCallback){
	return new Promise((fullfill,reject)=>{			
   		let data = new FormData();
    	data.append('file', filecontent);
    	const reduxState = reduxGetState();
    	data.append('storeToken',reduxState.backend.storeToken);
    	data.append('sessionToken',reduxState.backend.sessionToken);
   		axios.post(apiUploadProduct, data,{
		    	onUploadProgress: ProgressEvent => {
		          progressCallback(ProgressEvent.loaded / ProgressEvent.total*100);
		        }
		    })
   			.then(res=>{
   				fullfill(res.data);
   			})
   			.catch(reject);
	});	
}

export default ProductUpload