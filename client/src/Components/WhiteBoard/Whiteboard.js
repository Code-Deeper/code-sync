import React from 'react'
import Container from './Container/Container'

function Whiteboard(props) {
    return (
        <div style={{height: "78vh"}}>
            < Container
                key={props.msg}
                editorState={props.editorState}
                setEditorState={props.setEditorState}
                onEditorStateChange={props.onEditorStateChange}
                msg={props.msg}
                setMsg={props.setMsg}
                setMsgs={props.setMsgs}
                msgs={props.msgs}
                userName={props.userName}
                SendMessage={props.SendMessage}
                roomTitle={props.roomTitle}
                key ={props.key}
            />
        </div>
    )
}

export default Whiteboard
