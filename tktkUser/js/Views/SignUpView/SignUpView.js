import React, {Component} from 'react';
import {
   StyleSheet,
   View,
   Text,
   ScrollView,
   TextInput,
   TouchableHighlight,
   Alert
} from 'react-native';
import {
   Container,
   Header,
   Content,
   Title,
   Icon,
   List,
   ListItem,
   Left,
   Body,
   Right,
   Button,
   StyleProvider,
   Input,
   Label,
   Item,
   Form
} from 'native-base';
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';
import Logo from '../../Components/Logo.js';

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
         showView: (title, anim) => {
            this.props.navigator.push({title: title, anim: anim});
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

   getText(code, noPrefix) {
      return text.getText((noPrefix
         ? ""
         : "SignUpView.") + code);
   }

   verifyEmpty(text) {
      if (!text) {
         return this.getText('error_empty');
      }
      return false;
   }

   validateForm() {
      let r = true;

      let {
         lastnameError,
         firstnameError,
         streetERror,
         npaError,
         cityError,
         telError,
         emailError,
         passwordError,
         confirmpasswordError
      } = "";

      if (this.state.password !== this.state.confirmpassword) {
         confirmpasswordError = this.getText('error_match_password');
         r = false;
      }

      const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      if (!regEmail.test(this.state.email)) {
         emailError = this.getText('error_invalid_email');
         r = false
      }

      const regNPA = /^\d{4}$/;
      if (!regNPA.test(this.state.npa)) {
         npaError = this.getText('error_invalid_npa');
         r = false;
      }

      if (!this.state.lastname || !this.state.firstname || !this.state.street || !this.state.npa || !this.state.city || !this.state.tel || !this.state.email || !this.state.password || !this.state.confirmpassword) {
         lastnameError = this.verifyEmpty(this.state.lastname) || lastnameError,
         firstnameError = this.verifyEmpty(this.state.firstname) || firstnameError,
         streetError = this.verifyEmpty(this.state.street) || streetError,
         npaError = this.verifyEmpty(this.state.npa) || npaError,
         cityError = this.verifyEmpty(this.state.city) || cityError,
         telError = this.verifyEmpty(this.state.tel) || telError,
         emailError = this.verifyEmpty(this.state.email) || emailError,
         passwordError = this.verifyEmpty(this.state.password) || passwordError,
         confirmpasswordError = this.verifyEmpty(this.state.confirmpassword) || confirmpasswordError
         r = false;
      }

      if (!r) {
         this.setState({
            lastnameError,
            firstnameError,
            streetError,
            npaError,
            cityError,
            telError,
            emailError,
            passwordError,
            confirmpasswordError
         });
      }

      return r;
   }

   renderError(error) {
      if (error) {
         return (
            <Text style={nativeStyles.errorLabel}>{error}</Text>
         );
      }
      return null;
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

      const boolError = function(error) {
         return error
            ? true
            : false;
      }

      return (
         <Container>
            <Header>
               <Left>
                  <Button onPress={() => actions.showView('HomeView', 1)} transparent>
                     <Icon name='arrow-back'/>
                  </Button>
               </Left>
               <Body>
                  <Title>{this.getText('text_header')}</Title>
               </Body>
               <Right/>
            </Header>
            <Content>
               <View style={nativeStyles.logoContainer}>
                  <Logo/>
               </View>
               <Form>
                  <Item error={boolError(lastnameError)}>
                     <Input placeholder={this.getText('form_label.lastname')} autoCorrect={false} onChangeText={(lastname) => this.setState({lastname, lastnameError: ""})} value={this.state.lastname}/>{lastnameError}
                  </Item>
                  <Item error={boolError(firstnameError)}>
                     <Input placeholder={this.getText('form_label.firstname')} autoCorrect={false} onChangeText={(firstname) => this.setState({firstname, firstnameError: ""})} value={this.state.firstname}/>{firstnameError}
                  </Item>
                  <Item error={boolError(streetError)}>
                     <Input placeholder={this.getText('form_label.street')} autoCorrect={false} onChangeText={(street) => this.setState({street, streetError: ""})} value={this.state.street}/>{streetError}
                  </Item>
                  <Item error={boolError(npaError)}>
                     <Input placeholder={this.getText('form_label.npa')} autoCorrect={false} onChangeText={(npa) => this.setState({npa, npaError: ""})} value={this.state.npa}/>{npaError}
                  </Item>
                  <Item error={boolError(cityError)}>
                     <Input placeholder={this.getText('form_label.city')} autoCorrect={false} onChangeText={(city) => this.setState({city, cityError: ""})} value={this.state.city}/>{cityError}
                  </Item>
                  <Item error={boolError(telError)}>
                     <Input placeholder={this.getText('form_label.tel')} autoCorrect={false} onChangeText={(tel) => this.setState({tel, telError: ""})} value={this.state.tel}/>{telError}
                  </Item>
                  <Item error={boolError(emailError)}>
                     <Input placeholder={this.getText('form_label.email')} autoCorrect={false} onChangeText={(email) => this.setState({email, emailError: ""})} value={this.state.email}/>{emailError}
                  </Item>
                  <Item error={boolError(passwordError)}>
                     <Input placeholder={this.getText('form_label.password')} onChangeText={(password) => this.setState({password, passwordError: ""})} value={this.state.password} secureTextEntry={true}/>{passwordError}
                  </Item>
                  <Item error={boolError(confirmpasswordError)}>
                     <Input placeholder={this.getText('form_label.confirmpassword')} secureTextEntry={true} onChangeText={(confirmpassword) => this.setState({confirmpassword, confirmpasswordError: ""})} value={this.state.confirmpassword}/>{confirmpasswordError}
                  </Item>
                  <Button style={nativeStyles.signUpButton} info onPress={actions.signUp}>
                     <Text style={nativeStyles.buttonText}>{this.getText('label_signup_button')}</Text>
                  </Button>
               </Form>
            </Content>
         </Container>
      );
   }
}

var nativeStyles = {
   logoContainer: {
      height: 150,
      marginTop: 20,
      marginBottom: 80
   },
   errorLabel: {
      paddingRight: 10,
      color: '#a94442',
      fontWeight: '600'
   },
   signUpButton: {
      marginTop: 20,
      marginBottom: 20,
      alignSelf: 'center'
   },
   buttonText: {
      fontSize: 17,
      fontWeight: '600',
      color: 'white'
   }
};
