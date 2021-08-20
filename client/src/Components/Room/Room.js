import React, { useState, useEffect } from "react";
import axios from "axios";
import Editor from "../Editor/Editor";
import socket from '../socket.io'
import _, { debounce } from 'lodash';

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
  const themes = ["monokai", "github", "solarized_dark", "dracula"];

  const [roomTitle, setRoomTitle] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomBody, setRoomBody] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("c");
  const [theme, setTheme] = useState("monokai");

  const idealState = "Idle";
  const runningState = "running";
  const completedState = "completed";
  const errorState = "Some error occured";

  const [submissionState, setSubmissionState] = useState(idealState);
  const [submissionId, setSubmissionId] = useState("");
  const [submissionIdChecker, setSubmissionIdChecker] = useState(null);


  // const API_KEY = "guest";

  const SOCKET_SPEED = 100;


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
  }, [props]);



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
          `http://api.paiza.io/runners/get_details?${querystring}`
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
    axios.post(`http://api.paiza.io/runners/create?${querystring}`).then((res) => {
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
    axios.get(`http://api.paiza.io/runners/get_status?${querystring}`).then((res) => {
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
  return (
    <div>
      <div className="row container-fluid">
        <div className="form-group col-4">
          <label>Choose Language</label>
          <select
            className="form-select"
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
        <div className="form-group col-4">
          <label>Choose Theme</label>
          <select
            className="form-select"
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
        <div className="form-group col-2">
          <br />
          <button
            className="btn btn-primary"
            onClick={submitHandler}
            disabled={submissionState === runningState}
          >
            Save and Run
          </button>
        </div>
        <div className="form-group col-2">
          <br />
          <label>Status: {submissionState}</label>
        </div>
      </div>

      <hr />
      <div className="row p-0 m-0 text-center">
        <div className="col-6">
          <h5>Code Here</h5>
          {/* {console.log("language" + languageToEditorMode[language])} */}
          {/* {console.log('room body is ' + output)} */}
          <Editor
            theme={theme}
            language={languageToEditorMode[language]}
            body={roomBody}
            setBody={setRoomBody}
          />

        </div>
        <div className="col-6 text-center">
          <h5>Input</h5>
          <Editor
            theme={theme}
            language={''}
            body={input}
            setBody={setInput}
            height={'35vh'}
          />
          <h5>Output</h5>
          {console.log(output)}
          <Editor
            theme={theme}
            language={''}
            body={output.value}
            setBody={setOutput}
            readOnly={true}
            height={'40vh'}
          />
        </div>
      </div>
    </div>
  );
}

export default Room;
