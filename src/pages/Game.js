import React, {Component,} from 'react';
import  { useState } from 'react';
import axios from 'axios';


//import {Button} from 'primereact/button';
import './Game.css';
import {Config} from './Config';
import Block from './Block';
import Score from './score'
import RotateBtn from './rotatebtn'
import Cards from './cards'
import {podium} from 'ionicons/icons'

import {power} from 'ionicons/icons'
import {home} from 'ionicons/icons'
import { IonPopover, IonTitle, IonButton,IonContent, IonIcon, IonItem, IonToolbar,IonButtons, IonHeader,IonAlert } from '@ionic/react';
import Storage from '../service/Storage';

//import {Button} from 'primereact/button';


export class Game extends Component {

    bag = [];
    touchList = [];
    score = 0;
    clearedLetterCount = 0;
    wordList = [];
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
    boardConfig = [["","","","","","","","","","dw"],
                   ["","dw","","","","","","","",""],
                   ["","","","","","tw","","","",""],
                   ["","","","","","","","","",""],
                   ["","","","tl","","","","","",""],
                   ["tw","","","","","","","","","tw"],
                   ["","","","","","","","","",""],
                   ["","","","","","","tl","","",""],
                   ["","dw","","","","","","","dw",""],
                   ["","","","dl","","","dl","","",""]]
    rotatedBoard = null;    
    storage = new Storage();
    constructor(props) {
        super(props);

        this.startDate = (this.props.startDate ? this.props.startDate : new Date());
        this.state = {
            id : Math.random().toString(36).substr(2, 9),
            startDate : this.startDate,
            board :this.board,
            size : props.size ? props.size : Config.size,
            score : this.score,
            clearedLetterCount : this.clearedLetterCount,
            wordList : this.wordList,
            currentWord:"",
            outList : [],
            showNetworkError : false,
            highestScore : {w:".",score:0},
            longest : {w:".",score:0},
            countdown : 180 - Math.ceil( ((new Date()).getTime() - this.startDate) / 1000 ),
            bonus:[]
        };
        
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onMouseMove = this.onMouseMove.bind(this);

        this.onTouchEnd = this.onTouchEnd.bind(this);
        this.onAnimationEnd = this.onAnimationEnd.bind(this);
        this.onOutAnimationEnd = this.onOutAnimationEnd.bind(this);
        this.onBonusAnimationEnd = this.onBonusAnimationEnd.bind(this)
        this.rotate = this.rotate.bind(this);

        for (var i = 0; i < Config.alphabet.length; ++i){
	    	
	    	var count = Config.counts[i];	    	
	    	for (var j = 0; j < count; ++j){
		    	this.bag.push(i);
	    	}
        }
        this.clock = setInterval(()=>{
            
            if (this.state.countdown === 0){
                this.status = 2;
                this.setState({showEndGame : true})

                clearInterval(this.clock);
                this.storage.saveGameState(this.state);
                this.calculateRating();
                return;
            }
            this.setState({
                countdown : this.state.countdown - 1                 
            })
        },1000)

    }


