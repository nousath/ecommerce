import React from 'react';
import redux from '../store';
import { productFile } from '../actions/products.js';

// UI for upload new product, just input file

class ProductUpload extends React.Component{
	constructor(props){
		super(props);
		// show files while upload to redux
		this.state = {
			files:[] // { name, status, error }
		};
	}
	// convert file to base64
	uploadProductReader(file){
		const reader = new FileReader();
		// local state
		const stateFiles = this.state.files;
		const posFile = stateFiles.length + 1;
		stateFiles[posFile] = {
			name:file.name,
			status:0,
			error:false
		};
	    reader.onload = ()=>{
	   		redux.dispatch(productFile(file.name, reader.result));
	   		stateFiles[posFile].status = 100;
	    };
	    reader.onerror = ()=>{
	    	// show error to user
	    	stateFiles[posFile].error = true;
	    };
	    reader.onprogress = ()=>{
	    	
	    };
	    reader.readAsDataURL(file);
	}
	uploadProductHandler(event){
		const files = event.target.files;
		// FileList is not an array, then donot use forEach
		for(var i = 0; i < files.length; i++){
			this.uploadProductReader(files[i]);
		}
	}
	render(){
		const filesLoading = this.state.files.map((file)=>{
				return <span>{file.name} ({file.status})</span>
			});
		return [
			<input type="file" name="ProductsImage" placeholder="Images" multiple="multiple" onChange={this.uploadProductHandler.bind(this)} />,
			filesLoading
		]
	}	
}

export default ProductUpload