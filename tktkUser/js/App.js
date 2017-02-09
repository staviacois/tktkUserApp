import React, {Component} from 'react'
import {
   Navigator,
   View,
   Text,
   BackAndroid,
   StatusBar,
   Button
} from 'react-native';
import * as asyncApi from './libs/asyncApi.js';
import * as storage from './libs/storage.js';

import HomeView from './Views/HomeView';
import SignUpView from './Views/SignUpView';
import SignInView from './Views/SignInView';
import ForgotPswView from './Views/ForgotPswView';
import ListRestoView from './Views/ListRestoView';
import AccountView from './Views/AccountView';
import RestoView from './Views/RestoView';
import MapRestoView from './Views/MapRestoView';
import EndOrderView from './Views/EndOrderView';
import OrderView from './Views/OrderView';

export default class App extends Component {
   constructor(props) {
      super(props);

      this.state = {
         login: null,
         lastLogin: {
            email: "",
            password: ""
         }
      };
   }

   componentWillMount() {
      asyncApi.init();
      BackAndroid.addEventListener('hardwareBackPress', () => {
         return true;
      });
      storage.get('@Login', (err, val) => {
         if (!err && val) {
            this.setState({lastLogin: JSON.parse(val)});
         }
      });
   }

   componentDidMount() {
      StatusBar.setHidden(true);
   }

   handleSignIn(userInfos, login) {
      storage.set('@Login', JSON.stringify(userInfos), () => {});
      this.setState({lastLogin: userInfos, login: login});
   }

   handleSignout() {
      this.setState({login: null});
   }

   render() {
      return (<Navigator initialRoute={{
         title: 'SignInView',
         index: 0
      }} renderScene={this.renderScene.bind(this)} configureScene={(route) => {
         if (route.sceneConfig) {
            return route.sceneConfig;
         }
         return Navigator.SceneConfigs.FloatFromRight;
      }} onDidFocus={(route) => {
         if (!route.didFocus) {
            route.didFocus = true;
            route.navigator.immediatelyResetRouteStack([route]);
         }
      }}/>);
   }

   renderScene(route, navigator) {
      route.navigator = navigator;
      if (!route.params)
         route.params = {};

      switch (route.title) {
         case 'HomeView':
            return (<HomeView navigator={navigator} params={route.params}/>);
            break;
         case 'SignUpView':
            return (<SignUpView navigator={navigator} params={route.params}/>);
            break;
         case 'SignInView':
            return (<SignInView navigator={navigator} params={route.params} onSignIn={this.handleSignIn.bind(this)} lastLogin={this.state.lastLogin}/>);
            break;
         case 'ForgotPswView':
            return (<ForgotPswView navigator={navigator} params={route.params}/>);
            break;
         case 'ListRestoView':
            return (<ListRestoView navigator={navigator} params={route.params} login={this.state.login} onSignout={this.handleSignout.bind(this)}/>);
            break;
         case 'AccountView':
            return (<AccountView navigator={navigator} params={route.params} login={this.state.login} onSignout={this.handleSignout.bind(this)}/>);
            break;
         case 'RestoView':
            return (<RestoView navigator={navigator} params={route.params} login={this.state.login}/>);
            break;
         case 'MapRestoView':
            return (<MapRestoView navigator={navigator} params={route.params} login={this.state.login} onSignout={this.handleSignout.bind(this)}/>);
            break;
         case 'EndOrderView':
            return (<EndOrderView navigator={navigator} params={route.params} login={this.state.login}/>);
            break;
         case 'OrderView':
            return (<OrderView navigator={navigator} params={route.params} login={this.state.login}/>);
            break;
      }
   }
}
