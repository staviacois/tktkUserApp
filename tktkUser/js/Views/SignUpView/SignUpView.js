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
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';

export default class SignUpView extends Component {

   constructor(props) {
      super(props);

      this.state = {
         lastname: "",
         firstname: "",
         street: "",
         npa: "",
         city: "",
         tel: "",
         email: "",
         password: "",
         confirmpassword: "",
         lastnameError: "",
         firstnameError: "",
         streetError: "",
         npaError: "",
         cityError: "",
         telError: "",
         emailError: "",
         passwordError: "",
         confirmpasswordError: ""
      }
   }

   getAction() {
      return {
         showView: (title) => {
            this.props.navigator.push({title: title});
         },
         signUp: () => {
            if (this.validateForm()) {

               const payload = {
                  name: this.state.lastname,
                  firstname: this.state.firstname,
                  email: this.state.email,
                  phonenbr: this.state.tel,
                  hashmdp1: this.state.password,
                  npa: this.state.npa,
                  street: this.state.street,
                  city: this.state.city
               }

               const cbSuccess = (err, res) => {
                  if (err) {
                     Alert.alert('', this.getText("generic_error_message") + " (" + err.error + ")");
                     this.setState({
                        lastnameError: "",
                        firstnameError: "",
                        streetError: "",
                        npaError: "",
                        cityError: "",
                        telError: "",
                        emailError: "",
                        passwordError: "",
                        confirmpasswordError: ""
                     });
                  } else {
                     if (!res.problem) {
                        Alert.alert('', res.message);
                        this.setState({
                           lastname: "",
                           firstname: "",
                           street: "",
                           npa: "",
                           city: "",
                           tel: "",
                           email: "",
                           password: "",
                           confirmpassword: "",
                           lastnameError: "",
                           firstnameError: "",
                           streetError: "",
                           npaError: "",
                           cityError: "",
                           telError: "",
                           emailError: "",
                           passwordError: "",
                           confirmpasswordError: ""
                        });
                     } else {
                        Alert.alert('', res.message);
                        this.setState({
                           lastnameError: "",
                           firstnameError: "",
                           streetError: "",
                           npaError: "",
                           cityError: "",
                           telError: "",
                           emailError: "",
                           passwordError: "",
                           confirmpasswordError: ""
                        });
                     }
                  }
               };

               const cbError = () => {
                  this.setState({
                     lastnameError: "",
                     firstnameError: "",
                     streetError: "",
                     npaError: "",
                     cityError: "",
                     telError: "",
                     emailError: "",
                     passwordError: "",
                     confirmpasswordError: ""
                  });
               };

               asyncApi.callAsyncServer('createNewUser', payload, cbSuccess, cbError);
            }
         }
      };
   }

   getText(code) {
      return text.getText("SignUpView." + code);
   }

   verifyEmpty(text) {
      if (!text) {
         return this.getText('error_empty');
      }
      return "";
   }

