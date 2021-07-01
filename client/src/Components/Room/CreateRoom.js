import React from 'react'

import { useState } from 'react';
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid';
import { Link, RouteChildrenProps } from 'react-router-dom';
import { white } from 'colors';


function CreateRoom({ history }) {
    const [roomName, setRoomName] = useState('');

    const handleSubmit = async (e) => {
        // uuid.v4()
        const uID = await uuidv4();
        console.log(uID);
        axios.post('/api/room', {
            room_id: uID,
            room_title: roomName,
            room_body: "", room_language: "", room_input: ""
        }).then((res) => {
            console.log(res);
            history.push(`/room/${res.data.data.room_id}`)
        }).catch((err) => {
            alert('Room Not Created!! axaError!!!');
            console.log(err);
        })
    }

    return (
        <div className="container-fluid">
            <div>
                <div className="form-group text-center pt-5 mt-5 row justify-content-center">
                    <div className="col-4">
                        <h1>Enter New Room Name</h1>
                        <input
                            type="text"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            className="form-control"
                            placeholder="Enter room name"
                        />
                        <small id="emailHelp" className="form-text text-muted">
                            Create your room or <Link to="/joinRoom"> Join another </Link>
                        </small>
                    </div>
                </div>
                <div className="form-group text-center pt-3 row justify-content-center" style={{ border: "10px" }}>
                    <button onClick={handleSubmit} className="btn btn-blue col-2 text-lg">
                        <h3 style={{ color: white }}>Join Room</h3>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default CreateRoom
