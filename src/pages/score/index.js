import React, {Component} from 'react';
import './index.scss'
class Score extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        countdown : this.props.seconds
      };
    }
  
    renderCountdown(){

      let minute = Math.floor(this.props.countdown / 60);
      let second = Math.floor(this.props.countdown % 60);
      
      return(
        <span>
          {this.pad(minute) + ":" + this.pad(second)}
        </span>
      )
    }

    pad(num){
      if (num < 10){
        return "0" + num;
      }
      return num;
    }

    render() {
      // Size of the enclosing square
      const sqSize = this.props.sqSize;
      // SVG centers the stroke width on the radius, subtract out so circle fits in square
      const radius = (this.props.sqSize - this.props.strokeWidth) / 2;
      // Enclose cicle in a circumscribing square
      const viewBox = `0 0 ${sqSize} ${sqSize}`;
      // Arc length at 100% coverage is the circle circumference
      const dashArray = radius * Math.PI * 2;
      // Scale 100% coverage overlay with the actual percent
      const dashOffset = dashArray - dashArray * this.props.percentage / 100;
      return(
<figure className="scorecard scorecard--normal scorecard--hover" style={{width:this.props.width ? this.props.width : "200px"}}>
  <figcaption className="scorecard__caption">
    <div className="scorecard__name">{this.renderCountdown()}</div>
    <table className="scorecard__stats">
      <tbody><tr>
        <th style={{fontWeight:500,color:"gray",fontSize:"1em",textAlign:"right"}}>Puan :</th>
        <td style={{fontWeight:500,fontSize:"1em"}}>{this.props.score}</td>
        </tr>
      <tr>
      <th style={{fontWeight:500,color:"gray",fontSize:"1em",textAlign:"right"}}>Yüzde :</th>
      <td style={{fontWeight:500,fontSize:"1em"}}>{this.props.percentage}%</td>
      </tr>
        </tbody></table>
    
    <div className="scorecard__abilities">
      <div className="scorecard__ability">
        <span className="scorecard__label">En uzun sözcük</span>
        <span className="scorecard__label">({this.props.longest.score} puan)</span>
        <span style={{textTransform:"uppercase"}}>{this.props.longest.w}</span>
      </div>
      <div className="scorecard__ability">
        <span className="scorecard__label">En yüksek puan</span>
        <span className="scorecard__label">({this.props.highestScore.score} puan)</span>
        <span style={{textTransform:"uppercase"}}>{this.props.highestScore.w}</span>
      </div>
    </div>   
  </figcaption>
</figure>        
      )
      return (
        <svg
            width={this.props.sqSize}
            height={this.props.sqSize}
            viewBox={viewBox}>
            <circle
              className="circle-background"
              cx={this.props.sqSize / 2}
              cy={this.props.sqSize / 2}
              r={radius}
              strokeWidth={`${this.props.strokeWidth}px`} />
            <circle
              className="circle-progress"
              cx={this.props.sqSize / 2}
              cy={this.props.sqSize / 2}
              r={radius}
              strokeWidth={`${this.props.strokeWidth}px`}
              // Start progress marker at 12 O'Clock
              transform={`rotate(-90 ${this.props.sqSize / 2} ${this.props.sqSize / 2})`}
              style={{
                strokeDasharray: dashArray,
                strokeDashoffset: dashOffset
              }} />
            <text
              className="circle-text"
              x="50%"
              y="50%"
              dy=".3em"
              textAnchor="middle">
              {`${this.props.score}`}
            </text>
            <text
              className="circle-ptext"
              x="50%"
              y="70%"
              dy=".9em"
              textAnchor="middle">
              {`${this.props.percentage}%`}
            </text>
        </svg>
      );
    }
  }
  
  Score.defaultProps = {
    sqSize: 200,
    percentage: 55,
    strokeWidth: 10
  }

export default Score;