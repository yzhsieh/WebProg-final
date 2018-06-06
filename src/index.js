import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import Login from './Login';
import Lobby from './Lobby'
import Room from './Room'
import registerServiceWorker from './registerServiceWorker';
import socketIOClient from "socket.io-client";
import {Container, Col, Row} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';


class MAIN extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            endpoint: "http://127.0.0.1:3010",
            userName : 0,
            userBirth: 0,
            userData: 0,
            currentState: "login", // login, lobby, room, playing
            sideWinData: 0,
            roomState: 0, // [roomId, roomName, user1, user2]
            lobbyData: 0,
        }
    }


    loginBtn = (name, birth) => {
        this.setState({userName:name, userBirth: birth})
        const io = socketIOClient(this.state.endpoint)
        io.emit("login", [name, birth], (res) => {
            console.log('in login method');
            console.log(res);            
            if(res === 0){
                // TODO: inplement login fail views and methods
                console.log("Login failed!!")
            }
            else{
                this.setState({currentState: "lobby", userData:res["userData"], lobbyData:res["lobbyData"]})
            }
        })

        io.emit("get sideWinData", (res) => {
            console.log(res);
            this.setState({sideWinData:res})
            
        })

        io.on("update sideWin", (data) => {
            this.setState({sideWinData:data})
        })

        io.on("update lobby", (data) => {
            this.setState({lobbyData: data})
        })
    }

    registerBtn = (name, birth) => {
        this.setState({userName:name, userBirth: birth})
        const io = socketIOClient(this.state.endpoint)
        io.emit("register", [this.state.userName, this.state.userBirth], (res) => {
            console.log('in login method');
            console.log(res);
            
            
            // if(res === 1){
            //     this.setState({logined:1})
            // }
            // else{
            //     // TODO: inplement login fail views and methods
            //     console.log("Login failed!!")
            // }
        })
    }

    createRoomBtn = () => {
        // TODO: replace this ugly prompt
        var roomName = prompt("Please enter the room name")
        if(roomName !== null){
            const io = socketIOClient(this.state.endpoint)
            io.emit("create room", [this.state.userName, roomName], (res) => {
                if(res !== 0){
                    this.setState({currentState: "room", roomState: res})
                }
            })
        }

    }

    enterRoomBtn = (roomid) =>{
        const io = socketIOClient(this.state.endpoint)
        io.emit("enter room", [this.state.userName, roomid], (res) => {
            console.log(res);
            
            if(res !== 0){
                this.setState({currentState: "room", roomState: res})
            }
        })
    }

    autoEnterBtn = () => {
        const io = socketIOClient(this.state.endpoint)
        io.emit("auto enter", this.state.userName, (res) => {
            if(res !== 0){
                //TODO
            }
        })
    }

    leaveRoomBtn = () => {
        // TODO
        const io = socketIOClient(this.state.endpoint)
        io.emit("leave room", [this.state.userName, this.state.roomState[0]], (res) => {
            if(res === 1){
                this.setState({currentState:"lobby", roomState: 0})
            }
        })
    }

    gameStartBtn = () => {
        // TODO
    }

    render(){
        if(this.state.currentState === "login"){
            return <Login loginBtn={this.loginBtn} registerBtn={this.registerBtn}/>;
        }
        else if (this.state.currentState === "playing"){
            return (<div>這是遊戲中的畫面</div>)
        }
        else if (this.state.currentState === "lobby"){
        return (
            <Container>
                <Row>
                    <Col xs="2">
                    <SideWin data={this.state.sideWinData}/>
                    </Col>
                    <Col xs="8">
                    <Lobby userData={this.state.userData} lobbyData={this.state.lobbyData} createRoomBtn={this.createRoomBtn} enterRoomBtn={this.enterRoomBtn} autoEnterBtn={this.autoEnterBtn}/>
                    </Col>
                </Row>
            </Container>)
        }
        else if(this.state.currentState === "room"){
            return(
                <Container>
                <Row>
                    <Col xs="2">
                    <SideWin data={this.state.sideWinData}/>
                    </Col>
                    <Col xs="8">
                    <Room userData={this.state.userData} roomData={this.state.roomState} leaveRoomBtn={this.leaveRoomBtn}/>
                    </Col>
                </Row>
            </Container>)
        }
    }
    
}

class SideWin extends React.Component{
    // constructor(props){
    //     super(props)
    // }

    renderList = (name) =>{
        return <div>{name}</div>
    }

    render(){
        console.log('in render func');
        if(this.props.data === 0){
            console.log('data === 0');
            return(
                <div class="side-win">
                Loading
                </div>
            )
        }
        else{
            console.log("get data:")
            console.log(this.props.data)
            return(
                <div className="side-win">
                <div className="label">
                在線名單
                </div>
                {this.props.data.map(this.renderList)}

                <div>
                    {/* <Button color="danger" onClick={this.createRoomToggle}>{this.props.buttonLabel}</Button>
                    <Modal isOpen={this.state.createRoomModal} toggle={this.createRoomToggle} className={this.props.className} external={externalCloseBtn}>
                    <ModalHeader>Modal title</ModalHeader>
                    <ModalBody>
                        <b>Look at the top right of the page/viewport!</b><br />
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                    </Modal> */}
                </div>

                </div>
            )
        }

    }
}
ReactDOM.render(<MAIN />, document.getElementById('root'));
registerServiceWorker();
