import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../../API";
import Editor from "../components/editor";

function Room(props) {
  const languageToEditorMode = {
    c: "c_cpp",
    cpp: "c_cpp",
    python: "python",
    python3: "python",
    java: "java",
    javascript: "javascript",
  };
  const language = Object.keys(languageToEditorMode)
  const themes = ['monokai', 'github', 'solarized_dark', 'dracula']


  const [id, setId] = useState(0);
  const [roomTitle, setRoomTitle] = useState("");
  const [roomId, setRoomId] = useState("");
  const [roomBody, setRoomBody] = useState("");
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [language , setLanguage] = useState('')
  const [theme , setTheme] = useState('monokai')
  


  useEffect(() => {
    const { id } = props.match.params;
    const url = `/api/room/${id}`;
    const fetchData = async () => {
      const { data } = await axios.get(url);
      const { room_id, room_title, room_body } = data;
      console.log(room_id);
      console.log(room_title);
      console.log(room_body);

      setRoomTitle(room_title);
      setRoomId(room_id);
      setRoomBody(room_body);
    };

    fetchData();
  }, [props]);

  return (
    <div>
      <h1>{roomTitle}</h1>
      <h1>{roomId}</h1>
      <h1>{roomBody}</h1>
    </div>
  );
}

export default Room;
