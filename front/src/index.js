import React from 'react';
import {Provider} from 'react-redux';
import ReactDOM from 'react-dom';
import '../src/assets/css/index.css';
import {store} from "./redux/storeConfig/store";
import App from './app';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root'));

serviceWorker.unregister();