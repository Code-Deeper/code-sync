import React from 'react';
import Board from '../Board/Board';
import './Container.css';

class Container extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            color: "#000000",
            size: "5"
        }
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

        return (
            <div className="container">
               <div class="board-container">
                   <div className="board-title">
                        <h2>White Board</h2>
                   </div>
                    <Board color={this.state.color} size={this.state.size}></Board>
                    
                </div>
            
                <div className="tools-section">
                   
                    <div className="color-picker-container">
                         <label>Color :</label>
                        <input type="color" value={this.state.color} onChange={this.changeColor.bind(this)} />
                    </div>

                    <div className="brushsize-container">
                        <label>Size :</label>
                        <span className="eraser-color-container" onClick={this.eraseHandler.bind(this)}><img className="eraser-img" src="/image/eraser.png" /></span>              
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

            </div>
        )
    }
}

export default Container