import React from 'react';
import { reduxGetState } from '../store/redux.js';
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
		return <h1>{
			this.props.storeName + 
			(navigate !== "" && navigate !== undefined ? ' > '+navigate : '')}</h1>; // breadcumbs
	}
}

class HeaderMenu extends React.Component{
	render(){
		return (this.props.storeNew ? null : // StoreCreate show header empty
		<ul className="menu-icons">
			<li title="Chat with the store"><a href="chat.html"><img src={chatimg} alt="Chat" title="Chat with us"/ ></a></li>
			<li><a href="orders.html"><img src={ordersimg} alt="Orders" title="Last order"  /></a></li>
			<li title="Shopping cart"><a href="cart.html"><img src={cartimg} alt="Shopping cart" title="Shopping cart" /></a></li>
			<li title="Options and settings"><a href="config.html"><img src={configimg} alt="Options" title="Config the store" /></a></li>
		</ul>)
	}	
}

export default Header;