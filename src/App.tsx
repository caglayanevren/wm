import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet,IonPage } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import Main from './pages/Main';
import Login from './pages/Login';
import Config from './pages/Config';

class App  extends React.Component<any,any>{
  profile : any;
  constructor(props : any){
    super(props);
    let size = Math.floor(window.innerWidth / 10);
    if (window.innerWidth <= 400){
      size = 40;
    }
    else if (window.innerWidth >= 600){
      size = 60;
    }
    Config.size = size;
    let profileStr = null;
    profileStr = localStorage.getItem("profile");
    if (profileStr != null){
      this.profile = JSON.parse(profileStr)
    }
    
  }
  render(){

    let landing = this.profile.googleId === null ? <Login/> : <Main profile={this.profile}/>
    return (<IonApp><IonPage className="bg">{landing}</IonPage></IonApp>);
  }
}

export default App;
