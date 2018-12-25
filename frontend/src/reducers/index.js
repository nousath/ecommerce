import { combineReducers } from 'redux';
import { productsReducers } from '../reducers/products.js'
import { categoriesReducers } from '../reducers/categories.js'
import { cartReducers } from '../reducers/cart.js'
import { ordersReducers } from '../reducers/orders.js'
import { navigateReducers } from '../reducers/navigate.js'
import { configReducers } from '../reducers/config.js'
import { chatsReducers } from '../reducers/chat.js'
import { chatTypingReducers } from '../reducers/chatTyping.js'
import { searchTypingReducers } from '../reducers/search.js'

export default combineReducers({
	products:productsReducers,
	categories:categoriesReducers,
	cart:cartReducers,
	orders:ordersReducers,
	chats:chatsReducers,
	navigate:navigateReducers,
	searchTyping:searchTypingReducers,
	chatTyping:chatTypingReducers,
	config:configReducers
});