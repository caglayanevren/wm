import React, {Component,} from 'react';
import  { useState } from 'react';
import axios from 'axios';


import { IonAvatar,IonChip,IonPopover,IonTitle,IonLabel,IonButton,IonIcon, IonContent,IonItem,IonButtons, IonHeader,IonToolbar} from '@ionic/react';
import Storage from '../service/Storage';
import { GoogleLogin } from 'react-google-login';
import './cards/index.scss';
import {stats} from 'ionicons/icons'
//import {Button} from 'primereact/button';


export class Main extends Component {

     constructor(props) {
        super(props);
        this.state = {
            showStats : false
        }
    }


    render(){
        let chip = 
        <IonChip color="tertiary">
        <IonAvatar>
          <img src={this.props.profile.imageUrl} />
        </IonAvatar>
        <IonLabel>{this.props.profile.name}</IonLabel>
        </IonChip>
        return(<IonContent scrollY={false} fullscreen={true}>

<IonPopover isOpen={this.state.showStats} onDidDismiss={e => this.setState({showStats:false})}>
                                <IonItem>
                                    <IonIcon icon={stats} slot="start" />
                                    <span style={{fontWeight:500}}>Oyun Sonu</span>
                                    
                                </IonItem>

                                
                                    <div style={{width:"100%",padding:"10px"}}>
                                    </div>
                                    <br/>
                                    <div style={{textAlign:"center"}}><IonButton onClick={e=>this.setState({showStats : false})} size="small" fill="outline" color="primary">Kapat</IonButton></div>                                        
                        </IonPopover>


    <IonHeader>
    <IonToolbar  color="gold" mode="ios">
      <IonButtons  slot="start">
      <IonAvatar >
          <img src={this.props.profile.imageUrl} />
        </IonAvatar>
      </IonButtons>
      <IonTitle>          
      {this.props.profile.name} 
      </IonTitle>
      <IonButtons slot="end">
      <IonButton fill="outline" size ="small"  shape="round" color="dark"  onClick={e=>this.setState({showStats:true})}>
        <IonIcon slot="icon-only" icon={stats}/>
      </IonButton>
    </IonButtons>
    </IonToolbar>


    </IonHeader>
  <div className="wrapper">
    <div className="clash-card barbarian">

      <div className="clash-card__level clash-card__level--barbarian">Level 4</div>
      <div className="clash-card__unit-name">The Barbarian</div>
      <div className="clash-card__unit-description">
        
      </div>

      <div className="clash-card__unit-stats clash-card__unit-stats--barbarian clearfix">
        <div className="one-third">
          <div className="stat">20<sup>S</sup></div>
          <div className="stat-value">Training</div>
        </div>

        <div className="one-third">
          <div className="stat">16</div>
          <div className="stat-value">Speed</div>
        </div>

        <div className="one-third no-border">
          <div className="stat">150</div>
          <div className="stat-value">Cost</div>
        </div>

      </div>

    </div> 
  </div>
  </IonContent> 
  
  );
    }

}

export default Main;