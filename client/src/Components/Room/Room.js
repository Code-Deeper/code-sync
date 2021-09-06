import React, { useState, useEffect } from "react";
import axios from "axios";
import Editor from "../Editor/Editor";
import socket from '../socket.io'
import _, { debounce } from 'lodash';
import { BaseURL } from '../../BaseURL'
import Peer from 'peerjs';
import './Room.css';

var myPeer = Peer
var audios = {}
var peers = {}
var myAudio = MediaStream | null;

function Room(props) {
  const languageToEditorMode = {
    c: "c_cpp",
    cpp: "c_cpp",
    python: "python",
    python3: "python",
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
  // const API_KEY = "guest";

  const SOCKET_SPEED = 100;

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
      console.log(roomBody)
      setRoomBody(roomBody);
    });
    socket.on('updateInput', (input) => {
      setInput(input.value);
    });
    socket.on('updateLanguage', (language) => {
      setLanguage(language.value);
    });
    socket.on('updateOutput', (output) => {
      setOutput(output.value);
    });

    const { id } = props.match.params;
    // console.log("id is" + id);
    setRoomId(id);

    socket.emit('joinroom', id);


    const url = `/api/room/${id}`;
    const fetchData = async () => {
      const { data } = await axios.get(url);
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

  useEffect(() => {
    const updateSubmission = async () => {

      if (submissionIdChecker && submissionState === completedState) {

        // clearInterval(submissionIdChecker);
        setSubmissionIdChecker(null);
        const params = new URLSearchParams({
          id: submissionId,
          api_key: 'guest'
        });
        const querystring = params.toString();
        const { data } = await axios.get(
          `https://api.paiza.io/runners/get_details?${querystring}`
        );
        const { stdout, stderr, build_stderr } = data;
        // console.log('stdout' + stdout);
        let output = "";
        if (stdout) output += stdout;
        if (stderr) output += stderr;
        if (build_stderr) output += build_stderr;
        setOutput(output)
        socket.emit('updateOutput', { value: output, roomId: roomId });
      }
    };
    updateSubmission();
  }, [submissionState]);




  const submitHandler = () => {

    if (submissionState === runningState) return;
    setSubmissionState(runningState);

    // console.log("language" + language);

    axios.patch(`/api/room/${roomId}`, {
      room_id: roomId,
      room_body: roomBody,
      room_title: roomTitle,
      room_input: input,
      room_language: language,
    })
      .then((res) => {
        // TODO:
        console.log({ res });
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
    // console.log("l"+language);
    const params = new URLSearchParams({
      source_code: roomBody,
      language: language,
      input: input,
      api_key: 'guest'
    });
    const querystring = params.toString();
    console.log('before Input ' + input);
    axios.post(`https://api.paiza.io/runners/create?${querystring}`).then((res) => {
      const { id, status } = res.data;
      console.log("response id and status " + res.data.id);
      setSubmissionId(id);
      setSubmissionState(status);
    }).catch((err) => {
      // const { errorStatus } = err

      console.log("something wrong here!!!");
      setSubmissionId("");
      setSubmissionState(errorState);
    })
  };

  useEffect(() => {
    if (submissionId) {
      setSubmissionIdChecker(setInterval(() => updateSubmissionStatus(), 1000))
    }
  }, [submissionId])
  const updateSubmissionStatus = () => {
    const params = new URLSearchParams({
      id: submissionId,
      api_key: 'guest'
    });
    const querystring = params.toString();
    axios.get(`https://api.paiza.io/runners/get_status?${querystring}`).then((res) => {
      const { status } = res.data
      setSubmissionState(status)
    }).catch((err) => {
      console.log(err);
    })
  }

  const handleUpdateBody = (value) => {
    setRoomBody(value)
    debounce(() => socket.emit('updateBody', { value, roomId }), SOCKET_SPEED)();
  };

  const handleUpdateInput = (value) => {
    // let val = toString(value);
    setInput(value)
    debounce(() => socket.emit('updateInput', { value, roomId }), SOCKET_SPEED)();
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


  return (
    <div>
      <div className="row container-fluid text-center justify-content-center">
        <div className="form-group col-3">
          <label>Choose Language</label>
          <select
            className="form-select"
            defaultValue={language}
            onChange={(event) => socket.emit('updateLanguage', { value: event.target.value, roomId })}
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
            className="btn btn-secondary"
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
      <div className="form-container">
        <div className="">
          <div className="col-12 center">
            <div className="row mb-1">
              <h5 className="col">Code Here</h5>
              <div className="form-group col">
                <button
                  className="btn btn-secondary"
                  onClick={() => {
                    navigator.clipboard.writeText(roomBody);
                  }}
                >
                  Copy Code
                </button>
              </div>
              <div className="form-group col">
                <button
                  className="btn btn-primary"
                  onClick={submitHandler}
                  disabled={submissionState === runningState}
                >
                  Save and Run
                </button>
              </div>
            </div>
            {/* {console.log("language" + languageToEditorMode[language])} */}
            {/* {console.log('room body is ' + output)} */}
            <Editor
              theme={theme}
              language={languageToEditorMode[language]}
              body={roomBody}
              setBody={setRoomBody}
              width={"100%"}
            />
          </div>
          <div className='text-ip-op'>
            <div className="col-6 text-center ">
              <h5 className="Input">Input</h5>
            </div>
            <div className="col-6 text-center ">
              <h5 className="Output">Output</h5>
            </div>
          </div>
          <div className="col-12 text-center ip-op-editor">
            {/* <h5>Input</h5> */}
            <Editor
              className="editor-1"
              theme={theme}
              language={''}
              body={input}
              setBody={setInput}
              height={'35vh'}
              width={"100%"}
            />
            {/* <h5>Output</h5> */}
            {console.log(output)}
            <Editor className="editor-2"
              theme={theme}
              language={''}
              body={output.value}
              setBody={setOutput}
              readOnly={true}
              height={'35vh'}
              width={"100%"}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Room;
