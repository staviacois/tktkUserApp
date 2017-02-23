// ----------------------------------------
// ----- Imports

// npm
import React, {Component} from 'react';
import {View, Text, Alert} from 'react-native';
import {
  Container,
  Content,
  Title,
  Icon,
  Left,
  Body,
  Right,
  Button,
  Input,
  Item,
  Form
} from 'native-base';
import FBSDK, {LoginButton, AccessToken, LoginManager} from 'react-native-fbsdk';

// libs
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';
import * as storage from '../../libs/storage.js';

// components
import Header from '../../Components/Header.js';
import Logo from '../../Components/Logo.js';

export default class SignInView extends Component {
  // This view is used to login, to access to the app


  // ----------------------------------------
  // ----- Component actions

  constructor(props) {
    super(props);

    this.state = {
      email: "test@test.com",
      password: "123",
      emailError: "",
      passwordError: ""
    }
  }


  // ----------------------------------------
  // ----- Our actions

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
                storage.get('@Ticket' + res._id, (err, val) => {
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
      },
      signInFB: () => {
        const cbError = (error) => {
          console.log(error);
        };

        const cbLoginFBOk = (infosFB) => {
          this.setState({test: true});

          const payload = {
            accessToken: infosFB.accessToken,
            userID: infosFB.userID,
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
                  email: "",
                  password: ""
                }, res);

                if (res.docid) {
                  // Get the current ticket from storage
                  storage.get('@Ticket' + res._id, (err, val) => {
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
                  this.props.navigator.push({title: 'FillInfosView'});
                }

                console.log(res);
              } else {
                Alert.alert('', res.message);
                this.setState({emailError: "", passwordError: ""});
              }
            }
          };

          const cbError = () => {
            this.setState({emailError: "", passwordError: ""});
          }

          asyncApi.callAsyncServer('loginFB', payload, cbSuccess, cbError, true);

        };

        const cbSuccess = (data) => {
          if (data) {
            cbLoginFBOk(data);
          } else {
            const cbSuccess = (result) => {
              if (!result.isCancelled) {
                AccessToken.getCurrentAccessToken().then(cbLoginFBOk, cbError);
              }
            };
            LoginManager.logInWithReadPermissions(['user_location']).then(cbSuccess, cbError);
          }
        };
        AccessToken.getCurrentAccessToken().then(cbSuccess, cbError);
      }
    };
  }

  getText(code, noPrefix) {
    return text.getText((noPrefix ? "" : "SignInView.") + code);
  }

  verifyEmpty(text) {
    if (!text) {
      return this.getText('error_empty');
    }
    return "";
  }

  validateForm() {
    const {
      email,
      password
    } = this.state;

    if (!email || !password) {
      this.setState({
        emailError: this.verifyEmpty(email),
        passwordError: this.verifyEmpty(password)
      });
      return false;
    }
    return true;
  }


  // ----------------------------------------
  // ----- Render

  render() {
    const actions = this.getAction();

    const {
      email,
      password,
      emailError,
      passwordError
    } = this.state;

    const emailErrorComp = this.renderError(emailError);
    const passwordErrorComp = this.renderError(passwordError);

    const onSubmit = () => {
      if (email && password) {
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
          <Logo/>
          <Form>
            <Item error={boolError(emailErrorComp)}>
              <Input placeholder={this.getText('form_label.email')} onSubmitEditing={onSubmit} autoCorrect={false} onChangeText={(email) => this.setState({email, emailError: ""})} value={email}/>
              {emailErrorComp}
            </Item>
            <Item error={boolError(passwordErrorComp)}>
              <Input placeholder={this.getText('form_label.password')} onSubmitEditing={onSubmit} onChangeText={(password) => this.setState({password, passwordError: ""})} value={password} secureTextEntry={true}/>
              {passwordErrorComp}
            </Item>
            <Button style={nativeStyles.signInButton} info onPress={actions.signIn}>
              <Text style={nativeStyles.buttonTextWhite}>{this.getText('label_signin_button')}</Text>
            </Button>
            <Button style={nativeStyles.noAccountButton} info onPress={actions.signInFB}>
              <Text style={nativeStyles.buttonTextWhite}>{this.getText('label_signinfb_button')}</Text>
            </Button>
            <Button style={nativeStyles.noAccountButton} light onPress={() => actions.showView('ForgotPswView')}>
              <Text style={nativeStyles.buttonText}>{this.getText('label_forgotten_password')}</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }

  renderError(error) {
    if (error) {
      return (
        <Text style={nativeStyles.errorLabel}>{error}</Text>
      );
    }
    return null;
  }
}


// ----------------------------------------
// ----- Styles

var nativeStyles = {
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
