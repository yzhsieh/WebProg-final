import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import ReactDOM from 'react-dom';
import FacebookLogin from 'react-facebook-login';

class FBLogin extends Component {
  responseFacebook = (response) => {
    console.log(response);
  }
  render() {
    return (
      <FacebookLogin
      appId="179734082734321"
      autoLoad={true}
      fields="name,email"
      onClick={componentClicked}
      callback={responseFacebook} />
    );
  }
}

export default FBLogin;
