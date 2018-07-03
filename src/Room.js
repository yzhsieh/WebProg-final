import React, { Component } from 'react';
import './style.css';
import {Col, Row, Button} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

class Room extends Component{
    // constructor(props){
    //     super(props);
    // }

    renderList = (data) => {
        return(
            <div class="player">
                {data}
            </div>
        )
    }

    componentDidMount = () => {
        document.title = "in Room | WebProg final"
    }

    render(){
        if(this.props.userData === 0){
            console.log('data === 0');
            return(
                <div class="lobby-main">
                Loading
                </div>
            )
        }
        else{
        var winrate = 0
        console.log(this.props.userData.wincount + this.props.userData.losecount);
        if(this.props.userData.wincount + this.props.userData.losecount !== 0)
            winrate = this.props.userData.wincount / (this.props.userData.wincount + this.props.userData.losecount)
        
        // for the view in room 
        let arr = this.props.roomData.slice(2)
        console.log(arr);
        
        return(
                    // <div class="lobby-main">
                    <Row className="lobby-main">
                    <Col sm="7">
                    <div className="room">
                        <div className="label"> {this.props.roomData[1]} </div>
                        {arr.map(this.renderList)}
                    </div>
                    <Row className="chat-win">
                        對話框
                    </Row>
                    </Col>
                    
                    <Col sm="4">
                    <Row className="lobby-button">
                        <div>
                            <Button outline color="secondary" onClick={() => {this.props.gameStartBtn()}}>遊戲開始</Button>
                            <br/>
                            <Button outline color="secondary" onClick={() => {this.props.leaveRoomBtn()}}>離開房間</Button>
                        </div>
                    </Row>
                    <Row className="profile">
                    <Col sm="12" className="label">
                        {this.props.userData.name}
                    </Col>
                    <Col sm="12" className="profile-text">
                    勝場數： {this.props.userData.wincount}
                    <br/>
                    敗場數： {this.props.userData.losecount}
                    <br/>
                    
                    勝率：   {winrate}
                    </Col>
                    </Row>
                    

                    </Col>
                    </Row>
        )
    }
    }
}

export default Room;
