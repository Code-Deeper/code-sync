import React, { useState, useEffect } from "react";
import { Avatar } from "@mui/material";
import { connect } from "react-redux";
import axios from "axios";
import Editor from "../Editor/Editor";
import socket from "../socket.io";
import _, { debounce } from "lodash";
import { BaseURL } from "../../BaseURL";
import { VscLink } from "react-icons/vsc";
import { MdRecordVoiceOver, MdVoiceOverOff } from "react-icons/md";
import { BsFillMicFill, BsFillMicMuteFill } from "react-icons/bs";
import Peer from "peerjs";
import { decode as base64_decode, encode as base64_encode } from "base-64";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./Room.css";
import Whiteboard from "../WhiteBoard/Whiteboard";
import { EditorState, convertFromRaw, convertToRaw } from 'draft-js'
import Draft from './RichEditor/Draft'
import faCode from "@fortawesome/fontawesome-free"
import AXIOS from "../../API";
var myPeer = Peer;
var audios = {};
var peers = {};
var myAudio = MediaStream | null;


function Room(props) {
  const languageToEditorMode = {
    c: "c_cpp",
    cpp: "c_cpp",
    python: "python",
    java: "java",
    javascript: "javascript",
  };
  const languages = Object.keys(languageToEditorMode);
  const themes = [
    "monokai",
    "github",
    "solarized_dark",
    "dracula",
    "eclipse",
    "tomorrow_night",
    "tomorrow_night_blue",
    "xcode",
    "ambiance",
    "solarized_light",
  ];
  const fontSizes = [
    "8",
    "10",
    "12",
    "14",
    "16",
    "18",
    "20",
    "22",
    "24",
    "26",
    "28",
    "30",
    "32",
  ];

  const [roomTitle, setRoomTitle] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomBody, setRoomBody] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('authUser')))
  const [language, setLanguage] = useState(
    localStorage.getItem("language") ?? "c"
  );
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") ?? "monokai"
  );
  const [fontSize, setFontSize] = useState(12);
  const idealState = "Idle";
  const runningState = "running";
  const completedState = "completed";
  const errorState = "Some error occured";

  const [submissionState, setSubmissionState] = useState(idealState);
  const [submissionId, setSubmissionId] = useState("");
  const [submissionIdChecker, setSubmissionIdChecker] = useState(null);
  const [inAudio, setInAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Draft
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty())





  // const [token , setToken] = useState(null)
  // const API_KEY = "guest";

  const SOCKET_SPEED = 100;
  const JAUDGE_API_KEY = process.env.REACT_APP_JAUDGE_API_KEY;
  const JAUDGE_HOST_LINK = process.env.REACT_APP_JAUDGE_LINK_HOST;
  const JAUDGE_API_URL = process.env.REACT_APP_API_URL;
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);
  // Once room will be created then this effect will triggered when ever props id changed
  // Props id means router id example /room/:id
  useEffect(() => {
    console.log(editorState);
  }, [editorState])
  useEffect(() => {
    socket.on("updateBody", (roomBody) => {
      console.log("we", roomBody);
      setRoomBody(roomBody);
    });
    socket.on("updateInput", (input) => {
      setInput(input);
    });
    socket.on("updateLanguage", (language) => {
      console.log("FL", language);
      setLanguage(language);
    });
    socket.on("updateOutput", (output) => {
      setOutput(output);
    });
    socket.on("updateRichText", (storeRaw) => {
      if (storeRaw) {
        const rawContentFromStore = convertFromRaw(JSON.parse(storeRaw));
        setEditorState(EditorState.createWithContent(rawContentFromStore));
      }
    });

    const { id } = props.match.params;
    setRoomId(id);
    socket.emit("joinroom", id);

    const url = `/api/room/${id}`;
    const fetchData = async () => {
      const { data } = await AXIOS.get(url, {
        headers: {
          Authorization:
            "Bearer " + JSON.parse(localStorage.getItem("authUser")),
        },
      });
      const { room_title, room_body, room_language, room_input } = data;
      setRoomTitle(room_title);
      setInput(room_input);

      // @edge case for value empty
      if (language) setLanguage(room_language);
      if (room_body) setRoomBody(room_body);

      // console.log('Room Data '+ data.room_body);
    };
    fetchData();

    return () => {
      console.log("called");
      socket.off("updateBody", (roomBody) => {
        console.log(roomBody);
        setRoomBody(roomBody);
      });
      socket.off("updateInput", (input) => {
        setInput(input.value);
      });
      socket.off("updateLanguage", (language) => {
        setLanguage(language.value);
      });
      socket.off("updateOutput", (output) => {
        setOutput(output.value);
      });

      if (myPeer) {
        socket.emit("leaveAudioRoom", myPeer.id);
        destroyConnection();
      }
      myAudio = null;
    };
  }, [props]);

  useEffect(() => {
    setInAudio(false);
  }, [roomId]);

  const GiveMeLanguageCode = () => {
    switch (language) {
      case "c":
        return 49;
        break;
      case "cpp":
        return 53;
        break;
      case "python":
        return 71;
        break;
      case "java":
        return 62;
        break;
      case "javascript":
        return 63;
        break;
    }
  };

  const submitHandler = () => {
    if (submissionState === runningState) return;
    setSubmissionState(runningState);

    axios
      .patch(`/api/room/${roomId}`, {
        room_id: roomId,
        room_body: roomBody,
        room_title: roomTitle,
        room_input: input,
        room_language: language,
      })
      .then((res) => {
        // TODO:
        // console.log({ res });
        const { data } = res;
        setRoomTitle(data.room_title);
        setRoomBody(data.room_body);
        setInput(data.room_input);
        setLanguage(data.room_language);
      })
      .catch((err) => {
        console.log("handler error");
        setSubmissionState(errorState);
        return;
      });
    let language_code = parseInt(GiveMeLanguageCode(language));
    console.log("lag", language_code, language);
    const encode_input = base64_encode(input);
    const encode_body = base64_encode(roomBody);
    var options = {
      method: "POST",
      url: `${JAUDGE_API_URL}/submissions`,
      params: { base64_encoded: "true", wait: "false", fields: "*" },
      headers: {
        "content-type": "application/json",
        "x-rapidapi-host": JAUDGE_HOST_LINK,
        "x-rapidapi-key": JAUDGE_API_KEY,
      },
      data: {
        language_id: language_code,
        source_code: encode_body,
        stdin: encode_input,
      },
    };
    axios
      .request(options)
      .then(function (response) {
        console.log("res", response.data);
        let token = response.data.token;
        console.log("url", `${JAUDGE_API_URL}/submissions/${token}`);
        setTimeout(() => {
          const ipString = `${JAUDGE_API_URL}/submissions/${token}`.toString();
          var ip = {
            method: "GET",
            url: ipString,
            params: { base64_encoded: "true", fields: "*" },
            headers: {
              "x-rapidapi-host": JAUDGE_HOST_LINK,
              "x-rapidapi-key": JAUDGE_API_KEY,
            },
          };
          axios
            .request(ip)
            .then(function (res) {
              console.log(res.data);
              if (res.data.status.description == "Accepted") {
                let decoded = base64_decode(res.data.stdout);
                console.log("decoded", decoded);
                socket.emit("updateOutput", { value: decoded, roomId: roomId });
                setOutput(decoded);
              } else {
                let decoded = base64_decode(res.data.compile_output);
                console.log("decoded", decoded);
                socket.emit("updateOutput", { value: decoded, roomId: roomId });
                setOutput(decoded);
              }
              setSubmissionState("DONE");
            })
            .catch(function (err) {
              console.error(err);
              setSubmissionState(err);
            });
        }, 5000);
      })
      .catch(function (error) {
        console.error(error);
        setSubmissionState(error);
      });
  };

  const handleUpdateBody = (value) => {
    setRoomBody(value);
    debounce(
      () => socket.emit("updateBody", { value, roomId }),
      SOCKET_SPEED
    )();
  };
  // Draft
  const onEditorStateChange = (editorState) => {

    setEditorState(editorState)
    var contentRaw = convertToRaw(editorState.getCurrentContent());
    console.log(contentRaw)

    debounce(
      () => socket.emit("updateRichText", { value: JSON.stringify(contentRaw), roomId }),
      SOCKET_SPEED
    )();

    // debounce(
    //   () => socket.emit("updateRichText", { value: JSON.stringify(editorState) , roomId }),
    //   SOCKET_SPEED
    // )();
  };

  const handleUpdateInput = (value) => {
    setInput(value);
    debounce(
      () => socket.emit("updateInput", { value, roomId }),
      SOCKET_SPEED
    )();
  };
  const HandleUpdateOutput = (value) => {
    setOutput(value);
    debounce(
      () => socket.emit("updateOutput", { value, roomId }),
      SOCKET_SPEED
    )();
  };
  const getAudioStream = () => {
    const myNavigator =
      navigator.mediaDevices.getUserMedia ||
      navigator.mediaDevices.webkitGetUserMedia ||
      navigator.mediaDevices.mozGetUserMedia ||
      navigator.mediaDevices.msGetUserMedia;
    return myNavigator({ audio: true });
  };

  const createAudio = (data) => {
    const { id, stream } = data;
    if (!audios[id]) {
      const audio = document.createElement("audio");
      audio.id = id;
      audio.srcObject = stream;
      if (myPeer && id == myPeer.id) {
        myAudio = stream;
        audio.muted = true;
      }
      audio.autoplay = true;
      audios[id] = data;
    }
    
  };

  const removeAudio = (id) => {
    console.log({id});
    delete audios[id];
    const audio = document.getElementById(id);
    if (audio) audio.remove();
  };

  const destroyConnection = () => {
    console.log("distroying", audios, myPeer.id);
    if (inAudio) {
      setInAudio(!inAudio)
    }
    if (audios[myPeer.id]) {
      const myMediaTracks = audios[myPeer.id].stream.getTracks();
      myMediaTracks.forEach((track) => {
        track.stop();
      });
    }
    // if (myPeer) myPeer.destroy();
    console.log("distroyed", audios, myPeer.id);
  };

  const setPeersListeners = (stream) => {
    myPeer.on("call", (call) => {
      call.answer(stream);
      call.on("stream", (userAudioStream) => {
        createAudio({ id: call.metadata.id, stream: userAudioStream });
      });
      call.on("close", () => {
        removeAudio(call.metadata.id);
      });
      call.on("error", () => {
        console.log("peer error");
        if (!myPeer.destroyed) removeAudio(call.metadata.id);
      });
      peers[call.metadata.id] = call;
    });
  };

  const newUserConnection = (stream) => {
    socket.on("userJoinedAudio", (userId) => {
      const call = myPeer.call(userId, stream, { metadata: { id: myPeer.id } });
      call.on("stream", (userAudioStream) => {
        createAudio({ id: userId, stream: userAudioStream });
      });
      call.on("close", () => {
        removeAudio(userId);
      });
      call.on("error", () => {
        console.log("peer error");
        if (!myPeer.destroyed) removeAudio(userId);
      });
      peers[userId] = call;
    });
  };

  useEffect(() => {
    if (inAudio) {
      myPeer = new Peer();
      myPeer.on("open", (userId) => {
        console.log("opened");
        getAudioStream().then((stream) => {
          socket.emit("joinAudioRoom", roomId, userId);
          stream.getAudioTracks()[0].enabled = !isMuted;
          newUserConnection(stream);
          setPeersListeners(stream);
          createAudio({ id: myPeer.id, stream });
        });
      });
      myPeer.on("error", (err) => {
        console.log("peerjs error: ", err);
        if (!myPeer.destroyed) myPeer.reconnect();
      });
      socket.on("userLeftAudio", (userId) => {
        console.log("user left aiudio:", userId);
        if (peers[userId]) peers[userId].close();
        removeAudio(userId);
      });
    } else {
      console.log("leaving", myPeer);
      if (myPeer) {
        socket.emit("leaveAudioRoom", myPeer.id);
        destroyConnection();
      }
      myAudio = null;
    }
  }, [inAudio]);

  useEffect(() => {
    if (inAudio) {
      if (myAudio) {
        myAudio.getAudioTracks()[0].enabled = !isMuted;
      }
    }
  }, [isMuted]);

  const handleLanguage = (event) => {
    event.preventDefault();
    setLanguage(event.target.value);
    toast.success(`✨ Language changed to ${event.target.value} ✨`)
    debounce(
      () =>
        socket.emit("updateLanguage", { value: event.target.value, roomId }),
      SOCKET_SPEED
    )();
  };
  // const
  useEffect(() => {
    console.log(language);
  }, [language]);
  return (
    <>
      <div style={{ margin: 0, height: "100%", overflow: "hidden" }}>
        {/* className=" row container-fluid text-center justify-content-center" */}
        <div className=" flex flex-row justify-content-center">
          {/* <div className="ml-2 mt-3">
            <div className="relative inline-flex">
              <svg class="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 412 232"><path d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z" fill="#648299" fill-rule="nonzero" /></svg>

              <select
                className="border border-gray-300 rounded-full text-gray-600 h-10 pl-5 pr-10 bg-gray-100 hover:border-gray-400 focus:outline-none appearance-none"
                defaultValue={language}
                onChange={handleLanguage}
              >
                {languages.map((lang, index) => {
                  return (
                    <option key={index} value={lang} selected={lang === language}>
                      {lang}
                    </option>
                  );
                })}
              </select>
            </div>
          </div> */}
          {/* <div className="ml-2 mt-3">
            <div className="relative inline-flex">
              <svg class="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 412 232"><path d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z" fill="#648299" fill-rule="nonzero" /></svg>

              <select
                className="border border-gray-300 rounded-full text-gray-600 h-10 pl-5 pr-10 bg-gray-100 hover:border-gray-400 focus:outline-none appearance-none"
                defaultValue={theme}
                onChange={(event) => {
                  setTheme(event.target.value)
                  toast.success(`🚀 Theme changed to ${event.target.value} 🚀`)
                }}
              >
                {themes.map((theme, index) => {
                  return (
                    <option key={index} value={theme}>
                      {theme}
                    </option>
                  );
                })}
              </select>
            </div>
          </div> */}
          {/* <div className="ml-2 mt-3">
            <div className="relative inline-flex">
              <svg class="w-2 h-2 absolute top-0 right-0 m-4 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 412 232"><path d="M206 171.144L42.678 7.822c-9.763-9.763-25.592-9.763-35.355 0-9.763 9.764-9.763 25.592 0 35.355l181 181c4.88 4.882 11.279 7.323 17.677 7.323s12.796-2.441 17.678-7.322l181-181c9.763-9.764 9.763-25.592 0-35.355-9.763-9.763-25.592-9.763-35.355 0L206 171.144z" fill="#648299" fill-rule="nonzero" /></svg>

              <select
                className="border border-gray-300 rounded-full text-gray-600 h-10 pl-5 pr-10 bg-gray-100 hover:border-gray-400 focus:outline-none appearance-none"
                defaultValue={fontSize}
                onChange={(event) => setFontSize(event.target.value)}
              >
                {fontSizes.map((fontSize, index) => {
                  return (
                    <option key={index} value={fontSize}>
                      {fontSize}
                    </option>
                  );
                })}
              </select>
            </div>
          </div> */}
          <div className="">
            <button className="flex bg-transparent hover:bg-gray-200 mt-1 text-white font-bold py-2 px-4   rounded-full border-solid border-2 border-gray-600">
              <svg width="22" height="22" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13 14.562C14.3906 14.562 15.75 14.1496 16.9062 13.3771C18.0625 12.6045 18.9636 11.5064 19.4958 10.2216C20.028 8.9369 20.1672 7.5232 19.8959 6.15932C19.6246 4.79544 18.955 3.54263 17.9717 2.55933C16.9884 1.57603 15.7356 0.906391 14.3717 0.635098C13.0078 0.363805 11.5941 0.503043 10.3094 1.0352C9.02461 1.56736 7.92651 2.46854 7.15394 3.62478C6.38136 4.78103 5.969 6.1404 5.969 7.531C5.96953 9.39557 6.71046 11.1836 8.02892 12.5021C9.34737 13.8205 11.1354 14.5615 13 14.562ZM19.25 16.125H16.56C15.4439 16.6397 14.2295 16.9062 13.0005 16.9062C11.7715 16.9062 10.5571 16.6397 9.441 16.125H6.75C5.0924 16.125 3.50269 16.7835 2.33058 17.9556C1.15848 19.1277 0.5 20.7174 0.5 22.375L0.5 23.156C0.5 23.7777 0.746956 24.3739 1.18654 24.8135C1.62613 25.253 2.22233 25.5 2.844 25.5H23.156C23.7777 25.5 24.3739 25.253 24.8135 24.8135C25.253 24.3739 25.5 23.7777 25.5 23.156V22.375C25.5 20.7174 24.8415 19.1277 23.6694 17.9556C22.4973 16.7835 20.9076 16.125 19.25 16.125Z" fill="black" />
              </svg>
              <span className='ml-1'>Join People </span>
            </button>
          </div>
          <div className=" ml-2">
            {/* <br /> */}
            {/* <button
            className="btn btn-primary"
            onClick={submitHandler}
            disabled={submissionState === runningState}
          >
            Save and Run
          </button> */}
            {!inAudio &&
              <button
                // className="btn btn-primary"
              className={"flex bg-transparent hover:bg-gray-200  text-white font-bold py-2 px-4   rounded-full border-solid border-2 border-gray-600 mt-1"}
                onClick={() => setInAudio(!inAudio)}
              >
                {/* {inAudio ? "Leave Audio" : "Join Audio"} Room */}
                {!inAudio && <span className='flex'><MdRecordVoiceOver style={{ width: "22px", height: "22px" }} /> Join Audio</span>}
              </button>
            }
          </div>
          {inAudio ? (
            <div className="ml-2 flex">
              <button
                // className="btn btn-primary"
                className={`${inAudio ? "bg-gray-300 hover:bg-gray-100" : "bg-gray-300 hover:bg-gray-100 "}text-white-100 font-bold py-2 px-4 rounded mt-3`}
                onClick={() => setInAudio(!inAudio)}
              >
                <span><svg width="22" height="22" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M24 2.47339e-06C19.2533 2.47339e-06 14.6131 1.40758 10.6663 4.04473C6.71954 6.68189 3.64341 10.4302 1.8269 14.8156C0.010399 19.201 -0.464881 24.0266 0.461164 28.6822C1.38721 33.3377 3.67299 37.6141 7.02945 40.9706C10.3859 44.327 14.6623 46.6128 19.3178 47.5388C23.9734 48.4649 28.799 47.9896 33.1844 46.1731C37.5698 44.3566 41.3181 41.2805 43.9553 37.3337C46.5924 33.3869 48 28.7468 48 24C48.0029 20.8475 47.3841 17.7253 46.179 14.8122C44.9739 11.8991 43.2062 9.25217 40.977 7.02299C38.7478 4.7938 36.101 3.02609 33.1878 1.821C30.2747 0.615912 27.1525 -0.00289133 24 2.47339e-06ZM36 32.616L32.616 36L24 27.384L15.384 36L12 32.616L20.616 24L12 15.384L15.384 12L24 20.616L32.616 12L36 15.384L27.384 24L36 32.616Z" fill="#FF7171" />
                </svg>
                </span>
              </button>
              <button
                className={`${isMuted ? "bg-red-600 hover:bg-red-300 " : "bg-gray-300 hover:bg-gray-100 "}text-white-100 font-bold py-2 px-4 rounded mt-3`}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <BsFillMicMuteFill style={{ width: "22px", height: "22px" }} /> : <BsFillMicFill style={{ width: "22px", height: "22px" }} />}
              </button>
            </div>
          ) : (
            <div className="form-group col" />
          )}
          <div className="hidden md:flex items-center justify-end md:flex-1 lg:w-0 ">
            <div className="mr-4">
              {/* <br /> */}
              <button
                className="flex bg-transparent hover:bg-gray-200  text-white font-bold py-2 px-4   rounded-full border-solid border-2 border-gray-600	 "
                onClick={() => {
                  navigator.clipboard.writeText(`${BaseURL}/room/${roomTitle}`);
                  toast.success(`🔥 Room Link has been Copied 🔥`)
                }}

              >
                <img style={{ width: "22px", height: "22px" }} src='/image/icons/copy.svg' />  <span style={{ marginLeft: "3px" }}>Room Link </span>
              </button>
            </div>
            <Avatar className="mt-2  float-left mr-4" src={user?.result?.imageUrl} name={user?.result?.name} alt={user?.result?.name || "codesync"}></Avatar>
          </div>
          {/* <div className="ml-3 mt-5">
            <label>Status: {submissionState}</label>
          </div> */}
          {/* <div className='mt-2 ml-2'>
            <svg width="33" height="38" viewBox="0 0 33 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.3132 13.721H0.750167V35.497C0.714209 35.9825 0.871368 36.4625 1.18747 36.8327C1.50357 37.203 1.95305 37.4334 2.43817 37.474H30.5632C31.0488 37.4334 31.4988 37.2025 31.815 36.8317C32.1312 36.4608 32.288 35.98 32.2512 35.494V2.50399C32.288 2.01817 32.1313 1.53749 31.8153 1.16664C31.4994 0.795787 31.0497 0.564801 30.5642 0.523987H12.0002V11.742C12.034 12.227 11.8763 12.706 11.5609 13.0761C11.2455 13.4461 10.7975 13.6777 10.3132 13.721V13.721ZM1.24217 9.18499L8.13317 1.10099C8.27868 0.922752 8.4616 0.778682 8.66897 0.678973C8.87634 0.579264 9.10309 0.526353 9.33317 0.523987H9.75017V11.082H0.750167V10.582C0.744312 10.0729 0.918573 9.57807 1.24217 9.18499V9.18499Z" fill="#CBCBCB" />
            </svg>
          </div>
          <div className="idesvg flex mt-3">
            <div className="copy-for-ide">
              <img src='/image/icons/copy.svg' style={{ color: "white", width: "22px", height: "22px" }} />
            </div>
            <div>
              <img src='/image/icons/download.svg' style={{ color: "white", width: "22px", height: "22px" }} />
            </div>
            <div>
              <img src='/image/icons/share.svg' style={{ color: "white", width: "22px", height: "22px" }} />
            </div>
          </div>
          <div className=' flex mt-3 svg-for-whiteboard-top'>
            
            <div class="pen">
            <svg width="22" height="22" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M14.6401 5.13397L20.8581 11.352L7.35807 24.852L1.81407 25.464C1.64038 25.4832 1.4646 25.4631 1.29973 25.4052C1.13485 25.3473 0.985096 25.2531 0.861533 25.1295C0.73797 25.006 0.64376 24.8562 0.585867 24.6913C0.527975 24.5264 0.507882 24.3507 0.527073 24.177L1.14407 18.63L14.6441 5.12997L14.6401 5.13397ZM24.7041 4.20497L21.7841 1.28897C21.5675 1.07212 21.3103 0.900086 21.0272 0.78271C20.744 0.665335 20.4406 0.604919 20.1341 0.604919C19.8276 0.604919 19.5241 0.665335 19.241 0.78271C18.9579 0.900086 18.7007 1.07212 18.4841 1.28897L15.7391 4.03497L21.9571 10.253L24.7041 7.50497C24.9209 7.28839 25.093 7.03118 25.2103 6.74806C25.3277 6.46494 25.3881 6.16146 25.3881 5.85497C25.3881 5.54849 25.3277 5.24501 25.2103 4.96189C25.093 4.67876 24.9209 4.42156 24.7041 4.20497Z" fill="black" />
              </svg>
            </div>
            <div
              className='chat'
            >
              <svg width="27" height="27" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.05003 0.0410156H39.628C40.771 0.0452516 41.8656 0.502664 42.6717 1.31291C43.4778 2.12316 43.9296 3.22007 43.928 4.36302L43.95 43.263L35.306 34.619H5.05003C3.9043 34.6156 2.80652 34.1587 1.99664 33.3483C1.18677 32.5378 0.730665 31.4397 0.728027 30.294V4.36302C0.731457 3.2178 1.18791 2.12048 1.9977 1.31069C2.80749 0.500898 3.90482 0.0444448 5.05003 0.0410156ZM35.303 15.168H9.37203V19.49H35.303V15.168ZM18.016 25.968H35.303V21.65H18.015L18.016 25.968ZM9.37203 13.007H35.303V8.68502H9.37203V13.007Z" fill="black" />
              </svg>

            </div>
            <div className='eraser'>
              <svg width="27" height="24" viewBox="0 0 27 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M26.0819 12.919C26.3103 12.6908 26.4914 12.4197 26.615 12.1214C26.7386 11.8231 26.8023 11.5034 26.8023 11.1805C26.8023 10.8576 26.7386 10.5379 26.615 10.2396C26.4914 9.9413 26.3103 9.67027 26.0819 9.44201L17.8899 1.24801C17.6616 1.01964 17.3906 0.838472 17.0923 0.71487C16.794 0.591267 16.4743 0.527649 16.1514 0.527649C15.8285 0.527649 15.5088 0.591267 15.2105 0.71487C14.9122 0.838472 14.6412 1.01964 14.4129 1.24801L1.30191 14.359C1.07353 14.5873 0.892366 14.8583 0.768764 15.1566C0.645161 15.4549 0.581543 15.7746 0.581543 16.0975C0.581543 16.4204 0.645161 16.7401 0.768764 17.0384C0.892366 17.3367 1.07353 17.6077 1.30191 17.836L6.21891 22.753C6.6799 23.2139 7.30504 23.4729 7.95691 23.473H26.1889C26.352 23.473 26.5084 23.4082 26.6238 23.2929C26.7391 23.1775 26.8039 23.0211 26.8039 22.858V20.809C26.8039 20.6459 26.7391 20.4895 26.6238 20.3741C26.5084 20.2588 26.352 20.194 26.1889 20.194H18.8079L26.0819 12.919ZM10.5819 9.71201L17.6179 16.748L14.1709 20.195H8.29591L4.19591 16.095L10.5819 9.71201Z" fill="#CBCBCB" />
              </svg>

            </div>


          </div> */}

          {/* <div></div> */}
        </div>
        <hr className="mt-1" />
        <div className="grid grid-flow-row grid-cols-2 m0 room-body">
          <div className="">
            <div className="form-container">
              <div className="ide-container">
                <div className="center ide-low">
                  <div className="ide-header">
                    <h5 className=""><svg width="27" height="23" viewBox="0 0 27 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11.633 22.155L9.08899 21.417C9.02566 21.3988 8.96655 21.3683 8.91505 21.3272C8.86355 21.2862 8.82068 21.2353 8.7889 21.1776C8.75712 21.1199 8.73705 21.0565 8.72986 20.991C8.72267 20.9255 8.72849 20.8592 8.74699 20.796L14.439 1.186C14.4572 1.12267 14.4877 1.06356 14.5287 1.01206C14.5698 0.960562 14.6207 0.91769 14.6784 0.885909C14.7361 0.854128 14.7995 0.834065 14.865 0.826872C14.9305 0.819679 14.9968 0.825499 15.06 0.843997L17.602 1.582C17.6653 1.60016 17.7244 1.63067 17.7759 1.67175C17.8274 1.71284 17.8703 1.7637 17.9021 1.8214C17.9339 1.87911 17.9539 1.94253 17.9611 2.00802C17.9683 2.0735 17.9625 2.13977 17.944 2.203L12.254 21.813C12.2358 21.8763 12.2053 21.9354 12.1642 21.9869C12.1231 22.0384 12.0723 22.0813 12.0146 22.1131C11.9569 22.1449 11.8934 22.1649 11.828 22.1721C11.7625 22.1793 11.6962 22.1735 11.633 22.155ZM6.87799 17.475L8.69199 15.54C8.73799 15.4912 8.77372 15.4337 8.79703 15.3708C8.82035 15.3079 8.83077 15.241 8.82769 15.174C8.82462 15.107 8.80809 15.0413 8.77911 14.9809C8.75013 14.9204 8.70927 14.8664 8.65899 14.822L4.88099 11.499L8.65899 8.175C8.70912 8.13065 8.74985 8.07668 8.77874 8.0163C8.80763 7.95591 8.8241 7.89035 8.82718 7.82348C8.83026 7.75661 8.81988 7.68981 8.79665 7.62702C8.77343 7.56424 8.73784 7.50677 8.69199 7.458L6.87799 5.522C6.83292 5.47388 6.77879 5.43515 6.7187 5.40804C6.65861 5.38092 6.59375 5.36596 6.52785 5.36401C6.46196 5.36206 6.39633 5.37316 6.33474 5.39667C6.27315 5.42018 6.21682 5.45563 6.16899 5.501L0.159985 11.132C0.11003 11.1788 0.0702066 11.2353 0.0429815 11.2981C0.0157564 11.3609 0.00170898 11.4286 0.00170898 11.497C0.00170898 11.5654 0.0157564 11.6331 0.0429815 11.6959C0.0702066 11.7587 0.11003 11.8152 0.159985 11.862L6.16999 17.496C6.21782 17.5414 6.27415 17.5768 6.33574 17.6003C6.39733 17.6238 6.46296 17.6349 6.52885 17.633C6.59475 17.631 6.65961 17.6161 6.7197 17.589C6.77979 17.5618 6.83392 17.5231 6.87899 17.475H6.87799ZM20.524 17.5L26.534 11.866C26.5839 11.8192 26.6238 11.7627 26.651 11.6999C26.6782 11.6371 26.6923 11.5694 26.6923 11.501C26.6923 11.4326 26.6782 11.3649 26.651 11.3021C26.6238 11.2393 26.5839 11.1828 26.534 11.136L20.524 5.498C20.4268 5.40761 20.2979 5.35914 20.1652 5.36307C20.0325 5.367 19.9067 5.42301 19.815 5.519L18.002 7.454C17.9561 7.50277 17.9205 7.56024 17.8973 7.62302C17.8741 7.68581 17.8637 7.75261 17.8668 7.81948C17.8699 7.88635 17.8863 7.95192 17.9152 8.0123C17.9441 8.07268 17.9848 8.12665 18.035 8.171L21.813 11.499L18.034 14.822C17.9838 14.8663 17.9431 14.9203 17.9142 14.9807C17.8853 15.0411 17.8689 15.1066 17.8658 15.1735C17.8627 15.2404 17.8731 15.3072 17.8963 15.37C17.9195 15.4327 17.9551 15.4902 18.001 15.539L19.815 17.474C19.8596 17.5225 19.9135 17.5617 19.9733 17.5894C20.0332 17.617 20.098 17.6325 20.1639 17.635C20.2298 17.6376 20.2955 17.627 20.3573 17.604C20.4191 17.581 20.4758 17.546 20.524 17.501V17.5Z" fill="#EDEDED" />
                    </svg><span>Code Here</span></h5>
                    <div className="float-right">
                      <div className="ml-2 mt-2 inline-block">
                        <div className="relative inline-flex">
                          <svg class="ide-selectarrow pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="13.819" height="7.9" viewBox="0 0 13.819 7.9">
                            <path id="Icon_ionic-ios-arrow-back" data-name="Icon ionic-ios-arrow-back" d="M2.382,6.911,7.61,12.136a.988.988,0,1,1-1.4,1.395L.288,7.611A.986.986,0,0,1,.259,6.249L6.207.288a.988.988,0,0,1,1.4,1.395Z" transform="translate(0 7.9) rotate(-90)" fill="#828282" />
                          </svg>
                          {/* <label>Choose Language</label> */}
                          <select
                            className="ide-selectbox appearance-none"
                            defaultValue={language}
                            onChange={handleLanguage}
                          >
                            {languages.map((lang, index) => {
                              return (
                                <option key={index} value={lang}  selected={lang === language}>
                                  {lang}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="ml-2 mt-2 inline-block">
                        <div className="relative inline-flex">
                          <svg class="ide-selectarrow pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="13.819" height="7.9" viewBox="0 0 13.819 7.9">
                            <path id="Icon_ionic-ios-arrow-back" data-name="Icon ionic-ios-arrow-back" d="M2.382,6.911,7.61,12.136a.988.988,0,1,1-1.4,1.395L.288,7.611A.986.986,0,0,1,.259,6.249L6.207.288a.988.988,0,0,1,1.4,1.395Z" transform="translate(0 7.9) rotate(-90)" fill="#828282" />
                          </svg>

                          {/* <label>Choose Theme</label> */}
                          <select
                            className="ide-selectbox appearance-none"
                            defaultValue={theme}
                            onChange={(event) => {
                              setTheme(event.target.value)
                              toast.success(`🚀 Theme changed to ${event.target.value} 🚀`)
                            }}
                          >
                            {themes.map((theme, index) => {
                              return (
                                <option  key={index} value={theme}>
                                  {theme}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                      <div className="ml-2 mr-5 mt-2 inline-block">
                        {/* <label>Font Size</label> */}
                        <div className="relative inline-flex">
                          <svg class="ide-selectarrow pointer-events-none" xmlns="http://www.w3.org/2000/svg" width="13.819" height="7.9" viewBox="0 0 13.819 7.9">
                            <path id="Icon_ionic-ios-arrow-back" data-name="Icon ionic-ios-arrow-back" d="M2.382,6.911,7.61,12.136a.988.988,0,1,1-1.4,1.395L.288,7.611A.986.986,0,0,1,.259,6.249L6.207.288a.988.988,0,0,1,1.4,1.395Z" transform="translate(0 7.9) rotate(-90)" fill="#828282" />
                          </svg>

                          <select
                            className="ide-selectbox appearance-none"
                            defaultValue={fontSize}
                            onChange={(event) => setFontSize(event.target.value)}
                          >
                            {fontSizes.map((fontSize, index) => {
                              return (
                                <option key={index} value={fontSize}>
                                  {fontSize}
                                </option>
                              );
                            })}
                          </select>
                        </div>
                      </div>
                    </div>


                    {/* <button
                      className="btn btn-primary btn-save-run"
                      onClick={submitHandler}
                      disabled={submissionState === runningState}
                    >
                      Save and Run
                    </button>
                    <button
                      className="btn btn-secondary btn-copy"
                      onClick={() => {
                        navigator.clipboard.writeText(roomBody);
                      }}
                    >
                      Copy Code
                    </button> */}
                  </div>
                  {/* {console.log("language" + languageToEditorMode[language])} */}
                  {/* {console.log('room body is ' + output)} */}
                  <div className="ide-textarea">
                    <Editor
                      theme={theme}
                      language={languageToEditorMode[language]}
                      body={roomBody}
                      setBody={handleUpdateBody}
                      width={"100%"}
                      height={"54vh"}
                      fontSize={fontSize}
                    />
                    <div className="ide-bottom-left">
                      <ul>
                        <li>
                          <button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20.731" height="23.693" viewBox="0 0 20.731 23.693">
                              <path id="Icon_awesome-copy" data-name="Icon awesome-copy" d="M14.808,20.731v1.851A1.111,1.111,0,0,1,13.7,23.693H1.111A1.111,1.111,0,0,1,0,22.582V5.553A1.111,1.111,0,0,1,1.111,4.442H4.442v13.7a2.594,2.594,0,0,0,2.591,2.591Zm0-15.918V0H7.034A1.111,1.111,0,0,0,5.923,1.111V18.14A1.111,1.111,0,0,0,7.034,19.25H19.62a1.111,1.111,0,0,0,1.111-1.111V5.923H15.918A1.114,1.114,0,0,1,14.808,4.813Zm5.6-1.436L17.354.325A1.111,1.111,0,0,0,16.569,0h-.28V4.442h4.442v-.28a1.111,1.111,0,0,0-.325-.785Z" fill="#828282" />
                            </svg>
                          </button>
                        </li>
                        <li>
                          <button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="25.385" height="23.693" viewBox="0 0 25.385 23.693">
                              <path id="Icon_metro-download2" data-name="Icon metro-download2" d="M22.033,14.01l-6.769,6.769L8.494,14.01h4.231V3.856H17.8V14.01Zm-6.769,6.769H2.571v6.769H27.956V20.779Zm11,3.385H22.879V22.472h3.385Z" transform="translate(-2.571 -3.856)" fill="#828282" />
                            </svg>
                          </button>
                        </li>
                        <li>
                          <button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="17.769" height="19.665" viewBox="0 0 17.769 19.665">
                              <path id="Icon_material-share" data-name="Icon material-share" d="M19.308,16.9a2.875,2.875,0,0,0-1.935.76l-7.039-4.1a2.732,2.732,0,0,0,0-1.382l6.96-4.057a2.955,2.955,0,1,0-.948-2.162,3.232,3.232,0,0,0,.089.691L9.475,10.71a2.962,2.962,0,1,0,0,4.324L16.5,19.141a2.785,2.785,0,0,0-.079.642A2.883,2.883,0,1,0,19.308,16.9Z" transform="translate(-4.5 -3)" fill="#828282" />
                            </svg>
                          </button>
                        </li>
                      </ul>
                    </div>
                    <div className="ide-bottom-run">
                      <button
                        onClick={submitHandler}
                        disabled={submissionState === runningState}
                      >
                        Run
                      </button>
                    </div>
                  </div>


                  {/* <div className="text-ip-op">
                    <div className="grid grid-flow-row grid-cols-2 m0">
                      <div className="header-ip-op">
                        <h5 className="Input">Input</h5>
                      </div>
                      <div className="header-ip-op">
                        <h5 className="Output">Output</h5>
                      </div>  
                    </div>
                  </div> */}
                  <div className=" text-center ip-op-editor grid grid-flow-row grid-cols-2 m0">
                    {/* <h5>Input</h5> */}
                    <div className="ip-op-container">
                      <div className="header-ip-op">
                        <h5 className="Input">Input <svg width="22" height="22" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M21.0571 0.804993H2.6461C2.10395 0.806576 1.58446 1.02264 1.20111 1.406C0.817749 1.78936 0.601681 2.30885 0.600098 2.85099V6.93199H2.6461V2.82999H21.0571V17.18H2.6461V13.069H0.600098V17.169C0.601276 17.4364 0.655155 17.7009 0.758651 17.9474C0.862148 18.1939 1.01323 18.4176 1.20326 18.6057C1.39329 18.7938 1.61853 18.9425 1.86611 19.0435C2.11369 19.1444 2.37874 19.1956 2.6461 19.194H21.0571C21.5964 19.1964 22.1145 18.9845 22.4976 18.605C22.8808 18.2254 23.0975 17.7093 23.1001 17.17V2.85099C23.1002 2.58227 23.0474 2.31616 22.9446 2.06787C22.8418 1.81958 22.6911 1.59397 22.5011 1.40396C22.3111 1.21394 22.0855 1.06324 21.8372 0.960468C21.5889 0.857693 21.3228 0.804861 21.0541 0.804993H21.0571ZM10.8281 14.09L14.9201 9.99999L10.8281 5.90899V8.97699H0.600098V11.023H10.8281V14.09Z" fill="#EDEDED" />
                        </svg></h5>
                      </div>
                      <Editor
                        className="editor-1"
                        theme={theme}
                        language={""}
                        body={input}
                        setBody={handleUpdateInput}
                        fontSize={fontSize}
                      />
                    </div>
                    <div className="ip-op-container">
                      {/* <h5>Output</h5> */}
                      {console.log(output)}
                      <div className="header-ip-op">
                        <h5 className="Output">Output<svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10.9101 15.85V13.668L2.18205 13.668L2.18205 2.75798L10.9101 2.75798V0.575975L5.53131e-05 0.575975L5.53131e-05 15.85L10.9101 15.85ZM13.0921 11.486L17.4561 8.21298L13.0921 4.93998L13.0921 7.12198L4.36405 7.12198L4.36405 9.30398L13.0921 9.30398V11.486Z" fill="#EDEDED" />
                        </svg></h5>
                      </div>
                      <Editor
                        className="editor-2"
                        theme={theme}
                        language={""}
                        body={output}
                        setBody={HandleUpdateOutput}
                        readOnly={true}
                        fontSize={fontSize}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
          <div className="">
            <div className="wt-board">
              <Whiteboard
                editorState={editorState}
                setEditorState={setEditorState}
                onEditorStateChange={onEditorStateChange} />
            </div>
          </div>
          {/* <div className="mt-5 ml-5 mr-5 h-32	">
            <Draft
              editorState={editorState}
              setEditorState={setEditorState}
              onEditorStateChange={onEditorStateChange} />
          </div> */}
        </div>

      </div>
      <ToastContainer />
    </>
  );
}

export default Room;
