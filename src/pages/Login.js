import React, {Component,} from 'react';
import  { useState } from 'react';
import axios from 'axios';


import Storage from '../service/Storage';
import { GoogleLogin } from 'react-google-login';
import { IonButton, IonIcon,IonContent} from '@ionic/react';
import {logoGoogleplus} from 'ionicons/icons';
import './Login.scss'


export class Login extends Component {

     constructor(props) {
        super(props);

        this.response = this.response.bind(this);
        this.failure = this.failure.bind(this);

    }

    response(r){
        console.log("logged in " + JSON.stringify(r.profileObj))
        r.profileObj.rating = 0;
        localStorage.setItem("profile",JSON.stringify(r.profileObj));
    }

    failure(e){
        alert("failed " +  JSON.stringify(e)  );
    }

    render(){
        let btn =
        <IonContent>
            <ion-grid>
            <ion-row>
            <ion-col size="3"/>
            <ion-col size="6">
            <GoogleLogin render={renderProps => (
                <IonButton color="gold" size="large" onClick={renderProps.onClick} disabled={renderProps.disabled}>
                    <IonIcon icon={logoGoogleplus} slot="start"/> Google ile Giriş </IonButton>)}
                clientId="152418384992-7mk4vo6o39j3q14uf4d1p8jab73qdekf.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={this.response}
            onFailure={this.failure}></GoogleLogin>
            </ion-col>
            <ion-col size="3"/>
            </ion-row>

        </ion-grid>            
</IonContent>             
        let profile = localStorage.getItem("profile");
        if (profile != null){
            return null;
        }
        return btn;
    }

}

export default Login;