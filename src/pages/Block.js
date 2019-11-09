import React, {Component} from 'react';
//import {Button} from 'primereact/button';
import {Config} from './Config'
export class Block extends Component {
  
    constructor(props) {
        super(props);
    }


    render() {
        var className = "block " + (this.props.anim != null ? this.props.anim : "") + this.props.touched;

        let bonus = "";
        let color = "";
        let lx = 1;
        switch(this.props.bonus) {
            case "tw" : bonus =  "Sx3"; color = "darkgreen";  break;
            case "dw" : bonus =  "Sx2"; color = "darkgreen"; break;
            case "tl" : bonus =  "Hx3"; lx = 3; color = "#E0E0E0"; break;
            case "dl" : bonus =  "Hx2"; lx = 2; color="#E0E0E0"; break;
            default : bonus = ""
        }
        if (this.props.view){
            return(
            <div  className={className} style={{width : (this.props.size - 2) + "px", height: (this.props.size - 2) + "px",left: this.props.col * this.props.size + 1 ,top : this.props.line * this.props.size + 1 }}>
               <span className="letter" style={{fontSize:this.props.size * 0.7,color:color}}>{Config.alphabet[this.props.value]}</span> <span className="number" style={{fontSize:this.props.size * 0.2}}>{lx * Config.scores[this.props.value]}</span>
               <span className="bonus" style={{fontSize:"0.5em",fontWeight:500,color:color}}>{bonus}</span>
           </div>)
        }
        return (
                <div onAnimationEnd={(e)=>this.props.onAnimationEnd()}
                 onTouchStart={(e)=>this.props.onTouchStart(e,this.props.line,this.props.col)} 
                 onTouchMove={(e)=>this.props.onMouseMove(e,this.props.line,this.props.col)}           
                
                 onMouseMove={(e)=>this.props.onMouseMove(e,this.props.line,this.props.col)} 
                 onMouseDown={(e)=>this.props.onTouchStart(e,this.props.line,this.props.col)} 
                 className={className} style={{width : (this.props.size - 2) + "px", height: (this.props.size - 2) + "px",left: this.props.col * this.props.size + 1 ,top : this.props.line * this.props.size + 1 }}>
                    <span className="letter" style={{fontSize:this.props.size * 0.7,color:color}}>{Config.alphabet[this.props.value]}</span> <span className="number" style={{fontSize:this.props.size * 0.3,color : (lx > 1 ? "white" : "black")}}>{Config.scores[this.props.value] * lx}</span>
                    <span className="bonus" style={{fontSize:"0.6em",fontWeight:450,color:color}}>{bonus}</span>
                </div>
        )
    }
}

export default Block;