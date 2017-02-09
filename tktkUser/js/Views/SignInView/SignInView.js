import React, {Component} from 'react';
import {
   StyleSheet,
   View,
   Text,
   Button,
   ScrollView,
   TextInput,
   TouchableHighlight,
   Alert
} from 'react-native';
import SideMenu from 'react-native-side-menu';
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';

export default class SignInView extends Component {

   constructor(props) {
      super(props);

      this.state = {
         email: "",
         password: "",
         emailError: "",
         passwordError: "",
         menuIsOpen: false
      }
   }

   getAction() {
      return {
         showView: (title) => {
            this.props.navigator.push({title: title});
         },
         signIn: () => {
            if (this.validateForm()) {

               const payload = {
                  email: this.state.email,
                  hashmdp: this.state.password,
                  loginlevel: 1
               }

               const cbSuccess = (err, res) => {
                  if (err) {
                     Alert.alert('', this.getText("generic_error_message") + " (" + err.error + ")");
                     this.setState({emailError: "", passwordError: ""});
                  } else {
                     if (!res.problem) {
                        this.setState({email: "", password: "", emailError: "", passwordError: ""});
                        this.props.onSignIn({
                           email: this.state.email,
                           password: this.state.password
                        }, res);
                        this.props.navigator.push({title: 'ListRestoView'});
                     } else {
                        Alert.alert('', res.message);
                        this.setState({emailError: "", passwordError: ""});
                     }
                  }
               };

               const cbError = () => {
                  this.setState({emailError: "", passwordError: ""});
               }

               asyncApi.callAsyncServer('login', payload, cbSuccess, cbError, true);
            }
         },
         setMenuIsOpen: (open) => {
            if (open !== this.state.menuIsOpen) {
               this.setState({menuIsOpen: open});
            }
         }
      };
   }

   getText(code) {
      return text.getText("SignInView." + code);
   }

   verifyEmpty(text) {
      if (!text) {
         return this.getText('error_empty');
      }
      return "";
   }

   validateForm() {
      if (!this.state.email || !this.state.password) {
         this.setState({
            emailError: this.verifyEmpty(this.state.email),
            passwordError: this.verifyEmpty(this.state.password)
         });
         return false;
      }
      return true;
   }

   renderError(error) {
      if (error) {
         return (
            <Text style={styles.errorLabel}>{error}</Text>
         );
      }
      return null;
   }

   renderStyle(error) {
      if (error) {
         return styles.formTextInputError;
      }
      return styles.formTextInput;
   }

   renderMenu(actions) {
      return (
         <ScrollView style={styles.menu} scrollsToTop={false}>
            <Text onPress={() => actions.setMenuIsOpen(false)} style={[styles.menuText, styles.menuTextActive]}>{this.getText('menu_label.loginview')}</Text>
            <Text onPress={() => actions.showView('SignUpView')} style={styles.menuText}>{this.getText('menu_label.signupview')}</Text>
            <Text onPress={() => actions.showView('ListRestoView')} style={styles.menuText}>{this.getText('menu_label.listrestoview')}</Text>
         </ScrollView>
      );
   }

   renderHeader(actions) {
      return (
         <View style={styles.header}>
            <Text style={styles.headerText}>{this.getText('text_header')}</Text>
            <TouchableHighlight style={styles.menuButton} onPress={() => actions.setMenuIsOpen(true)} underlayColor={'rgb(230, 50, 12)'} activeOpacity={.7}>
               <View>
                  <View style={[styles.menuButtonBar, styles.menuButtonBarSpace]}/>
                  <View style={[styles.menuButtonBar, styles.menuButtonBarSpace]}/>
                  <View style={styles.menuButtonBar}/>
               </View>
            </TouchableHighlight>
         </View>
      );
   }

   render() {
      const actions = this.getAction();

      const emailError = this.renderError(this.state.emailError);
      const passwordError = this.renderError(this.state.passwordError);

      const emailStyle = this.renderStyle(this.state.emailError);
      const passwordStyle = this.renderStyle(this.state.passwordError);

      return (
         <SideMenu menu={this.renderMenu(actions)} isOpen={this.state.menuIsOpen} onChange={(isOpen) => actions.setMenuIsOpen(isOpen)}>
            <View style={styles.container}>
               {this.renderHeader(actions)}
               <ScrollView style={styles.content}>
                  <View style={styles.formContainer}>
                     <View style={styles.form}>
                        <Text style={styles.formLabel}>{this.getText('form_label.email')}</Text>
                        <TextInput style={emailStyle} onChangeText={(email) => this.setState({email})} value={this.state.email}/>{emailError}
                        <Text style={styles.formLabel}>{this.getText('form_label.password')}</Text>
                        <TextInput style={passwordStyle} onChangeText={(password) => this.setState({password})} value={this.state.password} secureTextEntry={true}/>{passwordError}
                        <TouchableHighlight style={styles.signInButton} onPress={actions.signIn} underlayColor={'#286090'}>
                           <Text style={styles.signInButtonText}>{this.getText('label_signin_button')}</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.noAccountButton} onPress={actions.showView.bind(this, 'SignUpView')} underlayColor={'#286090'}>
                           <Text style={styles.noAccountButtonText}>{this.getText('label_noaccount_button')}</Text>
                        </TouchableHighlight>
                     </View>
                  </View>
               </ScrollView>
            </View>
         </SideMenu>
      );
   }
}

var styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: 'white'
   },
   header: {
      backgroundColor: 'rgb(230, 50, 12)',
      height: 55,
      justifyContent: 'center'
   },
   headerText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 20
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
   },
   menu: {
      backgroundColor: 'rgb(64, 70, 75)'
   },
   menuText: {
      color: 'white',
      fontSize: 17,
      padding: 20,
      fontWeight: '700'
   },
   menuTextActive: {
      color: '#aaa'
   },
   content: {
      backgroundColor: 'rgb(238, 238, 238)'
   },
   formContainer: {
      margin: 15,
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 15,
      backgroundColor: 'white',
      borderWidth: 4,
      borderColor: 'rgb(238, 238, 238)',
      borderStyle: 'dotted'
   },
   formLabel: {
      marginBottom: 5,
      marginTop: 15
   },
   formTextInput: {
      height: 35,
      borderColor: '#eee',
      borderWidth: 1,
      paddingLeft: 10
   },
   formTextInputError: {
      height: 35,
      borderColor: 'rgb(217, 83, 79)',
      borderWidth: 1,
      borderRadius: 3,
      paddingLeft: 10
   },
   signInButton: {
      backgroundColor: '#337ab7',
      borderWidth: 1,
      borderColor: 'rgb(32, 77, 116)',
      borderRadius: 6,
      height: 40,
      justifyContent: 'center',
      marginTop: 20
   },
   signInButtonText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 20
   },
   errorLabel: {
      color: '#a94442',
      fontWeight: '600'
   },
   noAccountButton: {
      backgroundColor: '#337ab7',
      borderWidth: 1,
      borderColor: 'rgb(32, 77, 116)',
      borderRadius: 6,
      height: 40,
      justifyContent: 'center',
      marginTop: 20
   },
   noAccountButtonText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 20
   }
});
