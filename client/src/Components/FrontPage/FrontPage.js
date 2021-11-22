import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Avatar from 'react-avatar';
import { useHistory } from 'react-router-dom'
import { Transition } from "@headlessui/react";
import LandingPage from './LandingPage';

const submitHandler = (e) => {
    e.preventDefault()
}
function FrontPage(props) {
    const history = useHistory(props);
    useEffect(() => {

        const isAuthenticated = JSON.parse(localStorage.getItem('authUser'))?.token
        if (isAuthenticated) {
            history.push("/room");
            // window.location.reload();
        }
    }, [])

    const [isOpen, setIsOpen] = useState(false);


    return (
        <div>
            <nav className="bg-gray-200	 border-opacity-60	border-black	">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <img
                                    className="h-8 w-8"
                                    src="/image/Logos/xyz.png"
                                    alt="Workflow"
                                />
                            </div>
                            <div className="hidden md:block">
                                <div className="ml-10 flex items-baseline space-x-4">
                                    <a
                                        href="/"
                                        className="hover:no-underline hover:text-gray-200 hover:bg-indigo-500 text-black px-3 py-2 rounded-md text-base font-semibold	"
                                    >
                                        Home
                                    </a>

                                    <a
                                        href="/room"
                                        className="hover:no-underline hover:text-gray-200 hover:bg-indigo-500 text-black px-3 py-2 rounded-md text-base font-semibold	"
                                    >
                                        Room
                                    </a>
                                    <a
                                        href="/trial"
                                        className="hover:no-underline hover:text-gray-200 hover:bg-indigo-500 text-black px-3 py-2 rounded-md text-base font-semibold	"
                                    >
                                        Trial
                                    </a>

                                </div>
                            </div>
                        </div>
                        {/*  */}
                        <div className="-mr-2 flex md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                type="button"
                                className="bg-gray-900 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
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
                            <a href="/login" type='submit' className="hover:no-underline whitespace-nowrap text-base font-semibold text-gray-500 hover:text-gray-900 ">
                                Sign in
                            </a>
                            <a
                                href="/register"
                                type='submit'
                                className="hover:no-underline ml-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-semibold text-gray-100 bg-indigo-600 hover:text-gray-100 hover:bg-indigo-700"
                            >
                                Sign up
                            </a>
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
                                    href="/"
                                    className="hover:no-underline hover:text-gray-200 hover:bg-indigo-500 text-black block px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Home
                                </a>
                                <a
                                    href="/room"
                                    className="hover:no-underline hover:text-gray-200 hover:bg-indigo-500 text-black block px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Room
                                </a>
                                <a
                                    href="/trial"
                                    className="hover:no-underline hover:text-gray-200 hover:bg-indigo-500 text-black block px-3 py-2 rounded-md text-base font-medium"
                                >
                                    Trial
                                </a>
                                

                            </div>
                            <div>
                                <a
                                    href="/login"
                                    type='submit'
                                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                                >
                                    Sign up
                                </a>
                                <p className="mt-6 text-center text-base font-medium text-gray-500">
                                    Existing customer?{' '}
                                    <a href="/register"
                                        type="submit"
                                        className="text-indigo-600 hover:text-indigo-500">
                                        Sign in
                                    </a>
                                </p>
                            </div>
                        </div>
                    )}
                </Transition>
            </nav>
            <LandingPage />
        </div>
    )
}



const mapStateToProps = state => ({
    authUser: state.user
})

export default connect(mapStateToProps)(FrontPage)


