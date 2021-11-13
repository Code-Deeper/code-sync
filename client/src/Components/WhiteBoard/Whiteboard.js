import React from 'react'
import Container from './Container/Container'

function Whiteboard(props) {
    return (
        <div style={{height: "78vh"}}>
            < Container
                editorState={props.editorState}
                setEditorState={props.setEditorState}
                onEditorStateChange={props.onEditorStateChange}
                setOpenChat={props.setOpenChat}
                activeUserInRoom={props.activeUserInRoom}
            />
        </div>
    )
}

export default Whiteboard
