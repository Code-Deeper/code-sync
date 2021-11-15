import React, { useState } from 'react'
import { Avatar } from "@mui/material";
import './Message.css'
function Message({ openChat, setOpenChat, msgs, setMsg, msg, SendMessage, user, roomTitle }) {
    return (
        <>
            <div className={`fixed  bottom-0 right-0 flex flex-col items-end ml-6 w-full mb-4 ${!openChat && "chat-hide"} `} >
                <div className={`chat-modal ${openChat && "show"}   mr-5 flex flex-col mb-5 shadow-lg sm:w-1/2 md:w-1/3 lg:w-1/4`}>
                    <div className="close-chat bg-red-500 hover:bg-red-600 text-white mb-1 w-10 flex justify-center items-center px-2 py-1 rounded self-end cursor-pointer" onClick={() => setOpenChat(false)}>
                        <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-x" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" d="M11.854 4.146a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708-.708l7-7a.5.5 0 0 1 .708 0z" />
                            <path fill-rule="evenodd" d="M4.146 4.146a.5.5 0 0 0 0 .708l7 7a.5.5 0 0 0 .708-.708l-7-7a.5.5 0 0 0-.708 0z" />
                        </svg>
                    </div>
                    <div className="flex justify-between items-center text-white p-2 bg-green-500 border shadow-lg mr-5 w-full">
                        <div className="flex items-center">
                            <img src="https://f0.pngfuel.com/png/136/22/profile-icon-illustration-user-profile-computer-icons-girl-customer-avatar-png-clip-art-thumbnail.png" alt="picture" className="rounded-full w-8 h-8 mr-1" />
                            <h2 className="font-semibold tracking-wider">{roomTitle}</h2>
                        </div>
                        <div className="flex items-center justify-center">
                            <small className="mr-1">online</small>
                            <div className="rounded-full w-2 h-2 bg-white"></div>
                        </div>
                    </div>

                    <div className="flex flex-col bg-gray-200 px-2 chat-services expand overflow-auto" style={{ minHeight: "350px" }}>
                        {msgs.map((msg) => {
                            if (msg.user.toLowerCase() === user?.result?.familyName?.toLowerCase() || msg.user.toLowerCase() === user?.result?.name?.toLowerCase() ) {
                                return (

                                    <div className="message bg-green-200	 self-end text-white p-2  my-2 rounded-md shadow ml-3">
                                        {msg.text}
                                    </div>


                                )
                            } else if (msg.user.toLowerCase() === 'Admin') {
                                return (<div className="chat bg-gray-50 text-gray-700 p-2 self-center my-2 rounded-md shadow mr-3">
                                    {msg.text}
                                </div>
                                )
                            } else {
                                return (
                                    <div className='flex'>
                                        <Avatar className="mt-2  float-left mr-2" src={msg?.userImg} name={msg?.user} alt={"codesync"}></Avatar>
                                        <div className="chat bg-gray-50 text-gray-700 p-2 self-start my-2 rounded-md shadow mr-3">
                                            {msg.text}
                                        </div>
                                    </div>
                                )
                            }
                        })}
                    </div>

                    <form className="relative bg-white" >
                        <input type="text" name="message" placeholder="type your message!"
                            className="pl-4 pr-16 py-2 border border-green-500 focus:outline-none w-full"
                            value={msg} onChange={(e) => setMsg(e.target.value)}
                        />
                        <button
                            type="submit"
                            onClick={SendMessage}
                            className="absolute right-0 bottom-0 text-green-600 bg-white  hover:text-green-500 m-1 px-3 py-1 w-auto transistion-color duration-100 focus:outline-none">Send</button>
                    </form>
                </div>

            </div>
        </>
    )
}

export default Message
