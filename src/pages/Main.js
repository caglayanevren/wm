import React, {Component,} from 'react';
import  { useState } from 'react';
import axios from 'axios';


import { IonAvatar,IonChip,IonLabel, IonContent} from '@ionic/react';
import Storage from '../service/Storage';
import { GoogleLogin } from 'react-google-login';
//import {Button} from 'primereact/button';


export class Main extends Component {

     constructor(props) {
        super(props);
        console.log(JSON.stringify(props.profile));
    }


    render(){
        let chip = 
        <IonChip key={0}>
        <IonAvatar>
          <img src={this.props.profile.imageUrl} />
        </IonAvatar>
        <IonLabel>{this.props.profile.name}</IonLabel>
        </IonChip>
        return(<IonContent>{chip}</IonContent>);
    }

}

export default Main;