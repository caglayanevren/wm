import React, {Component,} from 'react';

import './Game.css';
import {Config} from './Config';
import Block from './Block';
import Score from './score'
import Cards from './cards'
import {podium} from 'ionicons/icons'
import {home} from 'ionicons/icons'
import { IonPopover, IonTitle, IonButton,IonContent, IonIcon, IonItem, IonToolbar,IonButtons, IonHeader } from '@ionic/react';
import Storage from '../service/Storage';


export class GameView extends Component {

    bag = [];
    touchList = [];
    score = 0;
    clearedLetterCount = 0;
    wordList = [{word:".",score:0,desc:"."}];
    status = 1;
    highestScore = {w:".",score:0};
    longest = {w:".",score:0};
    startDate = new Date();
    clock = 0;
    
    board = [[null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null]];
    boardConfig = [["tw","","","dl","","","dl","","","tw"],
                   ["","","","","","","","","dw",""],
                   ["","","","dw","","dl","","dw","",""],
                   ["","tl","","","","","","","tl",""],
                   ["","","","",4,"","","","",""],
                   ["","tl","","","","dl","","","tl",""],
                   ["","","","","","","","","",""],
                   ["","","dw","","","dl","","dw","",""],
                   ["","","","","","","","","",""],
                   ["tw","","","dl","","","dl","","","tw"]]
    rotatedBoard = null;    
    storage = new Storage();
    constructor(props) {
        super(props);
        console.log(JSON.stringify(this.props.state))
        this.status = 2;
        this.state = {
            id : this.props.state.id,
            startDate : this.props.state.startDate,
            board :this.props.state.board,
            size : Config.size,
            score : this.props.state.score,
            clearedLetterCount : this.props.state.clearedLetterCount,
            wordList : this.props.state.wordList,
            currentWord:"",
            outList : [],
            showNetworkError : false,
            highestScore : this.props.state.highestScore,
            longest : this.props.state.longest,
            countdown : this.props.state.countdown,
            showEndGame : true
        };
    }

    initializeViewOnly(){

    }

      
    coordinate = null;
    componentDidMount(){
        
        window.addEventListener("resize", this.resize.bind(this));
        
        window.addEventListener('selectstart', function(e){ e.preventDefault(); });
        this.resize();
    }


    getRealCoordinates(id){
        var offsets = document.getElementById(id).getBoundingClientRect();
        var top = offsets.top;
        var left = offsets.left;        
        return {x : left,y:top};
    }


    resize(){
        //Config.size = Math.floor((window.innerWidth - 40) / 10);
        //this.setState({size : Config.size});
        this.coordinate = this.getRealCoordinates("00");
        
    }


    pad(num){
      if (num < 10){
        return "0" + num;
      }
      return num;
    }

    renderBonus(r,c){
        let tw = <div style={{display:"table-cell",verticalAlign:"middle"}}>Sx3</div>
        let dw = <div style={{display:"table-cell",verticalAlign:"middle"}}>Sx2</div>
        let tl = <div style={{display:"table-cell",verticalAlign:"middle"}}>Hx3</div>
        let dl = <div style={{display:"table-cell",verticalAlign:"middle"}}>Hx2</div>

        switch(this.boardConfig[r][c]) {
            case "tw" : return tw;
            case "dw" : return dw;
            case "tl" : return tl;
            case "dl" : return dl;
            default : return "";
        }
    }
    render() {
       
        const cells = [];
        const outs = [];
        let rotateBtn = null;

        for (const [r, row] of this.state.board.entries()) {
            for (const [c,cell] of row.entries()) {
                cells.push(<div id={r + "" + c} key={r + " " + c} className={"cell " + this.boardConfig[r][c]} style={{width : this.state.size + "px", height: this.state.size + "px",left: c * this.state.size,top : r * this.state.size}}>
                   {this.renderBonus(r,c)}
                </div>)

                if (cell != null && cell.val != null){   
        
                    cells.push(
                        <Block
                        bonus = {this.boardConfig[r][c]}
                        key={"" + r + c} value={cell.val} line={r} col={c}  size={this.state.size} />
                    )
                }
            }

        }

        return (
                <IonContent scrollY={false} >
<IonHeader>
      <IonToolbar color="gold">
        <IonButtons slot="secondary">
          <IonButton  fill="outline">
            <IonIcon slot="icon-only" icon={home}/>
          </IonButton>
        </IonButtons>

        <IonTitle></IonTitle>
      </IonToolbar>
    </IonHeader>                    
                    <IonPopover
                        isOpen={this.state.showEndGame}
                        onDidDismiss={e => this.setState({showEndGame:false})}>

                                <IonItem>
                                    <IonIcon icon={podium} slot="start" />
                                    <span style={{fontWeight:500}}>Oyun Sonu</span>
                                    
                                </IonItem>

                                
                                    <div style={{width:"100%",padding:"10px"}}>
                                    <div style={{display:"inline-block",color:"gray",width:"60%"}}>Kalan Süre</div><div style={{fontWeight:490,display:"inline-block"}}>: {this.pad(Math.floor(this.state.countdown / 60))}:{this.pad(this.state.countdown % 60)}</div><br/>
                                    <div style={{display:"inline-block",color:"gray",width:"60%"}}>Puan</div><div style={{fontWeight:490,display:"inline-block"}}>: {this.state.score}</div><br/>
                                    <div style={{display:"inline-block",color:"gray",width:"60%"}}>Toplanan Harf</div><div style={{fontWeight:490,display:"inline-block"}}>: {this.state.clearedLetterCount}</div>
                                    </div>
                                    <br/>
                                    <div style={{textAlign:"center"}}><IonButton onClick={e=>this.setState({showEndGame : false})} size="small" fill="outline" color="primary">Kapat</IonButton></div>                                        
                        </IonPopover>

               

                <div style={{width:"100%",textAlign:"center"}}>
                
                <div><Score countdown={this.state.countdown} longest={this.state.longest} highestScore={this.state.highestScore} score={this.state.score} percentage={this.state.clearedLetterCount} width={(this.state.size * 10 - 10) + "px"}/></div>
                <div>
                <div className="rack" style={{display:"inline-block",width:this.state.size * 10}}><div>&nbsp;{this.state.currentWord}</div></div>
                </div>
                <div>
                    <div id="box-table-b" style={{display:"inline-block",width:this.state.size * 10,height : this.state.size * 10,textAlign:"center !important"}} >

                        {cells}   

                    </div>
                </div>
                <div>
                    <Cards list={this.state.wordList} width={(this.state.size * 10 - 10) + "px"}/>
                </div>
                </div>

                    
                </IonContent>
        )
    }


    
    calculateScore(){

    }


}

export default GameView;