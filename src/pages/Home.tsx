import { IonApp,IonPage} from '@ionic/react';
import React from 'react';
import Game from './Game';
import Config from './Config';

class Home extends React.Component<any,any> {
  interval : any;
  constructor(props : any){
    super(props);
    this.state={
      time : 1
    }
    let size = Math.floor(window.innerWidth / 10);
    if (window.innerWidth <= 400){
      size = 40;
    }
    else if (window.innerWidth >= 600){
      size = 60;
    }
    Config.size = size;
  }
  rotate(){

  }
  render(){


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
