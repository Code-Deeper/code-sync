import React from 'react'
import Iframe from 'react-iframe'

import './Landing.css'
function LandingPage() {
    return (
        <>
            <div className="max-w-7xl mx-auto my-48">
                <div className="home-div-con ">
                    <div className="home-child-1">
                        <div>
                            <div className="con-home-l">
                                <h1 >Start Writing Your <br /> Best Code.</h1>
                                <div className='home-cont-text'>Crafting Your Code, Dry Run, Talk To Friends, Chat With Friend, Keep a notes of code & Many More!</div>
                                <div className='mt-5'><a className=" bg-indigo-600 bt-home-screeninline-flex items-center justify-center w-full px-6 py-3  font-bold leading-6 text-white bg-indigo-600 border border-transparent md:w-auto hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 text-gray-100 rounded-xl" href="/room" type="button">Explore Now</a></div>
                            </div>
                            <div></div>
                            {/* rgba(243, 244, 246,1) */}
                            {/* <div class="w-full  pb-12 antialiased bg-white mt-32	">
                            <div class=" max-w-7xl">
                                <div class="container max-w-lg  py-32 text-left md:max-w-none md:text-center">
                                    <h1 class="text-5xl font-extrabold leading-10 tracking-tight text-left text-gray-900 md:text-center sm:leading-none md:text-6xl lg:text-7xl"><span class="inline md:block">Start Writing Your</span> <span class="relative mt-2 text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-indigo-500 md:inline-block">Best Code.</span></h1>
                                    <div class="mx-auto mt-5 text-gray-500 md:mt-12 md:max-w-lg md:text-center lg:text-lg">Crafting Your Code, Dry Run, Talk To Friends, Chat With Friend, Keep a notes of code & Many More!</div>
                                    <div class="flex flex-col items-center mt-12 text-center">
                                        <span class="relative inline-flex w-full md:w-auto">
                                            <a href="/room" type="button" class="inline-flex items-center justify-center w-full px-8 py-4  font-bold leading-6 text-white bg-indigo-600 border border-transparent md:w-auto hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 text-gray-100 rounded-2xl">
                                                Explore Now
                                            </a>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        </div>

                    </div>
                    <div className="home-child-2"><img src='/image/Logos/codesync-01.png' /></div>
                </div>
            </div>
            {/* <div class="w-full px-6 pb-12 antialiased bg-white mt-32	">
                <div class="mx-auto max-w-7xl">
                    <div class="container max-w-lg px-4 py-32 mx-auto text-left md:max-w-none md:text-center">
                        <h1 class="text-5xl font-extrabold leading-10 tracking-tight text-left text-gray-900 md:text-center sm:leading-none md:text-6xl lg:text-7xl"><span class="inline md:block">Start Writing Your</span> <span class="relative mt-2 text-transparent bg-clip-text bg-gradient-to-br from-indigo-600 to-indigo-500 md:inline-block">Best Code.</span></h1>
                        <div class="mx-auto mt-5 text-gray-500 md:mt-12 md:max-w-lg md:text-center lg:text-lg">Crafting Your Code, Dry Run, Talk To Friends, Chat With Friend, Keep a notes of code & Many More!</div>
                        <div class="flex flex-col items-center mt-12 text-center">
                            <span class="relative inline-flex w-full md:w-auto">
                                <a href="/room" type="button" class="inline-flex items-center justify-center w-full px-8 py-4  font-bold leading-6 text-white bg-indigo-600 border border-transparent md:w-auto hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 text-gray-100 rounded-2xl">
                                    Explore Now
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </div> */}

            <div class="py-20 bg-white">
                <div class="container max-w-6xl mx-auto">
                    <h2 class="text-4xl font-bold tracking-tight text-center">Our Features</h2>
                    <p class="mt-2 text-lg text-center text-gray-600">Check out our list of awesome features below.</p>
                    <div class="grid grid-cols-4 gap-8 mt-10 sm:grid-cols-8 lg:grid-cols-12 sm:px-8 xl:px-0">
                        <div class="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 rounded-2xl">
                            <div class="p-3 text-white bg-indigo-400 rounded-2xl">
                                <img src='/image/icons/code-room.svg' style={{ width: "30px", height: "30px" }} />
                            </div>
                            <h4 class="text-xl font-medium text-gray-700">Code Editors</h4>
                            <p class="text-base text-center text-gray-500">Flexible and draggable code editors with multiple themes, Auto Suggest.</p>
                        </div>

                        <div class="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 rounded-2xl">
                            <div class="p-3 text-white bg-indigo-400 rounded-2xl">
                                <img src='/image/icons/microphone-voice.svg' style={{ width: "30px", height: "30px" }} />
                            </div>
                            <h4 class="text-xl font-medium text-gray-700">Voice Chat</h4>
                            <p class="text-base text-center text-gray-500">Voice chat between the room that help room member to keep them engaged.</p>
                        </div>
                        <div class="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 rounded-2xl">
                            <div class="p-3 pl-3 pr-2 text-white bg-indigo-400 rounded-2xl">
                                <img src='/image/icons/drawing-svgrepo.svg' style={{ width: "30px", height: "30px" }} />
                            </div>
                            <h4 class="text-xl font-medium text-gray-700">White Board</h4>
                            <p class="text-base text-center text-gray-500">White Board for visualizing and showcasing your thought to members.</p>
                        </div>
                        <div class="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 rounded-2xl">
                            <div class="p-3 text-white bg-indigo-400 rounded-2xl">
                                <img src='/image/icons/compiler.svg' style={{ width: "30px", height: "30px" }} />
                            </div>
                            <h4 class="text-xl font-medium text-gray-700">Compiler</h4>
                            <p class="text-base text-center text-gray-500">Compiler your code which written on code editor with input.</p>
                        </div>
                        <div class="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 rounded-2xl">
                            <div class="p-3 text-white bg-indigo-400 rounded-2xl">
                                <img src='/image/icons/notes.svg' style={{ width: "30px", height: "30px" }} />
                            </div>
                            <h4 class="text-xl font-medium text-gray-700">Note Book</h4>
                            <p class="text-base text-center text-gray-500">To keep write-down your thought and share among room member.</p>
                        </div>
                        <div class="flex flex-col items-center justify-between col-span-4 px-8 py-12 space-y-4 bg-gray-100 rounded-2xl">
                            <div class="p-3 text-white bg-indigo-400 rounded-2xl">
                                <img src='/image/icons/chat-22.svg' style={{ width: "30px", height: "30px" }} />
                            </div>
                            <h4 class="text-xl font-medium text-gray-700">Chat App</h4>
                            <p class="text-base text-center text-gray-500">Stay Updated with friends by writing piece of message :)</p>
                        </div>
                    </div>
                </div>
                <div className='container max-w-6xl mx-auto mt-72 center '>
                    <div>
                    <Iframe url="https://cards.producthunt.com/cards/posts/320629?v=1"
                        width="1150" height="850" frameborder="0" scrolling="no"
                        />
                    </div>

                </div>
            </div>

            <div class="text-gray-700 bg-white body-font mt-32">
                <div class="container flex flex-col items-center px-8 py-8 mx-auto max-w-7xl sm:flex-row">
                    <a href="#_" class="text-xl font-black leading-none text-gray-900 select-none logo">CodeSync<span class="text-indigo-600">.</span></a>
                    <p class="mt-4 text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l sm:border-gray-200 sm:mt-0">© 2021 CodeDeeper
                    </p>
                    <span class="inline-flex justify-center mt-4 space-x-5 sm:ml-auto sm:mt-0 sm:justify-start">
                        <a href="https://github.com/Code-Deeper" class="text-gray-400 hover:text-gray-500">
                            <span class="sr-only">GitHub</span>
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fill-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clip-rule="evenodd"></path>
                            </svg>
                        </a>
                        {/* <a href="https://app.grammarly.com/ddocs/1000211248" class="text-gray-400 hover:text-gray-500">
                            <span class="sr-only">Facebook</span>
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fill-rule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clip-rule="evenodd"></path>
                            </svg>
                        </a>

                        <a href="#" class="text-gray-400 hover:text-gray-500">
                            <span class="sr-only">Instagram</span>
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fill-rule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clip-rule="evenodd"></path>
                            </svg>
                        </a>

                        <a href="#" class="text-gray-400 hover:text-gray-500">
                            <span class="sr-only">Twitter</span>
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                            </svg>
                        </a> */}




                    </span>
                </div>
            </div>
            
        </>
    )
}

export default LandingPage