   validateForm() {
      if (!this.state.lastname || !this.state.firstname || !this.state.street || !this.state.npa || !this.state.city || !this.state.tel || !this.state.email || !this.state.password || !this.state.confirmpassword) {
         this.setState({
            lastnameError: this.verifyEmpty(this.state.lastname),
            firstnameError: this.verifyEmpty(this.state.firstname),
            streetError: this.verifyEmpty(this.state.street),
            npaError: this.verifyEmpty(this.state.npa),
            cityError: this.verifyEmpty(this.state.city),
            telError: this.verifyEmpty(this.state.tel),
            emailError: this.verifyEmpty(this.state.email),
            passwordError: this.verifyEmpty(this.state.password),
            confirmpasswordError: this.verifyEmpty(this.state.confirmpassword)
         });
         return false;
      }

      if (this.state.password !== this.state.confirmpassword) {
         this.setState({
            lastnameError: "",
            firstnameError: "",
            streetError: "",
            npaError: "",
            cityError: "",
            telError: "",
            emailError: "",
            passwordError: "",
            confirmpasswordError: this.getText('error_match_password')
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

   render() {
      const actions = this.getAction();

      const lastnameError = this.renderError(this.state.lastnameError);
      const firstnameError = this.renderError(this.state.firstnameError);
      const streetError = this.renderError(this.state.streetError);
      const npaError = this.renderError(this.state.npaError);
      const cityError = this.renderError(this.state.cityError);
      const telError = this.renderError(this.state.telError);
      const emailError = this.renderError(this.state.emailError);
      const passwordError = this.renderError(this.state.passwordError);
      const confirmpasswordError = this.renderError(this.state.confirmpasswordError);

      const lastnameStyle = this.renderStyle(this.state.lastnameError);
      const firstnameStyle = this.renderStyle(this.state.firstnameError);
      const streetStyle = this.renderStyle(this.state.streetError);
      const npaStyle = this.renderStyle(this.state.npaError);
      const cityStyle = this.renderStyle(this.state.cityError);
      const telStyle = this.renderStyle(this.state.telError);
      const emailStyle = this.renderStyle(this.state.emailError);
      const passwordStyle = this.renderStyle(this.state.passwordError);
      const confirmpasswordStyle = this.renderStyle(this.state.confirmpasswordError);

      return (
         <View style={styles.container}>
            <View style={styles.header}>
               <Text style={styles.headerText}>{this.getText('text_header')}</Text>
            </View>
            <ScrollView style={styles.content}>
               <View style={styles.formContainer}>
                  <View style={styles.form}>
                     <Text style={styles.formLabel}>{this.getText('form_label.lastname')}</Text>
                     <TextInput style={lastnameStyle} onChangeText={(lastname) => this.setState({lastname})} value={this.state.lastname}/>{lastnameError}
                     <Text style={styles.formLabel}>{this.getText('form_label.firstname')}</Text>
                     <TextInput style={firstnameStyle} onChangeText={(firstname) => this.setState({firstname})} value={this.state.firstname}/>{firstnameError}
                     <Text style={styles.formLabel}>{this.getText('form_label.street')}</Text>
                     <TextInput style={streetStyle} onChangeText={(street) => this.setState({street})} value={this.state.street}/>{streetError}
                     <Text style={styles.formLabel}>{this.getText('form_label.npa')}</Text>
                     <TextInput style={npaStyle} onChangeText={(npa) => this.setState({npa})} value={this.state.npa}/>{npaError}
                     <Text style={styles.formLabel}>{this.getText('form_label.city')}</Text>
                     <TextInput style={cityStyle} onChangeText={(city) => this.setState({city})} value={this.state.city}/>{cityError}
                     <Text style={styles.formLabel}>{this.getText('form_label.tel')}</Text>
                     <TextInput style={telStyle} onChangeText={(tel) => this.setState({tel})} value={this.state.tel}/>{telError}
                     <Text style={styles.formLabel}>{this.getText('form_label.email')}</Text>
                     <TextInput style={emailStyle} onChangeText={(email) => this.setState({email})} value={this.state.email}/>{emailError}
                     <Text style={styles.formLabel}>{this.getText('form_label.password')}</Text>
                     <TextInput style={passwordStyle} onChangeText={(password) => this.setState({password})} value={this.state.password} secureTextEntry={true}/>{passwordError}
                     <Text style={styles.formLabel}>{this.getText('form_label.confirmpassword')}</Text>
                     <TextInput style={confirmpasswordStyle} onChangeText={(confirmpassword) => this.setState({confirmpassword})} value={this.state.confirmpassword} secureTextEntry={true}/>{confirmpasswordError}
                     <TouchableHighlight style={styles.signUpButton} onPress={actions.signUp} underlayColor={'#286090'}>
                        <Text style={styles.signUpButtonText}>{this.getText('label_signup_button')}</Text>
                     </TouchableHighlight>
                  </View>
               </View>
            </ScrollView>
         </View>
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
   signUpButton: {
      backgroundColor: '#337ab7',
      borderWidth: 1,
      borderColor: 'rgb(32, 77, 116)',
      borderRadius: 6,
      height: 40,
      justifyContent: 'center',
      marginTop: 20
   },
   signUpButtonText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 20
   },
   errorLabel: {
      color: '#a94442',
      fontWeight: '600'
   }
});
