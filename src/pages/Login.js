import React, {Component,} from 'react';
import  { useState } from 'react';
import axios from 'axios';


import Storage from '../service/Storage';
import { GoogleLogin } from 'react-google-login';
import { IonButton} from '@ionic/react';
//import {Button} from 'primereact/button';


export class Login extends Component {

     constructor(props) {
        super(props);

        this.response = this.response.bind(this);
        this.failure = this.failure.bind(this);

    }

    response(r){
        console.log("logged in " + JSON.stringify(r.profileObj))
        localStorage.setItem("profile",JSON.stringify(r.profileObj));
    }

    failure(e){
        alert("failed " +  JSON.stringify(e)  );
    }

    render(){
        let btn = 
            <GoogleLogin render={renderProps => (
                <IonButton onClick={renderProps.onClick} disabled={renderProps.disabled}>This is my custom Google button</IonButton>)}
                clientId="152418384992-7mk4vo6o39j3q14uf4d1p8jab73qdekf.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={this.response}
            onFailure={this.failure}></GoogleLogin>
        let profile = localStorage.getItem("profile");
        if (profile != null){
            return null;
        }
        return btn;
    }

}

export default Login;