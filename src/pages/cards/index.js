import React, {Component} from 'react';

import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export class Cards extends Component {
    list = [];
    current = 0;
    constructor(props) {
        super(props);
        this.state = {
          list : this.list
        }
    }
    jsonCopy(src) {
      return JSON.parse(JSON.stringify(src));
    }
    componentDidMount() {
    }
    componentDidUpdate (){
      
      if (this.props.list.length  > this.state.list.length){
        this.setState({
          list :  this.props.list.slice(0,this.props.list.length) 
        })
        this.slider.slickGoTo(this.props.list.length - 1,false);   
      }
    }

    
    component
   
    render(){
      var settings = {
        dots: false,
        infinite: true,
        speed: 400,
        slidesToShow: 1,
        arrows : false,
        focusOnSelect : false
      };
      var cards = [];
       for (const [i, card] of this.state.list.entries()) {
      cards.push(
        <div key={i} style={{width:"100%"}}>
        <figure className="scorecard scorecard--water scorecard--hover" style={{width:this.props.width}}>
        <figcaption className="scorecard__caption">
          <div className="scorecard__name">{card.word} <span style={{position:"absolute",color:"gray",fontSize:"0.6em",right:"5px"}}>{card.score === 0 ? "" : (i + 1) + "/" + this.state.list.length}</span></div>
          
        
        <table className="scorecard__stats">
      <tbody style={{textAlign:"center"}}><tr>
        <th style={{color:"#222222",fontWeight:500,fontSize:"0.7em"}}>{card.score} Puan</th>
        </tr>
      <tr>
      <td style={{fontWeight:470,fontSize:".7em"}}>{card.desc}</td>
      </tr>
        </tbody></table>    
        </figcaption>    
        </figure> </div>)
      }             
           

      return( 
 
        <Slider {...settings} ref={slider => (this.slider = slider)} >
          {cards}
          </Slider>
                  )

    }
}
export default Cards;