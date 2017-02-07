import React, {Component} from 'react';
import {StyleSheet, View, Text, Button, TextInput} from 'react-native';
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';

export default class SignInView extends Component {

   constructor(props) {
      super(props);

      this.state = {
         email: this.props.lastLogin.email,
         password: this.props.lastLogin.password,
         processing: false
      };
   }

   getAction() {
      return {
         showView: (title) => {
            this.props.navigator.push({title: title});
         },
         handleChangeEmail: (email) => {
            this.setState({email: email});
         },
         handleChangePassword: (password) => {
            this.setState({password: password});
         },
         signIn: () => {
            if (this.hasInputError())
               return;

            this.setState({processing: true});

            const payload = {
               email: this.state.email,
               hash: this.state.password
            }

            asyncApi.callAsyncServer('signin_app', payload, (err, res) => {
               if (err) {
                  Alert.alert('', this.getText("generic_error_message") + " (" + err.error + ")");
                  this.setState({processing: false});
               } else {
                  if (res.error === 1) {
                     Alert.alert('', this.getText("generic_error_message") + " (" + err.error + ")");
                     this.setState({processing: false});
                     return;
                  }

                  this.props.onSignIn({
                     email: this.state.email,
                     password: this.state.password
                  }, res.data);
                  this.props.navigator.replace({title: 'ListRestoView'});
               }
            }, () => {
               this.setState({processing: false});
               this.props.onSignIn({
                  email: this.state.email,
                  password: this.state.password
               }, {});
               this.props.navigator.replace({title: 'ListRestoView'});
            });

         }
      };
   }

   getText(code) {
      return text.getText("SignInView." + code);
   }

   hasInputError() {
      const {email, password} = this.state;

      if (email === "" || password === "") {
         return true;
      }

      const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!re.test(email)) {
         return true;
      }

      return false;
   }

   render() {
      const actions = this.getAction();

      return (
         <View style={styles.container}>
            <Text>{this.getText('label_signin')}</Text>
            <Button onPress={actions.showView.bind(this, 'HomeView')} title={this.getText('label_home')} color="blue"/>
            <Button onPress={actions.showView.bind(this, 'ForgotPswView')} title={this.getText('label_forgotpsw')} color="blue"/>
            <TextInput style={{
               height: 40,
               backgroundColor: 'green'
            }} onChangeText={actions.handleChangeEmail} value={this.state.email}/>
            <TextInput style={{
               height: 40,
               backgroundColor: 'red'
            }} onChangeText={actions.handleChangePassword} value={this.state.password}/>
            <Button onPress={actions.signIn} title={this.getText('label_signin')} color="blue"/>
         </View>
      );
   }
}

var styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: 'white'
   }
});
