import React from 'react';
import { reduxDispatch } from '../store/redux.js';
import '../css/StoreCreate.scss';
import { storeName } from '../actions/config.js';
import ProductUpload from '../components/ProductUpload.js';

// initial ui for create a new store
class StoreCreate extends React.Component{
	editStoreNameHandler(event){
		reduxDispatch(storeName(event.target.value));
	}
	render(){
		return <div className="page-create">
				<h1>Welcome to your ecommerce</h1>
				<input type="text" placeholder="Store Name" value={this.props.storeName} onChange={this.editStoreNameHandler.bind(this)} />
				<span>What products or service are you offering</span>
				<ProductUpload />
				<button><span>Load images</span></button>
				<a href="https://jjperez89.github.io/ecommerce">Test a demo</a>
				<span>
					<a href="https://jjperez89.github.com/ecommerce" title="Create an ecommerce on easy way, you just need upload your product image">How its works?</a>
					<span title="Use images with same width over white background">How edit images</span>
				</span>
			</div>
	}
}

export default StoreCreate;