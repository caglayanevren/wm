import React, {Component,} from 'react';


import { IonAvatar,IonLoading,IonPopover,IonTitle,IonButton,IonIcon, IonContent,IonItem,IonButtons, IonHeader,IonToolbar} from '@ionic/react';
import Storage from '../service/Storage';
import { GoogleLogin } from 'react-google-login';
import Game from './Game';
import GameView from './GameView';
import Config from './Config'

import './Main.scss';
import {stats} from 'ionicons/icons'

import axios from 'axios';
import { initDB } from 'react-indexed-db';
import { useIndexedDB } from 'react-indexed-db';
import Dictionary from '../service/Dictionary';


export class Main extends Component {
    gameList = []; 
    selectedGame = null;   
    storage = null;
    dictionary = null;
    constructor(props) {
        super(props);      
        this.storage = new Storage();
        this.gameList = this.storage.getGames();
        if (this.gameList != null && this.gameList.length > 4)
          this.gameList.splice(3,this.gameList.length - 4)
        this.openGameView = this.openGameView.bind(this);
        this.openHomeView = this.openHomeView.bind(this);
        this.state = {
          showLoading : false,
          showStats : false,
          pageIndex : 0,
          selectedGame : null,
          gameList : this.gameList,
          profile : this.props.profile
      }
      this.dictionary = new Dictionary();



      let dbConfig = {
        name: 'DB',
        version: 1,
        objectStoresMeta: [
          {
            store: 'dictionary',
            storeConfig: { keyPath: 'id', autoIncrement: false },
            storeSchema: [
              { name: 'list', keypath: 'list', options: { unique: false } },
            ]
          }
        ]
      };      
      initDB(dbConfig);
      const { add } = useIndexedDB('dictionary');
      const { getAll } = useIndexedDB('dictionary');
      this.getAll = getAll.bind(this);
      this.getAll().then(dict=>{
        if (dict.length === 0){
          this.setState({showLoading:true})
          axios({method: 'post',url: 'http://wordminer-env.x7krybgsc3.us-west-2.elasticbeanstalk.com/dict',timeout:60000}).then(obj => { add({id:0,list:obj.data}).then(()=>this.setState({showLoading:false})); this.dictionary.entries = obj.data}).catch((e)=>{ this.setState({showLoading:false})})
        }
        else{
            this.dictionary.entries = dict[0].list;
        }
      })       
  

    }

    openHomeView(){
      this.gameList = this.storage.getGames();
      if (this.gameList != null && this.gameList.length > 4)
        this.gameList.splice(3,this.gameList.length - 4)

      this.setState({
        pageIndex:0,
        gameList : this.gameList,

        profile : this.storage.getProfile()
      });
    }
    openGame(){
      let size = Math.floor(window.innerWidth / 10);
      if (window.innerWidth <= 400){
        size = 35;
      }
      else if (window.innerWidth >= 600){
        size = 60;
      }
      Config.size = size;
      this.setState({
        pageIndex : 1
      })
    }
    openGameView(i){
      let size = Math.floor(window.innerWidth / 10);
      if (window.innerWidth <= 400){
        size = 35;
      }
      else if (window.innerWidth >= 600){
        size = 60;
      }
      Config.size = size;
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
      return(<IonContent scrollY={false} fullscreen={true}><Game back={this.openHomeView} dictionary={this.dictionary}/></IonContent>)
    }
    renderGameView(){
      return(<IonContent scrollY={false} fullscreen={true}><GameView back={this.openHomeView} state={this.state.selectedGame}/></IonContent>)
    }
    renderMain(){
        let gameCards = [];
        let classes =["clash-card__unit-stats--goblin","clash-card__unit-stats--barbarian","clash-card__unit-stats--giant","clash-card__unit-stats--archer","clash-card__unit-stats--wizard"];
        let options = {  year: 'numeric', month: 'long', day: 'numeric',hour:'numeric',minute:'numeric' };
        let fab = <ion-fab size="large" vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button color="light"  onClick={()=>this.openGame()}>
          <ion-icon src="assets/mining.svg"></ion-icon>
        </ion-fab-button>
      </ion-fab> ;
       
        if (this.state.gameList.length === 0){

          fab = null;  
          gameCards.push(<div key={0} style={{fontFamily:"Roboto",color:"gray",height:"100%",width:"100%",textAlign:"center",fontSize:"2em"}}>
            <div style={{margin:"30% auto",width:"90%"}}><ion-button onClick={()=>this.openGame()} size="large" expand="block" color="light"><ion-icon slot="start" src="/assets/mining.svg"></ion-icon>Oynamaya Başlayın</ion-button></div></div>);
        }     
        else 
          for(const[i,g] of this.state.gameList.entries()){
            gameCards.push(
              <ion-card color="light" button key={i} onClick={()=>this.openGameView(i)}>
              <ion-card-header>
                <ion-card-subtitle><span style={{fontSize:"1.4em"}}>{new Date(g.startDate).toLocaleDateString('tr-TR', options)}</span></ion-card-subtitle>
              </ion-card-header>
              <ion-card-content>
              <div className={"clash-card__unit-stats "  + classes[i] + " clearfix"}>
                            <div className="one-third">
                              <div className="stat">{g.clearedLetterCount}%</div>
                              <div className="stat-value">Yüzde</div>
                            </div>
                            <div className="one-third">
                              <div className="stat">{g.score}</div>
                              <div className="stat-value">Puan</div>
                            </div>              
                            <div className="one-third no-border">
                              <div className="stat">{Math.floor(g.score * g.clearedLetterCount / 100)}</div>
                              <div className="stat-value">Seviye</div>
                            </div>
                          </div>
              </ion-card-content>
          </ion-card>  

                
            )
        }

        return(<IonContent scrollY={true} fullscreen={true}>
          <IonPopover isOpen={this.state.showStats} onDidDismiss={e => this.setState({showStats:false})}>
                                          <IonItem>
                                              <IonIcon icon={stats} slot="start" />
                                              <span style={{fontWeight:500}}>İstatistikler</span>
                                              
                                          </IonItem>

                                          
                                          <div style={{width:"100%",padding:"10px"}}>
                                        <div style={{display:"inline-block",color:"gray",width:"60%"}}>Toplam Oyun</div><div style={{fontWeight:490,display:"inline-block"}}>: {this.state.profile.numberOfGames}</div><br/>
                                        <div style={{display:"inline-block",color:"gray",width:"60%"}}>Seviye</div><div style={{fontWeight:490,display:"inline-block"}}>: {this.state.profile.rating}</div><br/>
                                              <br/>
                                              <div style={{textAlign:"center"}}><IonButton onClick={e=>this.setState({showStats : false})} size="small" fill="outline" color="primary">Kapat</IonButton></div>                                        
                                        </div>
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
                {gameCards}            

              <ion-grid>
                <ion-row>
                  
                </ion-row>
              </ion-grid>
              {fab}              
              <IonLoading
                isOpen={this.state.showLoading}
                onDidDismiss={() => this.setState({showLoading:false})}
                message={'Sözlük güncelleniyor...'}
                duration={5000}
              />     
            </IonContent>        
            );
    }

}

export default Main;