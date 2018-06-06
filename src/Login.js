import React, { Component } from 'react';
import './App.css';
import 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            username : "Jack",
            userBirth: 19941205,
        }
    }

    handleChangeName = (e) => {
        this.setState({ username: e.target.value });
      }

    handleChangeBirth = (e) => {
        this.setState({userBirth: e.target.value});
    }
      

    ClickLogin = () => {
        this.props.loginBtn(this.state.username, this.state.userBirth);
    }

    ClickRegister = () => {
        this.props.registerBtn(this.state.username, this.state.userBirth);
    }
    
    componentDidMount = () => {
        document.title = "Login | WebProg final"
    }
    render(){
        return(
            <div class="login-container">
            <div class="login-win text-center ">
                  <h3>Please enter your name</h3>
                  <input name="user" type="text" placeholder="user name" onChange={ this.handleChangeName }/>
                  <br/>
                  <input name="birth" type="text" placeholder="birth in 8 digit. eg. 19941205" onChange={ this.handleChangeBirth }/>
                  <br/>
                  <br/>
                  <button class="btn btn-primary" onClick={this.ClickRegister}>Register</button>
                  <button class="btn btn-primary" onClick={this.ClickLogin}>Login</button>
                </div>
                </div>
        )
    }
}

export default Login;
