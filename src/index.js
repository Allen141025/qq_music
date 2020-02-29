import React from 'react';
import ReactDOM from 'react-dom';
import 'lib-flexible'
import './assets/font_74bntjvs7d9/iconfont.css'
import App from './App';
import * as serviceWorker from './serviceWorker';
import './index.css';
import {Provider} from 'react-redux'
import reducer from './store'
import {createStore,applyMiddleware} from 'redux'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
const store = createStore(reducer,applyMiddleware(thunk,logger))
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
, document.getElementById('root'));

serviceWorker.unregister();
