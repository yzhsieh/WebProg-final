import React, { Component } from 'react';
import './App.css';


class Login extends Component{
    constructor(props){
        super(props);
        this.state = {
            username : 0,
        }
    }

    handleChange = (e) => {
        this.setState({ username: e.target.value });
      }

    handleClick = () => {
        this.props.loginBtn(this.state.username);
    }

    componentDidMount = () => {
        document.title = "Login | WebProg hw4"
    }
    render(){
        return(
            <div class="login-container">
            <div class="login-win text-center ">
                  <h3>Please enter your name</h3>
                  <input name="user" type="text" placeholder="user name" onChange={ this.handleChange }/>
                  <br/>
                  <input name="birth" type="text" placeholder="birth in 8 digit. eg. 19941205" onChange={ this.handleChange }/>
                  <br/>
                  <br/>
                  <button class="btn btn-primary" onClick={this.handleClick}>Register</button>
                  <button class="btn btn-primary" onClick={this.handleClick}>Login</button>
                </div>
                </div>
        )
    }
}

export default Login;
