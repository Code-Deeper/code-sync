import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import Room from './Components/Room/Room';
import HomePage from './Components/HomePage/HomePage';
import Editor from './Components/Editor/Editor';
import JoinRoom from './Components/Room/JoinRoom';
import CreateRoom from './Components/Room/CreateRoom';
import FrontPage from './Components/FrontPage/FrontPage';
import LoginPage from './Components/Auth/Login/LoginPage';
import Register from './Components/Auth/Register/Register';
import Cookies from 'universal-cookie';
import ProtectedRoute from './Protected'
const cookies = new Cookies();
const isAuthenticated = localStorage.getItem("authUser");
function App() {
  useEffect(() => {
    console.log({ cookies });
  })
  const [loginUser , setLoginUser] = useState(null)
  return (
    <Router >
      <Route path="/" component={FrontPage} exact />
      <Route path="/login" component={LoginPage} exact />
      <Route path="/register" component={Register} exact />

      <ProtectedRoute path='/room' component={HomePage} exact />
      <Route path='/room/:id' render={(props) => (isAuthenticated ? <Room {...props} /> : <Redirect to="/login" />)} exact />
      <ProtectedRoute path='/joinRoom' render={JoinRoom} exact />
      <Route path='/newRoom' render={(props) => isAuthenticated ? <CreateRoom {...props} /> : <Redirect to="/login" />} exact />
      <Route path='/editor' render={Editor} exact />
    </Router>
  );
}

export default App;
