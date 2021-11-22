import React, { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Avatar } from "@mui/material";
const Slider = ({  sliderOpen, setSliderOpen, activeUserInRoom}) => {
    return (
        <div>
            <Transition.Root show={sliderOpen} as={Fragment}>
                <Dialog as="div" className="fixed inset-0 overflow-hidden" onClose={setSliderOpen}>
                    <div className="absolute inset-0 overflow-hidden">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-in-out duration-500"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in-out duration-500"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <Dialog.Overlay className="absolute inset-0 bg-gray-200 bg-opacity-75 transition-opacity" />
                        </Transition.Child>
                        <div className="fixed inset-y-0 right-0  pl-10 max-w-full flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <div className="relative w-screen max-w-md bg-gray-100">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-500"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-500"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute top-0 left-0 -ml-8 pt-4 pr-2 flex sm:-ml-10 sm:pr-4">
                                            <button
                                                type="button"
                                                className="rounded-md text-gray-500 	 hover:text-white focus:outline-none focus:ring-2 focus:ring-grey-100"
                                                onClick={() => setSliderOpen(false)}
                                            >
                                                <span className="sr-only">Close panel</span>
                                                <img src='/image/icons/close.svg' alt='x' />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll items-center justify-center">
                                        <div className="px-4 sm:px-6">
                                            <Dialog.Title className="text-lg font-medium text-gray-900">🚀 Users In Room 🤘</Dialog.Title>
                                        </div>
                                        <div className="mt-2 relative flex-1 px-4 sm:px-6 overflow-y-scroll ">
                                            {activeUserInRoom && activeUserInRoom.map((user) =>
                                                <div className=" w-96	">
                                                    <div className='ml-2 mr-2 mt-6 rounded-lg bg-gray-900 text-gray-100 pt-2 pb-2 pl-4 	 flex w-full drop-shadow-md	'>
                                                        <Avatar className="  float-left" src={user?.userImg} name={user?.name} alt={user?.room || "codesync"}></Avatar>
                                                        <h2 className='ml-3 mt-1 text-lg'>{user.name}</h2>
                                                    </div>
                                                </div>
                                            
                                            )}
                                            
                                            
                                            
                                            
                                        </div>
                                    </div>
                                </div>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition.Root>
        </div>
    )
}

export default Slider
