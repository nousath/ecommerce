import React from 'react';
import { reduxDispatch } from '../store/redux.js';
import { productFile } from '../actions/products.js';
const axios = require('axios');
const apiUploadProduct = 'http://localhost:3000/upload';

// UI for upload new product, just input file
class ProductUpload extends React.Component{
	constructor(props){
		super(props);
		// show files while upload to redux
		this.state = {
			files:[],
			uploading:0,
			error:false
		};
	}
	uploadHandler(event){
		const files = event.target.files;
		// FileList is not an array, then donot use forEach
		for(var i = 0; i < files.length; i++){
			this.uploadFile(files[i]);
		}
	}
	// convert file to base64
	uploadFile(file){
		// local reading for compress
		const reader = new FileReader();
		// local state
		const stateFiles = this.state.files;
		const posFile = stateFiles.length + 1;
		stateFiles[posFile] = {
			name:file.name,
			status:0,
			error:false
		};
		this.setState(stateFiles);
	    reader.onload = ()=>{	   		
	   		stateFiles[posFile].status = 5;
	   		this.setState(stateFiles);
	   		// compress file
	   		let data = new FormData();
	    	data.append('file', reader.result);
	   		axios.post(apiUploadProduct, data,
	   			{
			    	onUploadProgress: ProgressEvent => {
			          stateFiles[posFile].status = (ProgressEvent.loaded / ProgressEvent.total*100);
			          this.setState(stateFiles);
			        }
			    })
	   			.then(res=>{
	   				reduxDispatch(productFile(file.name, res.filename))
	   			});
	    };
	    reader.onerror = ()=>{
	    	// show error to user
	    	stateFiles[posFile].error = true;
	    	this.setState(stateFiles);
	    };
	    reader.readAsDataURL(file);
	}
	render(){
		const filesLoading = this.state.files.map((file)=>{
				return file.error ?
					<span>{file.name} ({file.status}%)</span> :
					<span style={{color:'red'}}>{file.name}</span>
			});
		return [
			<input type="file" placeholder="Images" multiple="multiple" onChange={this.uploadHandler.bind(this)} />,
			filesLoading
		]
	}	
}

export default ProductUpload