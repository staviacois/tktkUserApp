import React, {Component} from 'react'
import {
   Navigator,
   View,
   Text,
   BackAndroid,
   StatusBar,
   Button,
   TouchableHighlight,
   StyleSheet,
   ScrollView,
   Platform
} from 'react-native';
import SideMenu from 'react-native-side-menu';
import * as asyncApi from './libs/asyncApi.js';
import * as storage from './libs/storage.js';
import * as text from './libs/text.js';

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
         },
         textHeader: "",
         menuIsOpen: false,
         menu: null
      };

      this.handleSignIn = this.handleSignIn.bind(this);
      this.handleSignOut = this.handleSignOut.bind(this);
      this.handleSetTextHeader = this.handleSetTextHeader.bind(this);
      this.handleSetMenu = this.handleSetMenu.bind(this);
      this.handleSetMenuIsOpen = this.handleSetMenuIsOpen.bind(this);
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
      StatusBar.setHidden(true);
   }

   componentDidMount() {
      StatusBar.setHidden(true);
   }

   handleSignIn(userInfos, login) {
      storage.set('@Login', JSON.stringify(userInfos), () => {});
      this.setState({lastLogin: userInfos, login: login});
   }

   handleSignOut() {
      this.setState({login: null});
   }

   handleSetTextHeader(text) {
      this.setState({textHeader: text});
   }

   handleSetMenu(menu) {
      this.setState({menu: menu});
   }

   handleSetMenuIsOpen(isOpen) {
      this.setState({menuIsOpen: isOpen});
   }

   render() {

      let navBar = (
         <Navigator.NavigationBar style={styles.header} routeMapper={{
            LeftButton: (route, navigator, index, navState) => {
               return (
                  <TouchableHighlight style={styles.menuButton} onPress={() => this.setState({menuIsOpen: true})} underlayColor={'rgb(230, 50, 12)'} activeOpacity={.7}>
                     <View>
                        <View style={[styles.menuButtonBar, styles.menuButtonBarSpace]}/>
                        <View style={[styles.menuButtonBar, styles.menuButtonBarSpace]}/>
                        <View style={styles.menuButtonBar}/>
                     </View>
                  </TouchableHighlight>
               );
            },
            RightButton: (route, navigator, index, navState) => {
               return null;
            },
            Title: (route, navigator, index, navState) => {
               return (
                  <Text style={styles.textHeader}>{this.state.textHeader}</Text>
               );
            }
         }}/>
      );

      navBar = (
         <View style={styles.header}>
            <Text style={styles.headerText}>{this.state.textHeader}</Text>
            <TouchableHighlight style={styles.menuButton} onPress={() => this.setState({menuIsOpen: true})} underlayColor={'rgb(230, 50, 12)'} activeOpacity={.7}>
               <View>
                  <View style={[styles.menuButtonBar, styles.menuButtonBarSpace]}/>
                  <View style={[styles.menuButtonBar, styles.menuButtonBarSpace]}/>
                  <View style={styles.menuButtonBar}/>
               </View>
            </TouchableHighlight>
         </View>
      );

      const navig = (<Navigator initialRoute={{
         title: 'SignInView'
      }} renderScene={this.renderScene.bind(this)} configureScene={(route) => {
         if (route.sceneConfig) {
            return route.sceneConfig;
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

      return (
         <View style={styles.superContainer}>
            <SideMenu menu={this.state.menu} isOpen={this.state.menuIsOpen} onChange={(isOpen) => this.setState({menuIsOpen: isOpen})}>{navBar}{navig}</SideMenu>
         </View>
      );
   }

   renderScene(route, navigator) {
      route.navigator = navigator;
      if (!route.params)
         route.params = {};

      const commonFuncs = {
         onSetTextHeader: this.handleSetTextHeader,
         onSetMenu: this.handleSetMenu,
         onSetMenuIsOpen: this.handleSetMenuIsOpen
      };

      switch (route.title) {
         case 'HomeView':
            return (<HomeView navigator={navigator} params={route.params} commonFuncs={commonFuncs}/>);
            break;
         case 'SignUpView':
            return (<SignUpView navigator={navigator} params={route.params} commonFuncs={commonFuncs}/>);
            break;
         case 'SignInView':
            return (<SignInView navigator={navigator} params={route.params} commonFuncs={commonFuncs} onSignIn={this.handleSignIn} lastLogin={this.state.lastLogin}/>);
            break;
         case 'ForgotPswView':
            return (<ForgotPswView navigator={navigator} params={route.params} commonFuncs={commonFuncs}/>);
            break;
         case 'ListRestoView':
            return (<ListRestoView navigator={navigator} params={route.params} commonFuncs={commonFuncs} login={this.state.login} onSignOut={this.handleSignOut}/>);
            break;
         case 'AccountView':
            return (<AccountView navigator={navigator} params={route.params} commonFuncs={commonFuncs} login={this.state.login} onSignOut={this.handleSignOut}/>);
            break;
         case 'RestoView':
            return (<RestoView navigator={navigator} params={route.params} commonFuncs={commonFuncs} login={this.state.login}/>);
            break;
         case 'MapRestoView':
            return (<MapRestoView navigator={navigator} params={route.params} commonFuncs={commonFuncs} login={this.state.login} onSignOut={this.handleSignOut}/>);
            break;
         case 'EndOrderView':
            return (<EndOrderView navigator={navigator} params={route.params} commonFuncs={commonFuncs} login={this.state.login}/>);
            break;
         case 'OrderView':
            return (<OrderView navigator={navigator} params={route.params} commonFuncs={commonFuncs} login={this.state.login}/>);
            break;
      }
   }
}

var styles = StyleSheet.create({
   superContainer: {
      flex: 1,
      backgroundColor: 'rgb(64, 70, 75)'
   },
   textHeader: {
      color: 'white',
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '600'
   },
   header: {
      backgroundColor: 'rgb(230, 50, 12)',
      height: 55,
      justifyContent: 'center'
   },
   headerText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 20,
      fontWeight: '600'
   },
   menuButton: {
      position: 'absolute',
      top: 0,
      left: 0,
      height: 55,
      width: 55,
      justifyContent: 'center'
   },
   menuButtonBar: {
      backgroundColor: 'white',
      height: 3,
      marginLeft: 10,
      marginRight: 10
   },
   menuButtonBarSpace: {
      marginBottom: 4
   }
});
