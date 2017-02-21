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
import SideMenu from 'react-native-side-menu';
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';
import * as storage from '../../libs/storage.js';

import Logo from '../../Components/Logo.js';

export default class SignInView extends Component {
   // This view is used to login, to access to the app

   constructor(props) {
      super(props);

      this.state = {
         email: "test@test.com",
         password: "123",
         emailError: "",
         passwordError: ""
      }
   }

   getAction() {
      return {
         showView: (title, anim) => {
            this.props.navigator.push({title: title, anim: anim});
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
                        this.setState({emailError: "", passwordError: ""});

                        // Let the App component handle the storage of the login
                        this.props.onSignIn({
                           email: this.state.email,
                           password: this.state.password
                        }, res);

                        // Get the current ticket from storage
                        storage.get('@Ticket', (err, val) => {
                           if (!err && val) {
                              // If there is a ticket, show OrderView
                              this.props.navigator.push({
                                 title: 'OrderView',
                                 params: {
                                    ticket: JSON.parse(val)
                                 }
                              });
                           } else {
                              // Else, show ListRestoView
                              this.props.navigator.push({title: 'ListRestoView'});
                           }
                        });
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
         }
      };
   }

   getText(code, noPrefix) {
      return text.getText((noPrefix
         ? ""
         : "SignInView.") + code);
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
            <Text style={nativeStyles.errorLabel}>{error}</Text>
         );
      }
      return null;
   }

   render() {
      const actions = this.getAction();

      const emailError = this.renderError(this.state.emailError);
      const passwordError = this.renderError(this.state.passwordError);

      const onSubmit = () => {
         if (this.state.email && this.state.password) {
            actions.signIn();
         }
      };

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
                  <Item error={boolError(emailError)}>
                     <Input placeholder={this.getText('form_label.email')} onSubmitEditing={onSubmit} autoCorrect={false} onChangeText={(email) => this.setState({email, emailError: ""})} value={this.state.email}/>{emailError}
                  </Item>
                  <Item error={boolError(passwordError)}>
                     <Input placeholder={this.getText('form_label.password')} onSubmitEditing={onSubmit} onChangeText={(password) => this.setState({password, passwordError: ""})} value={this.state.password} secureTextEntry={true}/>{passwordError}
                  </Item>
                  <Button style={nativeStyles.signInButton} info onPress={actions.signIn}>
                     <Text style={nativeStyles.buttonTextWhite}>{this.getText('label_signin_button')}</Text>
                  </Button>
                  <Button style={nativeStyles.noAccountButton} light onPress={() => actions.showView('ForgotPswView')}>
                     <Text style={nativeStyles.buttonText}>{this.getText('label_forgotten_password')}</Text>
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
   signInButton: {
      marginTop: 20,
      marginBottom: 20,
      alignSelf: 'center'
   },
   noAccountButton: {
      marginBottom: 20,
      alignSelf: 'center'
   },
   buttonText: {
      fontSize: 17,
      fontWeight: '600'
   },
   buttonTextWhite: {
      fontSize: 19,
      fontWeight: '700',
      color: 'white'
   }
};
