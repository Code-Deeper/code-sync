import React, { useEffect, useState } from "react";
import { Editor } from "react-draft-wysiwyg";
import { EditorState } from 'draft-js'
const Draft = ({ editorState, onEditorStateChange}) => {
    return (
        <div>
            <Editor
                editorState={editorState}
                onEditorStateChange={onEditorStateChange}
                toolbar={{
                    inline: { inDropdown: true },
                    list: { inDropdown: true },
                    textAlign: { inDropdown: true },
                    link: { inDropdown: true },
                    history: { inDropdown: true },

                }}
            />
        </div>
    )
}

export default Draft

