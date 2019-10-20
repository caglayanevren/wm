import React from 'react';
import './index.css'

class RotateBtn extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        className : "material-icons"
      };
    }
    touched(){
      this.setState({
        className : "material-icons tapped"
      })
    }
    touchend(){
      this.setState({
        className : "material-icons"
      })
    }

    render() {
      return (
        <i style={this.props.style} className={this.state.className} onMouseUp={()=>this.touchend()} 
        onMouseLeave={()=>this.touchend()} 
        onMouseDown={()=>{this.touched();this.props.rotate()}}
        
        onTouchEnd={()=>this.touchend()} 
        onTouchStart={()=>{this.touched();this.props.rotate()}}
        >rotate_90_degrees_ccw</i>
      );
    }
  }


export default RotateBtn;