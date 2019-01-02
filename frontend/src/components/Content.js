import React from 'react';
import { reduxGetState } from '../store/redux.js';
import '../css/Content.scss';
import StoreCreate from '../components/StoreCreate.js'
import Store from '../components/Store.js'
import Chat from '../components/Chat.js'
import ChatAdmin from '../components/ChatAdmin.js'
import Cart from '../components/Cart.js'
import CartAdmin from '../components/CartAdmin.js'
import Order from '../components/Order.js'
import OrderAdmin from '../components/OrderAdmin.js'
import Config from '../components/Config.js'
import ConfigAdmin from '../components/ConfigAdmin.js'

// main, it is like a router, changing base on store.navigate
class Content extends React.Component{
	render(){
		const state = reduxGetState();
		var gui = "";
		if(state.config.admin_user === true){
			switch(state.navigate){
				case "Chat":
					gui = <ChatAdmin></ChatAdmin>;
					break;
				case "Cart":
					gui = <CartAdmin></CartAdmin>;
					break;
				case "Order":
					gui = <OrderAdmin></OrderAdmin>;
					break;
				case "Config":
					gui = <ConfigAdmin></ConfigAdmin>;
					break;
				default:
					if(this.props.storeNew){
						gui = <StoreCreate storeName={this.props.storeName} />;
					}else{
						gui = <Store></Store>;
					}
			}
		}else{
			switch(state.navigate){
				case "Chat":
					gui = <Chat></Chat>;
					break;
				case "Cart":
					gui = <Cart></Cart>;
					break;
				case "Order":
					gui = <Order></Order>;
					break;
				case "Config":
					gui = <Config></Config>;
					break;
				default:
					gui = <Store></Store>;
			}
		}
		return <div className="content">
			{gui}
			</div>
	}
}

export default Content;