    rotate(){

        if (this.animationCount === 0 && this.state.clearedLetterCount === 0){
 
            this.animationRules = 0;
            this.animationCount = 0            
            this.rotatedBoard = [[null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null],
            [null,null,null,null,null,null,null,null,null,null]];     
            for (let line = 0; line < 10; ++line) {
                for (let col = 0; col < 10; ++col) { 
                    let dropTo = {l:9-col,c:line}                
                    
                    var rule =  '@keyframes anim' + line + '' + col + '{\
                        0%  {z-index:100;left :' + (col * this.state.size + 1) + 'px; top :' + (line * this.state.size + 1)  + 'px;}\
                        100% {z-index:100;left :' + (dropTo.c * this.state.size + 1) + 'px; top :' + (1 + dropTo.l * this.state.size) + 'px;}\
                    }';
                    this.board[line][col].anim = "styleAnim" + line + "" + col;
                    this.board[line][col].dropTo = dropTo

                    this.rotatedBoard[dropTo.l][dropTo.c] = {id: "" + dropTo.l + dropTo.c,val : this.board[line][col].val,touched : "",anim : null,dropTo : null};
                    
                    document.styleSheets[0].insertRule(rule);
                    this.animationRules++;
                    this.animationCount++;

                    rule = "." + this.board[line][col].anim + "{\
                        animation-name : anim" + line + col + ";\
                        animation-duration : 0.5s;\
                        animation-timing-function : ease-in;\
                        animation-fill-mode : forwards;\
                        animation-delay : " + 0.1 + "s;\
                    }";
                    document.styleSheets[0].insertRule(rule);
                    this.animationRules++;
                
                }
            }
            this.setState({
                board : this.board});        
        }
    } 


    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }
      
    coordinate = null;
    componentDidMount(){
        
        window.addEventListener("resize", this.resize.bind(this));
        
        window.addEventListener('selectstart', function(e){ e.preventDefault(); });
        for(var i = 0; i < 10; ++i){
            for(var j = 0; j < 10; ++j){
                let ind = this.getRandomInt(this.bag.length);
                this.board[i][j] = {id: "" + i + j,val : this.bag[ind],touched : "",anim : null};
                
                this.bag.splice(ind,1);
            }
        }
       
        this.setState({
            board : this.board
        });
        document.addEventListener("mouseup", this.onTouchEnd)
        document.addEventListener("touchend", this.onTouchEnd)
        
        //setTimeout(()=>{this.setValues();},8000);

        
        this.status = 0;
        this.resize();
    }

    updateScore(){
        var scoreDiff = this.score - this.state.score;
        var percDiff = this.clearedLetterCount - this.state.clearedLetterCount;
        var s = setInterval(()=>{
            if(scoreDiff > 0){
                this.setState({score : this.state.score + 1})
                scoreDiff--;
            }
            else{
                clearInterval(s);
            }
        },55);

        var p = setInterval(()=>{
            if(percDiff > 0){
                this.setState({clearedLetterCount : this.state.clearedLetterCount + 1})
                percDiff-= 1;
            }
            else{
                clearInterval(p);
            }
        },55);     
        this.setState({
            highestScore : this.highestScore,
            longest : this.longest,
            currentWord:""
        })   
        setTimeout(()=>{
            this.gravity();
        },10);

        
       // this.setState({
       //     score : this.score,clearedLetterCount : this.clearedLetterCount
        //})

    }

    getRealCoordinates(id){
        var offsets = document.getElementById(id).getBoundingClientRect();
        var top = offsets.top;
        var left = offsets.left;        
        return {x : left,y:top};
    }

    setValues(){
        for(var i = 0; i < this.animationRules; ++i){
            document.styleSheets[0].deleteRule(0);
        }

        this.animationRules = 0;  
        if (this.rotatedBoard != null){
            this.board = this.rotatedBoard;
            this.rotatedBoard = null;
        }
        else{
            for (i = 9; i > -1; --i) {
                for (var j = 0; j < 10; ++j) {
                    
                    if (this.board[i][j] != null){
                        this.board[i][j].anim = null;
                        if (this.board[i][j].dropTo != null){
                            let newLine = this.board[i][j].dropTo.l;
                            let newCol = this.board[i][j].dropTo.c    
                 
                            this.board[i][j].dropTo = null;

                            this.board[newLine][newCol] = this.board[i][j];                    
                            this.board[i][j] = null;
                        }

                    }
                }
            }
        }
        //console.log(this.board,"BOARD");
        this.setState({
            board : this.board
        });
        //setTimeout(()=>{this.storage.saveGameState(this.state)},100);
    }

    resize(){
        //Config.size = Math.floor((window.innerWidth - 40) / 10);
        //this.setState({size : Config.size});
        this.coordinate = this.getRealCoordinates("00");
        
    }

    process(word,desc,score,bonus){
        let outList = [];

        //if (this.wordList[0].score === 0){
        //    this.wordList.splice(0,1);
        //}
        this.wordList.push({word:word,desc:desc,score : score});

        for(const [ind,t] of this.touchList.entries()){
            let rule =  '@keyframes out' + t.l + '' + t.c + '{\
                0%  {z-index:100;left :' + (t.c * this.state.size + 1) + 'px; top :' + (t.l * this.state.size + 1)  + 'px;}\
                25%  {z-index:100;left :' + (t.c * this.state.size + 1) + 'px; top :' + ((t.l + 1) * this.state.size + 1)  + 'px; opacity:0.6;}\
                50%  {z-index:100;left :' + (t.c * this.state.size + 1) + 'px; top :' + ((t.l + 2) * this.state.size + 2)  + 'px; opacity:0.4;}\
                100% {z-index:100;left :' + (t.c * this.state.size + 1) + 'px; top :' + ((t.l + 4) * this.state.size + 1) + 'px;opacity:0}\
            }';
            outList.push({val:this.board[t.l][t.c].val,anim:"out" + t.l + "" + t.c,l:t.l,c:t.c})
                   
            document.styleSheets[0].insertRule(rule);                            

            rule = "." + "out" + t.l + "" + t.c + "{\
                animation-name : out" + t.l + t.c + ";\
                animation-duration : 1s;\
                animation-timing-function : linear;\
                animation-fill-mode : forwards;\
            }";
            document.styleSheets[0].insertRule(rule);
            if (ind === 0 && bonus.length > 0){
                if (t.c > 4){
                    rule =  '@keyframes bonusOut{\
                        0%  {z-index:500;visibility:visible;left :' + ((t.c) * this.state.size) + 'px; top :' + ((t.l) * this.state.size )  + 'px; opacity:0.9 }\
                        40%  {transform:rotateY(0deg);left :' + ((t.c) * this.state.size - 10) + 'px; top :' + ((t.l - 1) * this.state.size)  + 'px; opacity:1;}\
                        60%  {transform:rotateY(360deg);left :' + ((t.c) * this.state.size - 12) + 'px; top :' + ((t.l) * this.state.size)  + 'px; opacity:0.95;}\
                        80% {transform:rotateY(0deg);left :' + ((t.c) * this.state.size - 14) + 'px; top :' + ((t.l + 1) * this.state.size) + 'px;opacity:0.8}\
                        100% {transform:rotateY(360deg);left :' + ((t.c) * this.state.size - 16) + 'px; top :' + ((t.l + 2) * this.state.size) + 'px;opacity:0.4}\
                    }'
                }
                else{
                    rule =  '@keyframes bonusOut{\
                        0%  {z-index:100;visibility:visible;left :' + ((t.c) * this.state.size) + 'px; top :' + ((t.l) * this.state.size )  + 'px; opacity:0.9 }\
                        40%  {transform:rotateY(0deg);left :' + ((t.c) * this.state.size + 10) + 'px; top :' + ((t.l - 1) * this.state.size)  + 'px; opacity:1;}\
                        60%  {transform:rotateY(120deg);left :' + ((t.c) * this.state.size + 12) + 'px; top :' + ((t.l) * this.state.size)  + 'px; opacity:0.95;}\
                        80% {transform:rotateY(240deg);left :' + ((t.c ) * this.state.size + 14) + 'px; top :' + ((t.l + 1) * this.state.size) + 'px;opacity:0.8}\
                        100% {transform:rotateY(360deg);left :' + ((t.c ) * this.state.size + 16) + 'px; top :' + ((t.l + 2) * this.state.size) + 'px;opacity:0.4}\
                    }'
                }
                document.styleSheets[1].insertRule(rule);
            }

           

            this.board[t.l][t.c] = null;
                                    
        }
        this.setState({outList:outList,bonus:bonus});
        this.score += score;
        if (score > this.highestScore.score || (score === this.highestScore.score && word.length > this.highestScore.w.length)){
            this.highestScore = {w:word,score:score};
        }
        if (word.length > this.longest.w.length || (word.length === this.longest.w.length && score > this.longest.score)){
            this.longest = {w:word,score:score};
        }
        this.clearedLetterCount += this.touchList.length;
        this.touchList = [];
        this.updateScore();

    }

    onTouchEnd(){
        let  bonus = [];
        if (this.animationCount === 0){
            let word = "";
            let score = 0;
            if (this.touchList.length > 0){
                let wx = 1;
                for(const [,t] of this.touchList.entries()){
                    let ch = Config.alphabet[this.board[t.l][t.c].val];
                    word += ch;
                    let lx = 1;

                    if (this.boardConfig[t.l][t.c] != ""){
                        bonus.push(this.boardConfig[t.l][t.c]);
                    }
                    switch(this.boardConfig[t.l][t.c]){
                        case "tw" : wx *= 3; break;
                        case "dw" : wx *= 2; break;
                        case "tl" : lx = 3; break;
                        case "dl" : lx = 2; break;
                        default : lx = 1;
                    } 
                    score += lx * Config.scores[this.board[t.l][t.c].val];
                } 
                score *= wx;
                for(var i = 0; i < this.touchList.length; ++i){
                    this.board[this.touchList[i].l][this.touchList[i].c].touched = "";
                }
                
                if (word.length < 2 || this.status == 2){
                    
                    this.setState({
                        board : this.board,
                        currentWord : ""
                    }) 
                    this.touchList = [];
                    return;
                }
                else{
                    this.status = 1;
                    this.setState({
                        board : this.board
                    }) ;                    
                } 
                console.log("DICT  " + this.props.dictionary)
                if (!this.props.dictionary.isEmpty()){
                    let result = this.props.dictionary.lookup(word);
                    console.log(JSON.stringify(result));
                    if (this.status === 1)
                    this.status = 0;

                    if(result){
                        this.process(word,result,score,bonus);
                        
                    }
                    else{
                        this.touchList = [];
                        this.setState({currentWord:""})
                    }
                    return;
                }
                //axios({method: 'post',url: 'http://localhost:8080/lookup',data: {word : word},timeout:3000
                axios({method: 'post',url: 'http://harfiyat.azurewebsites.net/lookup',data: {word : word},timeout:3000
                }).then(obj => {
                    if (this.status === 1)
                        this.status = 0;
                    if (obj.data){    
                        this.process(obj.data.id,obj.data.desc,score,bonus);
                    }
                    else{
                        this.touchList = [];
                        this.setState({currentWord:""})
                    }

                }).catch(e => {
                    if (this.status === 1)
                        this.status = 0;
                    console.log("ERRORRR  -->" + e);
                    this.setState({showNetworkError:true,currentWord:""});
                    this.touchList = [];
                    
                                      
                })                

            }
        }
        
    }

    onTouchStart(e,l,c) {

        if (this.animationCount === 0 && this.touchList.length === 0){
            this.board[l][c].touched = " touched";
            this.touchList.push({l:l,c:c});
            let w = this.state.currentWord;
            if (w.length < 20)
                w = w + Config.alphabet[this.board[l][c].val]
            this.setState({
                board : this.board,
                currentWord : w
            })
        }
        //this.setValues();
        
    }

    isNeghbour(last,current){
        if (Math.abs(current.l - last.l) < 2 && Math.abs(current.c - last.c) < 2){
            return true;
        }
        return false;
    }

    isInTouchList(current){
        for(var i = 0; i < this.touchList.length; ++i){
            if(this.touchList[i].l === current.l &&  this.touchList[i].c === current.c){                
                return i;
            }
        }   
        return -1;
    }

    onMouseMove(e,l,c){
        this.resize();
        if (this.status !== 0){
           
            return;
        }

        let currentWord = this.state.currentWord;
        if (this.touchList.length > 0){

            if (e.touches){
                let touch = e.touches[0];
                let dx = touch.clientX - this.coordinate.x;
                let dy = touch.clientY - this.coordinate.y;
                let rx = dx % this.state.size;
                let ry = dy % this.state.size;


                if ((rx > 5 && rx < (this.state.size - 5)) && (ry > 5 && ry < (this.state.size - 5))){
                    c = Math.floor(dx / this.state.size);
                    l = Math.floor(dy / this.state.size);
                }
                else return;
            }
            else{
                
                let dx = e.clientX - this.coordinate.x;
                let dy = e.clientY - this.coordinate.y;
                let rx = dx % this.state.size;
                let ry = dy % this.state.size;
                //console.log("rXY " + rx + " " + ry)
                //console.log("dXY " + dx + " " + dy)
                if ((rx > 5 && rx < (this.state.size - 5)) && (ry > 5 && ry < (this.state.size - 5))){
                    c = Math.floor(dx / this.state.size);
                    l = Math.floor(dy / this.state.size);
                }
                else return;
                //console.log("XY " + c + " " + l)
               
            }
            if (l > 9 || c > 9){
                return
            }
            var last = this.touchList[this.touchList.length - 1];
            let prev = this.isInTouchList({l:l,c:c});
            if (prev > -1){
                
                let length = this.touchList.length - 1;

                for(let i = length; i > prev; --i){
                    last = this.touchList[i];
                    this.board[last.l][last.c].touched = "";
                    this.touchList.pop();
                    currentWord = currentWord.substr(0,currentWord.length - 1);   
                }
               
                this.setState({
                    board : this.board,currentWord : currentWord
                });
                return;
            }
            if (!this.isNeghbour(last,{l:l,c:c})){
                return;
            }

            this.touchList.push({l:l,c:c});  
            if (currentWord.length < 20)
                currentWord = currentWord + Config.alphabet[this.board[l][c].val]
            this.board[l][c].touched = " touched"; 
            this.setState({
                board : this.board,
                currentWord : currentWord
            });
                                
        }
        
    }
    pad(num){
      if (num < 10){
        return "0" + num;
      }
      return num;
    }

    renderBonus(r,c){
        let tw = <div style={{display:"table-cell",verticalAlign:"middle",fontSize:".7em"}}>Sx3</div>
        let dw = <div style={{display:"table-cell",verticalAlign:"middle",fontSize:".7em"}}>Sx2</div>
        let tl = <div style={{display:"table-cell",verticalAlign:"middle",fontSize:".7em"}}>Hx3</div>
        let dl = <div style={{display:"table-cell",verticalAlign:"middle",fontSize:".7em"}}>Hx2</div>

        switch(this.boardConfig[r][c]) {
            case "tw" : return tw;
            case "dw" : return dw;
            case "tl" : return tl;
            case "dl" : return dl;
            default : return "";
        }
    }
    finish(hide){
        this.setState({showAlert1 : false,showAlert2:false})               
        clearInterval(this.clock);
        this.status = 2;
        this.storage.saveGameState(this.state);
        this.calculateRating();

    }
    render() {
       
        const cells = [];
        const outs = [];
        let bonusAnim = [];
        let rotateBtn = null;

        if (this.state.clearedLetterCount === 0 && this.status === 0){
            rotateBtn = <RotateBtn style={{zIndex:1000,top:"-22px"}} rotate={this.rotate}/>; 
        }
        for (const [i,o] of this.state.outList.entries()) {
            outs.push(
                <div key={"out" + i} onAnimationEnd={(e)=>this.onOutAnimationEnd()}
                 className={"block " + o.anim} style={{zIndex:-100,width : (this.state.size - 4) + "px", height: (this.state.size - 4) + "px",left: o.c * this.state.size + 1,top : o.l * this.state.size + 1}}>                   
                    <span className="letter" style={{fontSize:this.state.size * 0.55}}>{Config.alphabet[o.val]}</span> <span className="number" style={{fontSize:this.state.size * 0.16}}>{Config.scores[o.value]}</span>
                    
                </div>
               
            )
        }
        for(const[i,b] of this.state.bonus.entries()){
            let svg = "sx3.svg";
            switch(b){
                case "tw" : svg = "sx3.svg";break;
                case "dw" : svg = "sx2.svg";break;
                case "tl" : svg = "hx3.svg";break;
                case "dl" : svg = "hx2.svg";break;
                default : svg = "";
                
            }
            if (i === this.state.bonus.length - 1){
                bonusAnim.push(<div key={i} className="bonusAnim" onAnimationEnd={this.onBonusAnimationEnd} style={{visibility:"hidden",animationDelay: (i + 1) * 0.2 + "s"}}><img src={"assets/" + svg} style={{opacity:"inherit"}}></img></div>)
            }
            else{
                bonusAnim.push(<div key={i} className="bonusAnim" style={{visibility:"hidden",animationDelay: (i + 1) * 0.2 + "s"}}><img src={"assets/" + svg} style={{opacity:"inherit"}}></img></div>)                
            }
        }
        for (const [r, row] of this.state.board.entries()) {
            for (const [c,cell] of row.entries()) {
                cells.push(<div id={r + "" + c} key={r + " " + c} className={"cell " + this.boardConfig[r][c]} style={{width : this.state.size + "px", height: this.state.size + "px",left: c * this.state.size,top : r * this.state.size}}>
                   {this.renderBonus(r,c)}
                </div>)

                if (cell != null && cell.val != null){   
        
                    cells.push(
                        <Block
                        bonus = {this.boardConfig[r][c]}
                        onMouseMove={this.onMouseMove} onTouchStart={this.onTouchStart} onAnimationEnd={this.onAnimationEnd}
                        key={"" + r + c} value={cell.val} line={r} col={c} anim={cell.anim} size={this.state.size} 
                        touched={cell.touched}/>
                    )
                }
            }

        }

        return (
                <IonContent scrollY={false} style={{background : "url('/assets/paper.jpg')"}} className="something">
<IonHeader>
      <IonToolbar color="gold">
        <IonButtons slot="secondary">
          <IonButton  fill="outline" onTouchEnd={()=>{if (this.status === 2) {this.props.back()} else this.setState({showAlert2:true})}} onClick={()=>{if (this.status === 2) this.props.back(); else this.setState({showAlert2:true})}}>
            <IonIcon slot="icon-only" icon={home} />
          </IonButton>
        </IonButtons>

        <IonTitle></IonTitle>

        <IonButtons slot="secondary">
          {(this.status < 2 ?             
          <IonButton  fill="outline" onTouchEnd={()=>{this.setState({showAlert1:true})}} onClick={()=>{this.setState({showAlert1:true})}}>
            <IonIcon slot="icon-only" icon={power} />
          </IonButton> : "")}
        </IonButtons>
      </IonToolbar>
    </IonHeader>                    
                    
<IonAlert
          isOpen={this.state.showAlert1}
          backdropDismiss={false}
          onDidDismiss={() => this.setState({showAlert1 : false})}
          header={'Onaylayınız'}
          message={'Oyunu bitirmek istediğinize emin misiniz ?'}
          buttons={[
            {
              text: 'İptal',
              role: 'cancel',
              cssClass: 'primary',
              handler: blah => {
                console.log('Confirm Cancel: blah');
              }
            },
            {
              text: 'Tamam',
              handler: () => {
                this.finish();
              }
            }
          ]}/>                    

<IonAlert
          isOpen={this.state.showAlert2}
          backdropDismiss={false}
          onDidDismiss={() => this.setState({showAlert2 : false})}
          header={'Onaylayınız'}
          message={'Oyununuz sonlandırılacaktır,Ana Sayfaya dönmek istiyor musunuz ? '}
          buttons={[
            {
              text: 'İptal',
              role: 'cancel',
              cssClass: 'primary',
              handler: blah => {
                console.log('Confirm Cancel: blah');
              }
            },
            {
              text: 'Tamam',
              handler: () => {
               
                this.finish();
                setTimeout(()=>this.props.back(),200);
                
              }
            }
          ]}/>                    

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

                        <IonAlert isOpen={this.state.showNetworkError} backdropDismiss={true}
                            onDidDismiss={() => this.setState({showNetworkError : false})}
                            header={'Bir sorun var'}
                            message={'Sunucu ile bağlantı kurulamıyor, Internet erişiminiz kontrol ediniz'}
                            buttons={[
                                {
                                text: 'Tamam',
                                role: 'cancel',
                                cssClass: 'primary',
                                handler: blah => {
                                }
                                },
                            ]}
                            />               
                <div style={{width:"100%",textAlign:"center"}}>
                
                <div><Score countdown={this.state.countdown} longest={this.state.longest} highestScore={this.state.highestScore} score={this.state.score} percentage={this.state.clearedLetterCount} width={(this.state.size * 10 - 10) + "px"}/></div>
                <div>
                <div className="rack" style={{display:"inline-block",width:this.state.size * 10}}><div>&nbsp;{this.state.currentWord}</div></div>
                </div>
                <div>
                    <div id="box-table-b" style={{display:"inline-block",width:this.state.size * 10,height : this.state.size * 10,textAlign:"center !important"}} >
                    {rotateBtn}
                        {cells}   
                        {outs}   
                        {bonusAnim}                  
                    </div>
                </div>
                <div>
                    <Cards list={this.state.wordList} width={(this.state.size * 10 - 10) + "px"}/>
                </div>
                </div>

                    
                </IonContent>
        )
    }


    animationRules = 0;
    animationCount = 0;
    gravity(){
        this.animationRules = 0;
        this.animationCount = 0;

        var delay = 0.05;
        var dropLevel = null;
        for(var c = 0; c < 10; ++c){
            dropLevel = null;
            delay = 0.05;
            for(var l = 9; l > -1; --l){
               
                if (this.board[l][c] === null){
                    if (dropLevel === null){
                        dropLevel = {l:l,c:c};

                    }
                }
                else if (dropLevel != null) {
                    delay = delay + 0.05;
                    var rule =  '@keyframes anim' + l + '' + c + '{\
                        0%  {z-index:100;left :' + (c * this.state.size + 1) + 'px; top :' + (l * this.state.size + 1)  + 'px;}\
                        100% {z-index:100;left :' + (c * this.state.size + 1) + 'px; top :' + (1 + dropLevel.l * this.state.size) + 'px;}\
                    }';

                    this.board[l][c].anim = "styleAnim" + l + "" + c;
                    this.board[l][c].dropTo = {l:dropLevel.l,c:dropLevel.c}; 
                    
                    document.styleSheets[0].insertRule(rule);
                    this.animationRules++;
                    this.animationCount++;
                    let duration = 1.5 * (dropLevel.l - l) / 10
                    rule = "." + this.board[l][c].anim + "{\
                        animation-name : anim" + l + c + ";\
                        animation-duration :" + duration +  "s;\
                        animation-timing-function : ease-in;\
                        animation-fill-mode : forwards;\
                        animation-delay : " + delay + "s;\
                    }";
                    document.styleSheets[0].insertRule(rule);
                    this.animationRules++;
                    dropLevel.l = dropLevel.l - 1; 
                }
            }
        }
        this.setState({
            board : this.board,
            wordList : this.wordList
        });
    }
    onAnimationEnd(){
        if(this.animationCount > 0){
            this.animationCount--;

            if (this.animationCount === 0){
                this.setValues();
            }            
        }
    }
    onOutAnimationEnd(){

        
        for(const[,o] of this.state.outList.entries()){
            document.styleSheets[0].deleteRule(0);
            document.styleSheets[0].deleteRule(0);
        }
        this.setState({outList:[]});

    }
    onBonusAnimationEnd(){
        if (this.state.bonus.length > 0){
            
            document.styleSheets[1].deleteRule(0);
        }
        this.setState({bonus:[]});
    }
    
    calculateRating(){
        let profile = this.storage.getProfile();
        let rating = profile.rating;
        let num = profile.numberOfGames;
        if (num === 0){
            num++;
            rating = Math.ceil(this.state.score * this.state.clearedLetterCount / 100);
        }
        else{
            rating = Math.ceil(((rating * num) + (this.state.score * this.state.clearedLetterCount / 100)) / (num + 1));
            num++;
        }
        profile.rating = rating;
        profile.numberOfGames = num;
        localStorage.setItem("profile",JSON.stringify(profile));

    }


}

export default Game;