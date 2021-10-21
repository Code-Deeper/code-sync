import React, { useState, useEffect } from "react";
import axios from "axios";
import Editor from "../Editor/Editor";
import socket from '../socket.io'
import _, { debounce } from 'lodash';
import { BaseURL } from '../../BaseURL'
import Peer from 'peerjs';
import { decode as base64_decode, encode as base64_encode } from 'base-64';
import './Room.css';
import Whiteboard from "../WhiteBoard/Whiteboard";

var myPeer = Peer
var audios = {}
var peers = {}
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
    'monokai',
    'github',
    'solarized_dark',
    'dracula',
    'eclipse',
    'tomorrow_night',
    'tomorrow_night_blue',
    'xcode',
    'ambiance',
    'solarized_light'
  ];

  const [roomTitle, setRoomTitle] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomBody, setRoomBody] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState(localStorage.getItem('language') ?? 'c');
  const [theme, setTheme] = useState(localStorage.getItem('theme') ?? 'monokai');

  const idealState = "Idle";
  const runningState = "running";
  const completedState = "completed";
  const errorState = "Some error occured";

  const [submissionState, setSubmissionState] = useState(idealState);
  const [submissionId, setSubmissionId] = useState("");
  const [submissionIdChecker, setSubmissionIdChecker] = useState(null);
  const [inAudio, setInAudio] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  // const [token , setToken] = useState(null)
  // const API_KEY = "guest";

  const SOCKET_SPEED = 100;
  const JAUDGE_API_KEY = process.env.REACT_APP_JAUDGE_API_KEY;
  const JAUDGE_HOST_LINK = process.env.REACT_APP_JAUDGE_LINK_HOST;
  const JAUDGE_API_URL = process.env.REACT_APP_API_URL
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);
  // Once room will be created then this effect will triggered when ever props id changed
  // Props id means router id example /room/:id
  useEffect(() => {
    socket.on('updateBody', (roomBody) => {
      console.log("we", roomBody)
      setRoomBody(roomBody);
    });
    socket.on('updateInput', (input) => {
      setInput(input);
    });
    socket.on('updateLanguage', (language) => {
      console.log("FL", language);
      setLanguage(language);
    });
    socket.on('updateOutput', (output) => {
      setOutput(output);
    });

    const { id } = props.match.params;
    setRoomId(id);
    socket.emit('joinroom', id);



    const url = `/api/room/${id}`;
    const fetchData = async () => {
      const { data } = await axios.get(url, {
        headers: {
          Authorization: 'Bearer ' + JSON.parse(localStorage.getItem('authUser'))
        }
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
      console.log('called');
      socket.off('updateBody', (roomBody) => {
        console.log(roomBody)
        setRoomBody(roomBody);
      });
      socket.off('updateInput', (input) => {
        setInput(input.value);
      });
      socket.off('updateLanguage', (language) => {
        setLanguage(language.value);
      });
      socket.off('updateOutput', (output) => {
        setOutput(output.value);
      });
      if (myPeer) {
        socket.emit('leaveAudioRoom', myPeer.id);
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
      case "c": return 49; break;
      case "cpp": return 53; break;
      case "python": return 71; break;
      case "java": return 62; break;
      case "javascript": return 63; break;
    }
  }

  const submitHandler = () => {

    if (submissionState === runningState) return;
    setSubmissionState(runningState);

    axios.patch(`/api/room/${roomId}`, {
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
        setInput(data.room_input)
        setLanguage(data.room_language);
      })
      .catch((err) => {
        console.log("handler error");
        setSubmissionState(errorState);
        return;
      });
    let language_code = parseInt(GiveMeLanguageCode(language))
    console.log("lag", language_code, language);
    const encode_input = base64_encode(input)
    const encode_body = base64_encode(roomBody)
    var options = {
      method: 'POST',
      url: `${JAUDGE_API_URL}/submissions`,
      params: { base64_encoded: 'true', wait: 'false', fields: '*' },
      headers: {
        'content-type': 'application/json',
        'x-rapidapi-host': JAUDGE_HOST_LINK,
        'x-rapidapi-key': JAUDGE_API_KEY
      },
      data: {
        language_id: language_code,
        source_code: encode_body,
        stdin: encode_input
      }
    };
    axios.request(options).then(function (response) {
      console.log("res", response.data);
      let token = response.data.token
      console.log("url", `${JAUDGE_API_URL}/submissions/${token}`)
      setTimeout(() => {
        const ipString = `${JAUDGE_API_URL}/submissions/${token}`.toString();
        var ip = {
          method: 'GET',
          url: ipString,
          params: { base64_encoded: 'true', fields: '*' },
          headers: {
            'x-rapidapi-host': JAUDGE_HOST_LINK,
            'x-rapidapi-key': JAUDGE_API_KEY
          }
        };
        axios.request(ip).then(function (res) {
          console.log(res.data);
          if (res.data.status.description == "Accepted") {
            let decoded = base64_decode(res.data.stdout);
            console.log('decoded', decoded);
            socket.emit('updateOutput', { value: decoded, roomId: roomId });
            setOutput(decoded);
          } else {
            let decoded = base64_decode(res.data.compile_output);
            console.log('decoded', decoded);
            socket.emit('updateOutput', { value: decoded, roomId: roomId });
            setOutput(decoded);
          }
          setSubmissionState("DONE");
        }).catch(function (err) {
          console.error(err);
          setSubmissionState(err)
        });
      }, 5000)
    }).catch(function (error) {
      console.error(error);
      setSubmissionState(error)

    });
  };

  const handleUpdateBody = (value) => {
    setRoomBody(value)
    debounce(() => socket.emit('updateBody', { value, roomId }), SOCKET_SPEED)();
  };

  const handleUpdateInput = (value) => {
    setInput(value)
    debounce(() => socket.emit('updateInput', { value, roomId }), SOCKET_SPEED)();
  };
  const HandleUpdateOutput = (value) => {
    setOutput(value)
    debounce(() => socket.emit('updateOutput', { value, roomId }), SOCKET_SPEED)();
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
      const audio = document.createElement('audio');
      audio.id = id;
      audio.srcObject = stream;
      if (myPeer && id == myPeer.id) {
        myAudio = stream;
        audio.muted = true;
      }
      audio.autoplay = true;
      audios[id] = data;
      console.log('Adding audio: ', id);
    } // } else {
    //     console.log('adding audio: ', id);
    //     // @ts-ignore
    //     document.getElementById(id).srcObject = stream;
    // }
  };

  const removeAudio = (id) => {
    delete audios[id];
    const audio = document.getElementById(id);
    if (audio) audio.remove();
  };

  const destroyConnection = () => {
    console.log('distroying', audios, myPeer.id);
    if (audios[myPeer.id]) {
      const myMediaTracks = audios[myPeer.id].stream.getTracks();
      myMediaTracks.forEach((track) => {
        track.stop();
      });
    }
    // if (myPeer) myPeer.destroy();
    console.log('distroyed', audios, myPeer.id);

  };

  const setPeersListeners = (stream) => {
    myPeer.on('call', (call) => {
      call.answer(stream);
      call.on('stream', (userAudioStream) => {
        createAudio({ id: call.metadata.id, stream: userAudioStream });
      });
      call.on('close', () => {
        removeAudio(call.metadata.id);
      });
      call.on('error', () => {
        console.log('peer error');
        if (!myPeer.destroyed) removeAudio(call.metadata.id);
      });
      peers[call.metadata.id] = call;
    });
  };

  const newUserConnection = (stream) => {
    socket.on('userJoinedAudio', (userId) => {
      const call = myPeer.call(userId, stream, { metadata: { id: myPeer.id } });
      call.on('stream', (userAudioStream) => {
        createAudio({ id: userId, stream: userAudioStream });
      });
      call.on('close', () => {
        removeAudio(userId);
      });
      call.on('error', () => {
        console.log('peer error');
        if (!myPeer.destroyed) removeAudio(userId);
      });
      peers[userId] = call;
    });
  };

  useEffect(() => {
    if (inAudio) {
      myPeer = new Peer();
      myPeer.on('open', (userId) => {
        console.log('opened');
        getAudioStream().then((stream) => {
          socket.emit('joinAudioRoom', roomId, userId);
          stream.getAudioTracks()[0].enabled = !isMuted;
          newUserConnection(stream);
          setPeersListeners(stream);
          createAudio({ id: myPeer.id, stream });
        });
      });
      myPeer.on('error', (err) => {
        console.log('peerjs error: ', err);
        if (!myPeer.destroyed) myPeer.reconnect();
      });
      socket.on('userLeftAudio', (userId) => {
        console.log('user left aiudio:', userId);
        if (peers[userId]) peers[userId].close();
        removeAudio(userId);
      });
    } else {
      console.log('leaving', myPeer);
      if (myPeer) {
        socket.emit('leaveAudioRoom', myPeer.id);
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
    setLanguage(event.target.value)
    debounce(() => socket.emit('updateLanguage', { value: event.target.value, roomId }), SOCKET_SPEED)();

  }
  // const 
  useEffect(() => {
    console.log(language)
  }, [language])
  return (
    <>
      <div>
        {/* className=" row container-fluid text-center justify-content-center" */}
        <div className=" flex flex-row justify-content-center">
          <div className="form-group col-3">
            <label>Choose Language</label>
            <select
              className="form-select"
              defaultValue={language}
              onChange={handleLanguage}
            >
              {languages.map((lang, index) => {
                return (
                  <option key={index} value={lang} selected={lang === language} >
                    {lang}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="form-group col-3">
            <label>Choose Theme</label>
            <select
              className="form-select"
              defaultValue={theme}
              onChange={(event) => setTheme(event.target.value)}
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
          <div className="form-group col">
            <br />
            <button
              className="bg-blue-700 hover:bg-blue-500 text-white-100 font-bold py-2 px-4 rounded "
              onClick={() => {
                navigator.clipboard.writeText(`${BaseURL}/room/${roomTitle}`);
              }}
            >
              Copy room link
            </button>
          </div>
          <div className="form-group col">
            <br />
            {/* <button
            className="btn btn-primary"
            onClick={submitHandler}
            disabled={submissionState === runningState}
          >
            Save and Run
          </button> */}
            <button
              // className="btn btn-primary"
              className={`btn btn-${inAudio ? 'primary' : 'secondary'}`}
              onClick={() => setInAudio(!inAudio)}
            >
              {inAudio ? 'Leave Audio' : 'Join Audio'} Room
            </button>
          </div>
          {inAudio ? (
            <div className="form-group col">
              <br />
              <button
                className={`btn btn-${!isMuted ? 'primary' : 'secondary'}`}
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? 'Muted' : 'Speaking'}
              </button>
            </div>
          ) : (
            <div className="form-group col" />
          )}
          <div className="form-group col-2">
            <br />
            <label>Status: {submissionState}</label>
          </div>
        </div>
        <hr />
        <div className="grid grid-flow-row grid-cols-2 m0">
             <div className="">
                <div className="form-container">
                   <div className="ide-container">
                      <div className="center ide-low">
                        <div className="ide-header">
                          <h5 className="">Code Here</h5>
                          <button
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
                            </button>
                        </div>
                        {/* {console.log("language" + languageToEditorMode[language])} */}
                        {/* {console.log('room body is ' + output)} */}
                        <Editor
                          theme={theme}
                          language={languageToEditorMode[language]}
                          body={roomBody}
                          setBody={handleUpdateBody}
                          width={"100%"}
                          height={'50vh'}
                        />

                        <div className='text-ip-op'>
                          <div className="row">
                            <div className="col-6 text-center ">
                              <h5 className="Input">Input</h5>
                            </div>
                            <div className="col-6 text-center ">
                              <h5 className="Output">Output</h5>
                            </div> 
                          </div>
                        </div>
                        <div className=" text-center ip-op-editor">
                          {/* <h5>Input</h5> */}
                          <Editor
                            className="editor-1"
                            theme={theme}
                            language={''}
                            body={input}
                            setBody={handleUpdateInput}
                          />
                          {/* <h5>Output</h5> */}
                          {console.log(output)}
                          <Editor className="editor-2"
                            theme={theme}
                            language={''}
                            body={output}
                            setBody={HandleUpdateOutput}
                            readOnly={true}
                          />
                        </div>
                      </div>
                    </div>
                 </div>
             </div>
              <div className="">
                  <div className="wt-board">
                    <Whiteboard />
                  </div>
              </div>
        </div>
        
      </div>
      <div>
        editor is herer
      </div>
    </>
  );
}

export default Room;
