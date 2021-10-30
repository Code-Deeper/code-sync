import React from 'react';
import Board from '../Board/Board';
import Draft from '../../Room/RichEditor/Draft'
import './Container.css';
class Container extends React.Component {
    // constructor(props) {
    //     super(props);

    //     this.state = {
    //         color: "#000000",
    //         size: "5",
    //         noteToggle : false
    //     }
    // }
    // toggleText(params) {
    //     console.log({ st :this.state.noteToggle})
    //     this.setState({
    //         noteToggle : this.props.noteToggle === true ? false : true ,
    //     })
    // }

    constructor(props) {
        super(props);
        this.state = {addClass: false}
      }
      toggle() {
        this.setState({addClass: !this.state.addClass});
      }

    changeColor(params) {
        this.setState({
            color: params.target.value
        })
    }

    changeSize(params) {
        this.setState({
            size: params.target.value
        })
    }
    eraseHandler(params) {
        console.log("tgerere");
        this.setState({
            color: "#ffffff"
        })
    }
    render() {
        let boxClass = ["text-editor-btn-area"];
        if(this.state.addClass) {
        boxClass.push('active');
        }
        return (
            <div className="container">
               <div class="board-container">
                   <div className="board-title">
                        <h2>White Board</h2>
                   </div>
                    <Board color={this.state.color} size={this.state.size}></Board>
                    {/* <div className="text-editor-btn-area">
                        {console.log(this.state.noteToggle)}
                        

                        {this.state.noteToggle == true ?
                            <div className="texteditor-section active">
                                <Draft
                                    editorState={this.props.editorState}
                                    setEditorState={this.props.setEditorState}
                                    onEditorStateChange={this.props.onEditorStateChange}
                                   
                                />
                                <button className="text-editor-btn" 
                                    onClick={() => this.setState({ noteToggle : false}) }
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="31.5" height="36.952" viewBox="0 0 31.5 36.952">
                                    <path id="Icon_awesome-sticky-note" data-name="Icon awesome-sticky-note" d="M9.563,15.447H0V37.223A1.847,1.847,0,0,0,1.688,39.2H29.813a1.847,1.847,0,0,0,1.688-1.98V4.23a1.847,1.847,0,0,0-1.687-1.98H11.25V13.468A1.857,1.857,0,0,1,9.563,15.447ZM.492,10.911,7.383,2.827a1.57,1.57,0,0,1,1.2-.577H9V12.808H0v-.5A2.159,2.159,0,0,1,.492,10.911Z" transform="translate(0 -2.25)" fill="#cbcbcb" />
                                </svg>
                                </button>
                            </div>
                            :
                            <div>
                            <div className="texteditor-section">
                                <Draft
                                    editorState={this.props.editorState}
                                    setEditorState={this.props.setEditorState}
                                    onEditorStateChange={this.props.onEditorStateChange}
                                   
                                />
                               
                            </div>
                            <button onClick={this.toggleText.bind(this)}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="31.5" height="36.952" viewBox="0 0 31.5 36.952">
                                    <path id="Icon_awesome-sticky-note" data-name="Icon awesome-sticky-note" d="M9.563,15.447H0V37.223A1.847,1.847,0,0,0,1.688,39.2H29.813a1.847,1.847,0,0,0,1.688-1.98V4.23a1.847,1.847,0,0,0-1.687-1.98H11.25V13.468A1.857,1.857,0,0,1,9.563,15.447ZM.492,10.911,7.383,2.827a1.57,1.57,0,0,1,1.2-.577H9V12.808H0v-.5A2.159,2.159,0,0,1,.492,10.911Z" transform="translate(0 -2.25)" fill="#cbcbcb" />
                                </svg>
                            </button>
                            </div>
                        }
                    </div> 
                    */}
                    <div className={boxClass.join(' ')} >
                    {this.state.addClass ? 
                        
                        <button onClick={this.toggle.bind(this)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="31.5" height="36.952" viewBox="0 0 31.5 36.952">
                                <path id="Icon_awesome-sticky-note" data-name="Icon awesome-sticky-note" d="M9.563,15.447H0V37.223A1.847,1.847,0,0,0,1.688,39.2H29.813a1.847,1.847,0,0,0,1.688-1.98V4.23a1.847,1.847,0,0,0-1.687-1.98H11.25V13.468A1.857,1.857,0,0,1,9.563,15.447ZM.492,10.911,7.383,2.827a1.57,1.57,0,0,1,1.2-.577H9V12.808H0v-.5A2.159,2.159,0,0,1,.492,10.911Z" transform="translate(0 -2.25)" fill="#cbcbcb"/>
                                <rect id="Rectangle_51" data-name="Rectangle 51" width="3.001" height="21.008" rx="1.501" transform="matrix(0.839, -0.545, 0.545, 0.839, 8.771, 12.164)" fill="#818181"/>
                                <rect id="Rectangle_52" data-name="Rectangle 52" width="3.001" height="21.008" rx="1.501" transform="translate(20.873 11.199) rotate(37)" fill="#818181"/>
                            </svg>
                        </button>
                        : 
                        <button onClick={this.toggle.bind(this)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="31.5" height="36.952" viewBox="0 0 31.5 36.952">
                                <path id="Icon_awesome-sticky-note" data-name="Icon awesome-sticky-note" d="M9.563,15.447H0V37.223A1.847,1.847,0,0,0,1.688,39.2H29.813a1.847,1.847,0,0,0,1.688-1.98V4.23a1.847,1.847,0,0,0-1.687-1.98H11.25V13.468A1.857,1.857,0,0,1,9.563,15.447ZM.492,10.911,7.383,2.827a1.57,1.57,0,0,1,1.2-.577H9V12.808H0v-.5A2.159,2.159,0,0,1,.492,10.911Z" transform="translate(0 -2.25)" fill="#cbcbcb" />
                            </svg>
                        </button> 
                        
                        }
                        
                        <div className="texteditor-section">
                                    <Draft
                                        editorState={this.props.editorState}
                                        setEditorState={this.props.setEditorState}
                                        onEditorStateChange={this.props.onEditorStateChange}
                                    
                                    />
                                
                                </div>
                                    
                            
                       
                    </div>
                </div>
                <div className="tools-section">
                   
                    <div className="color-picker-container">
                        <label>Color :</label>
                        <input type="color" value={this.state.color} onChange={this.changeColor.bind(this)} />
                        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27.002" viewBox="0 0 27 27.002">
                            <path id="Icon_ionic-md-color-filter" data-name="Icon ionic-md-color-filter" d="M31.064,8.445,27.555,4.936a1.5,1.5,0,0,0-2.116,0L20.756,9.619,17.866,6.75,15.75,8.866,17.88,11,4.5,24.377V31.5h7.123L25,18.12l2.13,2.13,2.116-2.116-2.883-2.883,4.683-4.683A1.494,1.494,0,0,0,31.064,8.445ZM10.378,28.5,7.5,25.622,19.582,13.535l2.883,2.883Z" transform="translate(-4.5 -4.498)" fill="#fff"/>
                        </svg>
                    </div>

                    <div className="brushsize-container">
                        <label>Size :</label>
                        <span className="pen-color-container">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24.867" height="24.866" viewBox="0 0 24.867 24.866">
                                <path id="Icon_awesome-pen" data-name="Icon awesome-pen" d="M14.12,4.529l6.218,6.218-13.5,13.5-5.544.612A1.166,1.166,0,0,1,.007,23.572l.617-5.547,13.5-13.5ZM24.184,3.6,21.264.684a2.332,2.332,0,0,0-3.3,0L15.219,3.43l6.218,6.218L24.184,6.9a2.332,2.332,0,0,0,0-3.3Z" transform="translate(0.001 -0.001)"/>
                            </svg>
                        </span>
                        <span className="eraser-color-container" onClick={this.eraseHandler.bind(this)}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="26.222" height="22.944" viewBox="0 0 26.222 22.944">
                            <path id="Icon_awesome-eraser" data-name="Icon awesome-eraser" d="M25.5,14.641a2.458,2.458,0,0,0,0-3.477L17.308,2.97a2.458,2.458,0,0,0-3.477,0L.72,16.081a2.458,2.458,0,0,0,0,3.477l4.917,4.917a2.459,2.459,0,0,0,1.738.72H25.607a.615.615,0,0,0,.615-.615V22.531a.615.615,0,0,0-.615-.615H18.226L25.5,14.641ZM10,11.434l7.036,7.036-3.447,3.447H7.714l-4.1-4.1L10,11.434Z" transform="translate(0 -2.25)" fill="#cbcbcb"/>
                        </svg>

                        </span>              
                        <select value={this.state.size} onChange={this.changeSize.bind(this)}>
                            <option> 5 </option>
                            <option> 10 </option>
                            <option> 15 </option>
                            <option> 20 </option>
                            <option> 25 </option>
                            <option> 30 </option>
                        </select>
                    </div>
                </div>

                <div className="showcase-section">
                    <h3>
                    5 People Join Chatroom
                    <svg xmlns="http://www.w3.org/2000/svg" width="43.219" height="43.219" viewBox="0 0 43.219 43.219">
                        <path id="Icon_material-chat" data-name="Icon material-chat" d="M7.322,3H41.9a4.316,4.316,0,0,1,4.3,4.322l.022,38.9-8.644-8.644H7.322A4.335,4.335,0,0,1,3,33.253V7.322A4.335,4.335,0,0,1,7.322,3ZM37.575,18.127H11.644v4.322H37.575Zm-17.287,10.8H37.575V24.609H20.287ZM11.644,15.966H37.575V11.644H11.644Z" transform="translate(-3 -3)"/>
                    </svg>
                    </h3>
                </div>

             
            </div>
        )
    }
}

export default Container