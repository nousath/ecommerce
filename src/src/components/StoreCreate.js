import React from 'react';
import '../css/StoreCreate.scss';
import { editStoreName } from '../actions/config.js';
import redux from '../store'; 

class StoreCreate extends React.Component{
	editStoreNameHandler(event){
		redux.dispatch(editStoreName(event.target.value));
	}
	render(){
		const storeName = this.props.storeName;
		return <div className="page-create">
				<h1>Welcome to your ecommerce</h1>
				<input type="text" name="StoreName" placeholder="Store Name" value={storeName} onChange={this.editStoreNameHandler.bind(this)} />
				<span>What products or service are you offering</span>
				<input type="file" name="ProductsImage" placeholder="images" />
				<a href="store.html"><button><span>Load images</span></button></a>
				<a href="https://jjperez89.github.io/ecommerce">How its works?</a>
				<span title="Use images with same width over white background">How edit images</span>
			</div>
	}
}

export default StoreCreate;