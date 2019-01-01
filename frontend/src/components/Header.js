import React from 'react';
import { reduxGetState, reduxDispatch } from '../store/redux.js';
import { navigateChange } from '../actions/navigate.js';
import '../css/Header.scss';
import chatimg from '../img/chat.png';
import chatimgselected from '../img/chat_selected.png';
import ordersimg from '../img/orders.png';
import ordersimgselected from '../img/orders_selected.png';
import cartimg from '../img/cart.png';
import cartimgselected from '../img/cart_selected.png';
import configimg from '../img/config.png';
import configimgselected from '../img/config_selected.png';

class Header extends React.Component{
	render(){
		return <div className="header">
			<div className="menu">
				<HeaderTitle storeNew={this.props.storeNew} storeName={this.props.storeName} />
				<HeaderMenu storeNew={this.props.storeNew} />
			</div>
		</div>
	}
}

class HeaderTitle extends React.Component{
	render(){
		const state = reduxGetState();
		const navigate = state.navigate;
		return <h1>{this.props.storeName}
			{(navigate !== "" && navigate !== undefined ? ' > '+navigate : '')}
			</h1>; // breadcumbs
	}
}

class HeaderMenu extends React.Component{
	navigateMenu(menu){
		const state = reduxGetState();
		if(state.navigate === menu){ // back to store
			menu = '';
		}
		reduxDispatch(navigateChange(menu));
	}
	navigateCart(){
		this.navigateMenu("Cart");
	}
	navigateChat(){
		this.navigateMenu("Chat");
	}
	navigateConfig(){
		this.navigateMenu("Config");
	}
	navigateOrder(){
		this.navigateMenu("Order");
	}
	render(){
		const state = reduxGetState();
		return (this.props.storeNew ? null : // StoreCreate show header empty
		<ul className="menu-icons">
			<li onClick={this.navigateCart.bind(this)}>
				<img src={state.navigate === 'Cart' ? cartimgselected : cartimg} 
					alt="Shopping cart" title="Shopping cart" />
			</li>
			<li onClick={this.navigateChat.bind(this)}>
				<img src={state.navigate === 'Chat' ? chatimgselected : chatimg} 
					alt="Chat" title="Chat with us"/ >
			</li>
			<li onClick={this.navigateOrder.bind(this)}>
				<img src={state.navigate === 'Order' ? ordersimgselected : ordersimg} 
					alt="Orders" title="Last order"  />
			</li>
			<li onClick={this.navigateConfig.bind(this)}>
				<img src={state.navigate === 'Config' ? configimgselected : configimg} 
					alt="Options" title="Config the store" />
			</li>
		</ul>)
	}	
}

export default Header;