import React from 'react'
import { BrowserRouter as Router, Route } from "react-router-dom";
import Room from './Components/Room/Room';
import HomePage from './Components/HomePage/HomePage';
import Editor from './Components/Editor/Editor';
function App() {
  return (
    <Router >
      <Route path='/' component={HomePage} exact />
      <Route path='/:id' render={(props)=>(<Room {...props} />)}  exact/>
      <Route path='/editor' render={Editor} exact/>
    </Router>
  );
}

export default App;
