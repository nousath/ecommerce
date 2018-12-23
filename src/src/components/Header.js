import React from 'react';
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
		const redux = this.props.redux;
		return <div className="header">
			<div className="menu">
				<HeaderTitle navigate={redux.navigate} />
				<HeaderMenu />
			</div>
		</div>
	}
}

class HeaderTitle extends React.Component{
	render(){
		return <h1 className="breadcumbs">Store Name</h1>;
	}
}

class HeaderMenu extends React.Component{
	render(){
		return <ul className="menu-icons">
			<li title="Chat with the store"><a href="chat.html"><img src={chatimg}/ ></a></li>
			<li><a href="orders.html"><img src={ordersimg} /></a></li>
			<li title="Shopping cart"><a href="cart.html"><img src={cartimg} /></a></li>
			<li title="Options and settings"><a href="config.html"><img src={configimg} /></a></li>
		</ul>
	}	
}

export default Header;