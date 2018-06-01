import React from 'react';
import ReactDOM from 'react-dom';
import './style.css';
import Login from './Login';
import Lobby from './Lobby'
import registerServiceWorker from './registerServiceWorker';
import './style.css'


class Container extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            username : 0,
        }
    }

    loginBtn = (name ) => {
        this.setState({username:name})
    }

    render(){
        if(this.state.username === 0){
            return <Login loginBtn={this.loginBtn}/>;
        }
        else{
            return <Lobby username={this.state.username}/>;
        }
    }
}
// ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<Container />, document.getElementById('root'));
registerServiceWorker();
