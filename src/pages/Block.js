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
        switch(this.props.bonus) {
            case "tw" : bonus =  "Sx3"; color = "gray";  break;
            case "dw" : bonus =  "Sx2"; color = "gray"; break;
            case "tl" : bonus =  "Hx3"; color = "gray"; break;
            case "dl" : bonus =  "Hx2"; color="gray"; break;
            default : bonus = ""
        }
        
        return (
                <div onAnimationEnd={(e)=>this.props.onAnimationEnd()}
                 onTouchStart={(e)=>this.props.onTouchStart(e,this.props.line,this.props.col)} 
                 onTouchMove={(e)=>this.props.onMouseMove(e,this.props.line,this.props.col)}           
                
                 onMouseMove={(e)=>this.props.onMouseMove(e,this.props.line,this.props.col)} 
                 onMouseDown={(e)=>this.props.onTouchStart(e,this.props.line,this.props.col)} 
                 className={className} style={{width : (this.props.size - 2) + "px", height: (this.props.size - 2) + "px",left: this.props.col * this.props.size + 1 ,top : this.props.line * this.props.size + 1 }}>
                    <span className="letter" style={{fontSize:this.props.size * 0.7,color:color}}>{Config.alphabet[this.props.value]}</span> <span className="number" style={{fontSize:this.props.size * 0.2}}>{Config.scores[this.props.value]}</span>
                    <span className="bonus" style={{fontSize:"0.5em",fontWeight:550,color:color}}>{bonus}</span>
                </div>
        )
    }
}

export default Block;