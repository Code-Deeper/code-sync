import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { connect , useDispatch } from "react-redux";
import decode from 'jwt-decode'
import { Link, RouteComponentProps, withRouter, useHistory ,useLocation} from 'react-router-dom'
import { removeUser } from "../../Action/UserAction";
function Header(props) {
  const history = useHistory(props);
  const location = useLocation();
  const dispatch = useDispatch();
  const [roomId, setRoomId] = useState('');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('authUser')) || props?.authUser || null);
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
  const logoutHandler = () => {
    dispatch(removeUser(null))
    setUser(null);
    history.push('/login');
  }
  useEffect(async () => {
    const token = user?.token;
    if (token) {
      const decodedToken = decode(token);
      if (decodedToken.exp * 1000 < new Date().getTime()) {
        await logoutHandler()
      }
    }
    setUser(JSON.parse(localStorage.getItem('authUser')) || props?.authUser || null)
  },[location])
  useEffect(() => {
    console.log(user);
  },[user])
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
        {user && <>
          <button className="btn btn-outline-success" type="submit"
            onClick={logoutHandler}
          >
            logout
          </button>
        </>}
        <div>
          {/* {console.log(props.authUser)} */}
          <Avatar src={user?.result?.imageUrl} alt={user?.result?.name || "codesync"}></Avatar>
        </div>
      </div>
    </nav>
  );
}


const mapStateToProps = state => ({
  authUser: state.user.data
})

export default connect(mapStateToProps)(Header)

