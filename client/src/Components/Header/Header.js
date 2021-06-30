import React, { useState } from "react";
import { Link, RouteComponentProps, withRouter, useHistory } from 'react-router-dom'
function Header(props) {

  const [roomId, setRoomId] = useState('');

  const submitHandler = () => {
    // const {history} = props
    if (roomId) {
      console.log(roomId);
      props.history.push(`/room/${roomId}`)

    } else {
      alert('Please Enter Room Name');
      props.history.push('/');
    }
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          CodeSync
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/newRoom">
                New Room
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" aria-current="page" to="/joinRoom">
                Join Room
              </Link>
            </li>
          </ul>
          <form className="d-flex pull-right">
            <input
              className="form-control me-2 mr-2 mt-1 "
              type="search"
              placeholder="Room id"
              aria-label="Search"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
            {console.log(roomId)}
            <button className="btn btn-outline-success" type="submit"
              onClick={submitHandler}
            >
              Join
            </button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default withRouter(Header);
