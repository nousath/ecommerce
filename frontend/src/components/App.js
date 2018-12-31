import React from 'react';
import '../css/App.scss';
import { reduxGetState } from '../store/redux.js'; 
import _ from 'lodash'; 
// typical store, call it different for dont confuse concept store from ecommerce
import Header from '../components/Header.js'
import Footer from '../components/Footer.js'
import Content from '../components/Content.js'
import Notification from '../components/Notification.js'

// main APP
class App extends React.Component {
  render() {
  	const state = reduxGetState();
  	const storeNew = _.isEmpty(state.products);
  	const storeName = (state.config.store !== undefined) ? state.config.store.name : '';
    return [
	      <Header storeNew={storeNew} storeName={storeName}></Header>,
        <Notification></Notification>,
	      <Content storeNew={storeNew} storeName={storeName}></Content>,
	      <Footer></Footer>
    ];
  }
}

export default App;