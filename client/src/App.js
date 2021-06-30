import React from 'react'
import { BrowserRouter as Router, Route } from "react-router-dom";
import Room from './Components/Room/Room';
import HomePage from './Components/HomePage/HomePage';
import Editor from './Components/Editor/Editor';
import JoinRoom from './Components/Room/JoinRoom';
import CreateRoom from './Components/Room/CreateRoom';


function App() {
  return (
    <Router >
      <Route path='/' component={HomePage} exact />
      <Route path='/room/:id' render={(props) => (<Room {...props} />)} exact />
      <Route path='/joinRoom' render={JoinRoom} exact />

      <Route path='/newRoom' render={(props) => <CreateRoom {...props} />} exact />

      <Route path='/editor' render={Editor} exact />
    </Router>
  );
}

export default App;
