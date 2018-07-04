import React, { Component } from 'react';
import './style.css';
import {Col, Row, Button} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.css';

class Lobby extends Component{
    // constructor(props){
    //     super(props);
    // }

    renderList = (data) =>{
        let num = data.length - 2;
        return (
            <Row className="room-item" onClick={ () => {this.props.enterRoomBtn(data[0])}}>
                <Col sm="2" id="roomId"> {data[0]} </Col>
                <Col sm="4" id="roomName"> {data[1]} </Col>
                <Col sm="4" id="userName"> {data[2]} </Col>
                <Col sm="2" id="userName"> {num}/2 </Col>
            </Row>
        )
    }

    componentDidMount = () => {
        document.title = "Lobby | WebProg final"
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
        return(
                    // <div class="lobby-main">
                    <Row className="lobby-main">
                    <Col sm="7">
                    <div className="room-list">
                        <Row className="room-item">
                            <Col sm="2" id="roomId"> 房號 </Col>
                            <Col sm="4" id="roomName"> 房間名稱 </Col>
                            <Col sm="4" id="userName"> 房主名稱 </Col>
                            <Col sm="2" id="userName"> 人數 </Col>
                        </Row>
                        {this.props.lobbyData.map(this.renderList)}
                    </div>
                    <Row className="chat-win">
                        對話框
                    </Row>
                    </Col>

                    <Col sm="4">
                    <Row className="lobby-button">
                        <div>
                            <Button outline color="secondary" onClick={ () => {this.props.createRoomBtn()}}>建立房間</Button>
                            <br/>
                            <Button outline color="secondary">自動加入</Button>
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

export default Lobby;
