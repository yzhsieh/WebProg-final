import React, { Component } from 'react';
import './App.css';


class Lobby extends Component{
    constructor(props){
        super(props);
        this.state = {
            username : this.props.username,
        }
    }


    render(){
        return(
            <div class="container">
                <div class="row">
                    <div class="offset-2 col-4 lobby-label">
                        遊戲大廳
                    </div>
                    <div class="offset-2 col-3 lobby-label">
                        個人資訊
                    </div>
                </div>
                <div class="row lobby-main">
                    <div class="offset-2 col-4 ">
                        遊戲大廳
                    </div>
                    <div class="offset-2 col-3 ">
                        個人資訊
                    </div>
                </div>
            </div>
        )
    }
}

export default Lobby;
