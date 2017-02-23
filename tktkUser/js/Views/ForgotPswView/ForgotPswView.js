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
  Label,
  Item,
  Form
} from 'native-base';

// libs
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';

// components
import Header from '../../Components/Header.js';
import Logo from '../../Components/Logo.js';

export default class ForgotPswView extends Component {
  // This view is used to recover password if forgotten


  // ----------------------------------------
  // ----- Component actions

  constructor(props) {
    super(props);

    this.state = {
      email: "test@test.com",
      emailError: ""
    }
  }


  // ----------------------------------------
  // ----- Our actions

  getAction() {
    return {
      showView: (title, anim) => {
        this.props.navigator.push({title: title, anim: anim});
      },
      next: () => {
        if (this.validateForm()) {

          const payload = {
            email: this.state.email
          }

          const cbSuccess = (err, res) => {
            if (err) {
              Alert.alert('', this.getText("generic_error_message") + " (" + err.error + ")");
              this.setState({emailError: ""});
            } else {
              if (!res.problem) {
                this.setState({emailError: ""});
                Alert.alert('', this.getText('text_success'));
              } else {
                Alert.alert('', res.message);
                this.setState({emailError: ""});
              }
            }
          };

          const cbError = () => {
            this.setState({emailError: ""});
          }

          // TODO : implement this server method
          //asyncApi.callAsyncServer('recoverPassword', payload, cbSuccess, cbError, true);
        }
      }
    };
  }

  getText(code, noPrefix) {
    return text.getText((noPrefix ? "" : "ForgotPswView.") + code);
  }

  validateForm() {
    if (!this.state.email) {
      this.setState({emailError: this.getText('error_empty')});
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
      emailError
    } = this.state;

    const emailErrorComp = this.renderError(emailError);

    const onSubmit = () => {
      if (email) {
        actions.next();
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
            <Button onPress={() => actions.showView('SignInView', 1)} transparent>
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
            <Item stackedLabel error={boolError(emailErrorComp)}>
              <Label>{this.getText('label_email')}</Label>
              <Input onSubmitEditing={onSubmit} autoCorrect={false} onChangeText={(email) => this.setState({email, emailError: ""})} value={email}/>
            </Item>
            {emailErrorComp}
            <Button style={nativeStyles.nextButton} info onPress={actions.signIn}>
              <Text style={nativeStyles.buttonTextWhite}>{this.getText('label_next_button')}</Text>
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
    paddingLeft: 25,
    color: '#a94442',
    fontWeight: '600'
  },
  nextButton: {
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center'
  },
  buttonTextWhite: {
    fontSize: 19,
    fontWeight: '700',
    color: 'white'
  }
};
