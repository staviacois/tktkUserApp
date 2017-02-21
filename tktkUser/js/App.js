import React, {Component} from 'react'
import {Navigator, BackAndroid, StatusBar} from 'react-native';
import {StyleProvider} from 'native-base';
import * as asyncApi from './libs/asyncApi.js';
import * as storage from './libs/storage.js';
import getTheme from '../native-base-theme/components';
import theme from '../native-base-theme/variables/platform.js';

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
   // App skeleton

   constructor(props) {
      super(props);

      // Define default state
      this.state = {
         login: null,
         lastLogin: {
            email: "",
            password: ""
         }
      };

      // Bind functions to this
      this.handleSignIn = this.handleSignIn.bind(this);
      this.handleSignOut = this.handleSignOut.bind(this);
   }

   componentWillMount() {

      // Initialize connection to meteor
      asyncApi.init();

      // Set android back button action
      BackAndroid.addEventListener('hardwareBackPress', () => {
         return true;
      });

      // Get last login from storage
      storage.get('@Login', (err, val) => {
         if (!err && val) {
            this.setState({lastLogin: JSON.parse(val)});
         }
      });

      // Hide StatusBar
      StatusBar.setHidden(true);
   }

   componentDidMount() {
      // Hide StatusBar
      StatusBar.setHidden(true);
   }

   handleSignIn(userInfos, login) {
      // Store last login in storage and in state
      storage.set('@Login', JSON.stringify(userInfos), () => {});
      this.setState({lastLogin: userInfos, login: login});
   }

   handleSignOut() {
      // Remove login from state and redirect to HomeView
      this.setState({login: null});
      this.navigator.push({title: 'HomeView', anim: 2});
   }

   render() {

      // Define navigator using HomeView as initial route
      // This navigator can handle special transition animations, and automatically unmounts unused views
      const navig = (<Navigator initialRoute={{
         title: 'HomeView'
      }} renderScene={this.renderScene.bind(this)} configureScene={(route) => {
         if (route.anim) {
            switch (route.anim) {
               case 1:
                  return {
                     ...Navigator.SceneConfigs.HorizontalSwipeJumpFromRight,
                     gestures: {}
                  };
                  break;
               case 2:
                  return {
                     ...Navigator.SceneConfigs.VerticalDownSwipeJump,
                     gestures: {}
                  };
                  break;
               default:
                  return {
                     ...Navigator.SceneConfigs.HorizontalSwipeJump,
                     gestures: {}
                  };
            }
         }
         return {
            ...Navigator.SceneConfigs.HorizontalSwipeJump,
            gestures: {}
         };
      }} onDidFocus={(route) => {
         if (!route.didFocus) {
            route.didFocus = true;
            route.navigator.immediatelyResetRouteStack([route]);
         }
      }}/>);

      // Return the root component of the app
      return navig;
   }

   renderScene(route, navigator) {

      this.navigator = navigator;
      route.navigator = navigator;

      if (!route.params)
         route.params = {};

      // commonFuncs: functions that every view should be able to access to
      const commonFuncs = {};

      // Chose right view to show
      let content = null;
      switch (route.title) {
         case 'HomeView':
            content = (<HomeView navigator={navigator} params={route.params} commonFuncs={commonFuncs}/>);
            break;
         case 'SignUpView':
            content = (<SignUpView navigator={navigator} params={route.params} commonFuncs={commonFuncs}/>);
            break;
         case 'SignInView':
            content = (<SignInView navigator={navigator} params={route.params} commonFuncs={commonFuncs} onSignIn={this.handleSignIn} lastLogin={this.state.lastLogin}/>);
            break;
         case 'ForgotPswView':
            content = (<ForgotPswView navigator={navigator} params={route.params} commonFuncs={commonFuncs}/>);
            break;
         case 'ListRestoView':
            content = (<ListRestoView navigator={navigator} params={route.params} commonFuncs={commonFuncs} login={this.state.login} onSignOut={this.handleSignOut}/>);
            break;
         case 'AccountView':
            content = (<AccountView navigator={navigator} params={route.params} commonFuncs={commonFuncs} login={this.state.login} onSignOut={this.handleSignOut}/>);
            break;
         case 'RestoView':
            content = (<RestoView navigator={navigator} params={route.params} commonFuncs={commonFuncs} login={this.state.login}/>);
            break;
         case 'MapRestoView':
            content = (<MapRestoView navigator={navigator} params={route.params} commonFuncs={commonFuncs} login={this.state.login} onSignOut={this.handleSignOut}/>);
            break;
         case 'EndOrderView':
            content = (<EndOrderView navigator={navigator} params={route.params} commonFuncs={commonFuncs} login={this.state.login}/>);
            break;
         case 'OrderView':
            content = (<OrderView navigator={navigator} params={route.params} commonFuncs={commonFuncs} login={this.state.login}/>);
            break;
      }

      // Wrap view in the style provider to set the right theme
      return (
         <StyleProvider style={getTheme(theme)}>
            {content}
         </StyleProvider>
      );
   }
}
