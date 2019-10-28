import React, {Component,} from 'react';


import { IonAvatar,IonPopover,IonTitle,IonButton,IonIcon, IonContent,IonItem,IonButtons, IonHeader,IonToolbar} from '@ionic/react';
import Storage from '../service/Storage';
import { GoogleLogin } from 'react-google-login';
import Game from './Game';
import GameView from './Game';

import './Main.scss';
import {stats} from 'ionicons/icons'
import {add} from 'ionicons/icons'



export class Main extends Component {
    gameList = []; 
    selectedGame = null;   
    constructor(props) {
        super(props);
        this.state = {
            showStats : false,
            pageIndex : 0,
            selectedGame : null
        }
        let storage = new Storage();
        this.gameList = storage.getGames().reverse();
        this.gameList.splice(5,this.gameList.length - 5)
        this.openGameView = this.openGameView.bind(this);
    }
    openGameView(i){

      this.setState({
        pageIndex : 2,
        selectedGame : this.gameList[i]
      })
    }
    render(){
      switch(this.state.pageIndex){
        case 0 : return this.renderMain(); break;
        case 1 : return this.renderGame(); break;
        case 2 : return this.renderGameView(); break;
        default : return this.renderMain();
      }
    }
    renderGame(){
      return(<IonContent scrollY={false} fullscreen={true}><Game/></IonContent>)
    }
    renderGameView(){
      return(<IonContent scrollY={false} fullscreen={true}><GameView state={this.selectedGame}/></IonContent>)
    }
    renderMain(){
        let gameCards = [];
        let options = {  year: 'numeric', month: 'long', day: 'numeric' };
        const slideOpts = {
            initialSlide: 1,
            speed: 400,
          };        
        for(const[i,g] of this.gameList.entries()){
            gameCards.push(
                <ion-col size="6">
                <div className="wrapper">
                  <div className="clash-card barbarian">
              
                    <div className="clash-card__level clash-card__level--barbarian">{new Date(g.startDate).toLocaleDateString('tr-TR', options)}</div>

                    <div className="clash-card__unit-description">
                    <IonButton shape="round" fill="outline" size="small" color="medium" onClick={this.openGameView}>
                        Göz at
                    </IonButton>
                    </div>
              
                    <div className="clash-card__unit-stats clash-card__unit-stats--barbarian clearfix">
                      <div className="one-third">
                        <div className="stat">{g.clearedLetterCount}%</div>
                        <div className="stat-value">Yüzde</div>
                      </div>
                      <div className="one-third">
                        <div className="stat">{g.score}</div>
                        <div className="stat-value">Puan</div>
                      </div>              
                      <div className="one-third no-border">
                        <div className="stat">{g.score}</div>
                        <div className="stat-value">Puan</div>
                      </div>
                    </div>
              
                  </div> 
                </div>
                </ion-col>
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
              <IonToolbar  color="gold" mode="md">
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
              <ion-grid>
                <ion-row>
                  {gameCards}
                </ion-row>
              </ion-grid>
              <ion-fab vertical="bottom" horizontal="end" slot="fixed">
    <ion-fab-button>
      <IonIcon icon={add} onclick={()=>this.setState({pageIndex:1})}></IonIcon>
    </ion-fab-button>
  </ion-fab>              
            </IonContent>               
            );
    }

}

export default Main;