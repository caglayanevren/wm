import React, {Component} from 'react';
//import {Button} from 'primereact/button';
import {Config} from './Config'
export class Block extends Component {
  
    constructor(props) {
        super(props);
    }


    render() {
        var className = "block " + (this.props.anim != null ? this.props.anim : "") + this.props.touched;


        return (
                <div onAnimationEnd={(e)=>this.props.onAnimationEnd()}
                 onTouchStart={(e)=>this.props.onTouchStart(e,this.props.line,this.props.col)} 
                 onTouchMove={(e)=>this.props.onMouseMove(e,this.props.line,this.props.col)}           
                
                 onMouseMove={(e)=>this.props.onMouseMove(e,this.props.line,this.props.col)} 
                 onMouseDown={(e)=>this.props.onTouchStart(e,this.props.line,this.props.col)} 
                 className={className} style={{width : (this.props.size - 4) + "px", height: (this.props.size - 4) + "px",left: this.props.col * this.props.size + 2,top : this.props.line * this.props.size + 2}}>
                    <span className="letter" style={{fontSize:this.props.size * 0.7}}>{Config.alphabet[this.props.value]}</span> <span className="number" style={{fontSize:this.props.size * 0.2}}>{Config.scores[this.props.value]}</span>
                </div>
        )
    }
}

export default Block;