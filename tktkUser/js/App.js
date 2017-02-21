import React, {Component} from 'react'
import {
   Navigator,
   View,
   Text,
   BackAndroid,
   StatusBar,
   TouchableHighlight,
   StyleSheet,
   ScrollView,
   Platform,
   Animated
} from 'react-native';
import {Container, Button, Icon, StyleProvider} from 'native-base';
import SideMenu from 'react-native-side-menu';
import * as asyncApi from './libs/asyncApi.js';
import * as storage from './libs/storage.js';
import * as text from './libs/text.js';
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
         },
         menuIsOpen: false
      };

      // Bind functions to this
      this.handleSignIn = this.handleSignIn.bind(this);
      this.handleSignOut = this.handleSignOut.bind(this);
      this.handleOpenMenu = this.handleOpenMenu.bind(this);
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

   handleOpenMenu() {
      // Open the menu
      this.setState({menuIsOpen: true});
   }

   handleMenuPress(label, shouldPush) {
      // Close the menu and redirect to view if needed
      if (shouldPush) {
         this.navigator.push({title: label});
      }
      this.setState({menuIsOpen: false});
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

      // Define menu animation function
      const animFunction = (prop, value) => {
         return Animated.spring(prop, {
            toValue: value,
            friction: 10
         });
      }

      // Define menu only if the user did sign in
      const menu = this.state.login
         ? this.renderMenu()
         : null;

      // Return the root component of the app
      return (
         <View style={styles.superContainer}>
            <SideMenu disableGestures={true} animationFunction={animFunction} menu={menu} isOpen={this.state.menuIsOpen} onChange={(isOpen) => this.setState({menuIsOpen: isOpen})}>
               {navig}
            </SideMenu>
         </View>
      );
   }

   renderMenu() {

      const self = this;
      const tab = [];

      // For each menu element
      ["ListRestoView", "MapRestoView", "AccountView"].forEach((elem) => {

         // shouldPush : tells if this menu element represents another view than current showed view
         let shouldPush = true;
         const elemStyle = [styles.menuText];
         const currentRoutes = self.navigator.getCurrentRoutes();

         if (currentRoutes[currentRoutes.length - 1].title === elem) {
            // If this menu element represents the current showed view, change his style and set shouldPush to false
            elemStyle.push(styles.menuTextActive);
            shouldPush = false;
         }

         tab.push(
            <Text key={elem} onPress={() => this.handleMenuPress(elem, shouldPush)} style={elemStyle}>{text.getText('menu_label.' + elem, true)}</Text>
         );
      });

      // Return a scrollable view containing all menu elements
      return (
         <ScrollView scrollsToTop={false}>
            {tab}
         </ScrollView>
      );
   }

   renderScene(route, navigator) {

      this.navigator = navigator;
      route.navigator = navigator;

      if (!route.params)
         route.params = {};

      // commonFuncs: functions that every view should be able to access to
      const commonFuncs = {
         onOpenMenu: this.handleOpenMenu
      };

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

var styles = StyleSheet.create({
   superContainer: {
      flex: 1,
      backgroundColor: 'rgb(64, 70, 75)'
   },
   menuText: {
      color: 'white',
      fontSize: 17,
      height: 60,
      lineHeight: 60,
      padding: 0,
      fontWeight: '700',
      paddingLeft: 10
   },
   menuTextActive: {
      color: '#aaa',
      backgroundColor: '#33383C'
   },
   iconBack: {
      fontSize: 40,
      alignSelf: 'center',
      justifyContent: 'center',
      alignItems: 'center'
   }
});
