import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux'
import store from './store'
// import axios from 'axios'

import './index.css'
// import './bootstrap.min.css';
// axios.interceptors.request.use((req) => {
//   if (localStorage.getItem('authUser')) {
//     req.headers.Authorization = 'Bearer ' + JSON.parse(localStorage.getItem('authUser')).token;
//   }
//   return req;
// })

ReactDOM.render(
  <Provider store={store}>
    <React.StrictMode>
      <App  />
    </React.StrictMode>
   </Provider >
  ,
  document.getElementById('root')
);

