import React, { useState } from "react";
import Bounce from "react-activity/dist/Bounce";
import "react-activity/dist/Bounce.css";
import Loader from "react-loader-advanced";
export default function Invite({
  showModal,
  setShowModal,
  emailTextPop,
  setEmailTextPop,
  sendInviteEmail,
  setLoader,
  loader,
}) {
    // backdrop-filter: blur(3px);
  return (
    <div>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none" style={{  backdropFilter : "blur(3px)"  }}>
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-lg shadow-lg relative bg-gray-50 flex flex-col w-full bg-white outline-none focus:outline-none">
                <Loader
                  show={loader}
                  message={
                    <div className="">
                      <Bounce size={40} />
                    </div>
                  }
                >
                  <div className="flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                    <h3 className="text-3xl font-semibold">Email Invitation</h3>
                    <button
                      className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                      onClick={() => setShowModal(false)}
                    >
                      <span className="bg-transparent text-black opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                        ×
                      </span>
                    </button>
                  </div>

                  <div className="relative p-6 flex-auto ml-6 mr-4">
                    <h3 className="text-lg	 font-semibold ">
                      Please Enter Email
                    </h3>
                    <input
                      value={emailTextPop}
                      onChange={(e) => setEmailTextPop(e.target.value)}
                      className="my-4 rounded-md	pl-2 text-blueGray-500 text-lg leading-relaxed"
                      placeholder="Enter Invite Email"
                    ></input>
                  </div>

                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      Close
                    </button>
                    <button
                      className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => {
                        setLoader(true);
                        // setInviteLoader(true);
                        sendInviteEmail();
                      }}
                    >
                      Invite
                    </button>
                  </div>
                </Loader>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
}
