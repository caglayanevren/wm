import React, {Component,} from 'react';
import  { useState } from 'react';
import axios from 'axios';


import { IonAvatar,IonSlide,IonSlides,IonChip,IonPopover,IonTitle,IonLabel,IonButton,IonIcon, IonContent,IonItem,IonButtons, IonHeader,IonToolbar} from '@ionic/react';
import Storage from '../service/Storage';
import { GoogleLogin } from 'react-google-login';
import './cards/index.scss';
import {stats} from 'ionicons/icons'
//import {Button} from 'primereact/button';


export class Main extends Component {
    gameList = [];    
    constructor(props) {
        super(props);
        this.state = {
            showStats : false
        }
        let storage = new Storage();
        this.gameList = storage.getGames().reverse();
        this.gameList.splice(5,this.gameList.length - 5)
    }


    render(){
        let gameCards = [];
        let options = {  year: 'numeric', month: 'long', day: 'numeric' };
        const slideOpts = {
            initialSlide: 1,
            speed: 400,
          };        
        for(const[i,g] of this.gameList.entries()){
            gameCards.push(
                <IonSlide>
                <div className="wrapper">
                  <div className="clash-card barbarian">
              
                    <div className="clash-card__level clash-card__level--barbarian">{new Date(g.startDate).toLocaleDateString('tr-TR', options)}</div>

                    <div className="clash-card__unit-description">
                    The Barbarian
                    </div>
              
                    <div className="clash-card__unit-stats clash-card__unit-stats--barbarian clearfix">
                      <div className="one-third">
                        <div className="stat">{g.clearedLetterCount}%</div>
                        <div className="stat-value">Yüzde</div>
                      </div>
              
                      <div className="one-third no-border">
                        <div className="stat">{g.score}</div>
                        <div className="stat-value">Puan</div>
                      </div>
                    </div>
              
                  </div> 
                </div>
                </IonSlide>
            )
        }

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
    <IonSlides pager={true} infinite={false} effect="coverflow" options={slideOpts}>
            {gameCards}
     </IonSlides>
  </IonContent> 
  
  );
    }

}

export default Main;