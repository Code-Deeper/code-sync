import React from 'react';
import ReactDOM from 'react-dom';
import './bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import store from './store'
import axios from 'axios'

axios.interceptors.request.use((req) => {
  if (localStorage.getItem('authUser')) {
    req.headers.Authorization = 'Bearer ' + JSON.parse(localStorage.getItem('authUser')).token;
  }

  return req;
})


ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App  />
    </React.StrictMode>
  </Provider>,
  document.getElementById('root')
);

