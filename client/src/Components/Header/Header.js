import { Avatar } from "@mui/material";
// import React, { useState } from "react";
import React, { useEffect, useState } from "react";
import { Transition } from "@headlessui/react";
import { connect, useDispatch } from "react-redux";
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios'
import decode from 'jwt-decode'
import { Link, RouteComponentProps, withRouter, useHistory, useLocation } from 'react-router-dom'
import { removeUser } from "../../Action/UserAction";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AXIOS from "../../API";
// import './Header.css';

function Header(props) {
  const history = useHistory(props);
  const location = useLocation();
  const dispatch = useDispatch();
  const [roomId, setRoomId] = useState('');
  const [roomName, setRoomName] = useState('');
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
  }, [location])
  const [isOpen, setIsOpen] = useState(false);
  const CreatRoomHandler = async (e) => {
    e.preventDefault()
    const uID = await uuidv4();
    console.log({uID});
    AXIOS.post('/api/room', {
      room_id: uID,
      room_title: roomName || uID,
      room_body: "", room_language: "", room_input: ""
    }).then((res) => {
      console.log(res.data);
      history.push(`/room/${res?.data?.room_id}`)
      toast.success("Room Has been Created!");
    }).catch((err) => {
      alert('Room Not Created!! axaError!!!');
      console.log(err);
    })
  }
  return (
    <div>
      <div>
        <nav className="bg-gray-200	 border-opacity-60	border-black	">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-8 w-8"
                    src="https://tailwindui.com/img/logos/workflow-mark-indigo-500.svg"
                    alt="Workflow"
                  />
                </div>
                <div className="hidden md:block">
                  <div className="ml-10 flex items-baseline space-x-4">
                    <a
                      href="/room"
                      className="hover:no-underline hover:text-gray-200 hover:bg-indigo-500 text-black px-3 py-2 rounded-md text-base font-semibold	"
                    >
                      Home
                    </a>

                    <a
                      href="#newroom"
                      className="hover:no-underline hover:text-gray-200 hover:bg-indigo-500 text-black px-3 py-2 rounded-md text-base font-semibold	"
                    >
                      New Room
                    </a>
                    <a
                      href="#joinroom"
                      className="hover:no-underline hover:text-gray-200 hover:bg-indigo-500 text-black px-3 py-2 rounded-md text-base font-semibold	"
                    >
                      Join Room
                    </a>

                  </div>
                </div>
              </div>
              {/*  */}
              <div className="-mr-2 flex md:hidden">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  type="button"
                  className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-100 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
                  aria-controls="mobile-menu"
                  aria-expanded="false"
                >
                  <span className="sr-only">Open main menu</span>
                  {!isOpen ? (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="block h-6 w-6"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </button>
              </div>
              <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0">

                <Avatar src={user?.result?.imageUrl} name={user?.result?.name} alt={user?.result?.name || "codesync"}></Avatar>
                <button

                  className="ml-4 flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-100 bg-indigo-600 hover:bg-indigo-700"
                  onClick={logoutHandler}
                >
                  Log-out
                </button>
              </div>
            </div>
          </div>

          <Transition
            show={isOpen}
            enter="transition ease-out duration-100 transform"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="transition ease-in duration-75 transform"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {(ref) => (
              <div className="md:hidden" id="mobile-menu">
                <div ref={ref} className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                  {/* hover:no-underline hover:bg-blue-100 text-black px-3 py-2 rounded-md text-base font-semibold */}
                  <a
                    href="/room"
                    className="hover:no-underline hover:text-gray-200 hover:bg-indigo-500 text-black block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Home
                  </a>

                  <a
                    href="/newroom"
                    className="hover:no-underline hover:text-gray-200 hover:bg-indigo-500 text-black block px-3 py-2 rounded-md text-base font-medium"
                  >
                    New Room
                  </a>
                  <a
                    href="/joinroom"
                    className="hover:no-underline hover:text-gray-200 hover:bg-indigo-500 text-black block px-3 py-2 rounded-md text-base font-medium"
                  >
                    Join Room
                  </a>
                </div>
                <div>
                  <button

                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-gray-100 bg-indigo-600 hover:bg-indigo-700"
                    onClick={logoutHandler}
                  >
                    LogOut
                  </button>

                </div>
              </div>
            )}
          </Transition>
        </nav>
        <div className='component-of-room-page' style={{height: "100vh" , 
    background: `url('/image/email-pattern.png')`}} >
          {/* <img src= /> */}
          <div>
            <section
              className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-gray-400 h-96 w-80 rounded-2xl rotate-3 top-1/2 left-1/2"
              style={{ marginLeft: "-20%" }}
            >
            </section>
            <section
              style={{ marginLeft: "-20%" }}
              className="absolute p-6 space-y-6 duration-300 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 h-96 w-80 rounded-2xl rotate-3 hover:rotate-0 top-1/2 left-1/2">
              <div className="flex justify-end">
                <div className="w-4 h-4 bg-gray-900 rounded-full"></div>
              </div>

              <header className="text-xl font-extrabold text-center text-gray-600">🚀 Let's Rock 🚀</header>

              <div  >
                <p className="text-4xl font-extrabold text-center text-gray-900">Create Your Room </p>
                {/* <p className="text-2xl font-extrabold text-center" style={{ color: "FE5401" }} >2 hours</p> */}
              </div>
              <footer className="flex justify-center">
                <form onSubmit={CreatRoomHandler} >
                  <div className='ml-4 mr-4'>
                    <input
                      type="search"
                      value={roomName}
                      onChange={(e) => setRoomName(e.target.value)}
                      className="mb-2 pl-4 appearance-none bg-transparent border-none rounded-full w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="text" placeholder="Enter Room Name" aria-label="Room Name"></input>
                  </div>
                  <div className="flex justify-center mt-3">
                    <button
                      // href='/newRoom'
                      className="flex justify-center bg-indigo-600 flex items-center px-4 py-3 text-xl font-bold text-gray-100 rounded-xl"

                    >
                      <p>Create</p>
                      <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clip-rule="evenodd"></path>
                      </svg>
                    </button>
                  </div>
                </form>
              </footer>
            </section>
          </div>
          <div className="ml-12">
            <section
              style={{ marginLeft: "20%" }}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 bg-gray-400 h-96 w-80 rounded-2xl rotate-3 top-1/2 left-1/2">
            </section>
            <section
              style={{ marginLeft: "20%" }}
              className="absolute p-6 space-y-6 duration-300 transform -translate-x-1/2 -translate-y-1/2 bg-gray-200 h-96 w-80 rounded-2xl rotate-3 hover:rotate-0 top-1/2 left-1/2">
              <div className="flex justify-end">
                <div className="w-4 h-4 bg-gray-900 rounded-full"></div>
              </div>

              <header className="text-xl font-extrabold text-center text-gray-600">☎️ Calling You! ☎️</header>

              <div>
                <p className="text-4xl font-extrabold text-center text-gray-900">Join Room </p>

                {/* <p className="text-2xl font-extrabold text-center" style={{ color: "FE5401" }} >2 hours</p> */}
              </div>
              <form onSubmit={submitHandler}>
                <div className='ml-4 mr-4'>
                  <input
                    type="search"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="mt-2 mb-2 pl-4 appearance-none bg-transparent border-none rounded-full w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none" type="link" placeholder="Enter Room Link" aria-label="Full name"></input>
                </div>
                <footer className="flex justify-center">
                  <button
                    onClick={submitHandler}
                    className="bg-indigo-600 flex items-center px-4 py-3 text-xl font-bold text-gray-100 rounded-xl mt-3">
                    <p >Join</p>

                    <svg className="w-9 h-9" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </footer>
              </form>
            </section>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}


const mapStateToProps = state => ({
  authUser: state.user.data
})

export default connect(mapStateToProps)(Header)

