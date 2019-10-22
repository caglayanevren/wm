import { IonApp,IonPage} from '@ionic/react';
import React from 'react';
import Game from './Game';

class Home extends React.Component<any,any> {
  interval : any;
  constructor(props : any){
    super(props);
    this.state={
      time : 1
    }

    this.rotate = this.rotate.bind(this);
  }
  rotate(){
    if (this.interval){
      return;
    }
    this.interval = setInterval(()=>{
      this.setState({time : this.state.time + 1})
    },1000);
    console.log(this.interval);
  }
  render(){
    const slideOpts = {
  initialSlide: 1,
  speed: 400
};

  return (

   <IonApp>
     <IonPage className="bg">
    <Game/>
    </IonPage>
    </IonApp>

 );
  }
};


export default Home;
