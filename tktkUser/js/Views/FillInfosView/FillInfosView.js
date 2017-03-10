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

export default class FillInfosView extends Component {
  // This view is used to create a new account


  // ----------------------------------------
  // ----- Component actions

  constructor(props) {
    super(props);

    console.log(props.params);

    const prefill = props.params.prefillFields;

    this.state = {
      lastname: prefill.lastname ? prefill.lastname : "",
      firstname: prefill.firstname ? prefill.firstname : "",
      street: "",
      npa: "",
      city: prefill.city ? prefill.city : "",
      tel: "",
      email: prefill.email ? prefill.email : "",
      lastnameError: "",
      firstnameError: "",
      streetError: "",
      npaError: "",
      cityError: "",
      telError: "",
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
      fillInfos: () => {
        if (this.validateForm()) {

          const payload = {
            loginId: this.props.login._id,
            token: this.props.login.token,
            userInfos: {
              name: this.state.lastname,
              firstname: this.state.firstname,
              email: this.state.email.toLowerCase(),
              phonenbr: this.state.tel,
              npa: this.state.npa,
              street: this.state.street,
              city: this.state.city
            }
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
                emailError: ""
              });
            } else {
              if (!res.problem) {
                this.setState({
                  lastname: "",
                  firstname: "",
                  street: "",
                  npa: "",
                  city: "",
                  tel: "",
                  email: "",
                  lastnameError: "",
                  firstnameError: "",
                  streetError: "",
                  npaError: "",
                  cityError: "",
                  telError: "",
                  emailError: ""
                });

                this.props.onSignIn({
                  email: "",
                  password: ""
                }, res);
                this.props.navigator.push({title: 'ListRestoView'});

              } else {
                Alert.alert('', res.message);
                this.setState({
                  lastnameError: "",
                  firstnameError: "",
                  streetError: "",
                  npaError: "",
                  cityError: "",
                  telError: "",
                  emailError: ""
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
              emailError: ""
            });
          };

          asyncApi.callAsyncServer('createUserForLogin', payload, cbSuccess, cbError);
        }
      }
    };
  }

  getText(code, noPrefix) {
    return text.getText((noPrefix ? "" : "FillInfosView.") + code);
  }

  verifyEmpty(text) {
    if (!text) {
      return this.getText('error_empty');
    }
    return false;
  }

  validateForm() {
    let r = true;

    const {
      lastname,
      firstname,
      street,
      npa,
      city,
      tel,
      email
    } = this.state;

    let {
      lastnameError,
      firstnameError,
      streetError,
      npaError,
      cityError,
      telError,
      emailError
    } = "";

    const regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regEmail.test(email)) {
      emailError = this.getText('error_invalid_email');
      r = false
    }

    const regNPA = /^\d{4}$/;
    if (!regNPA.test(npa)) {
      npaError = this.getText('error_invalid_npa');
      r = false;
    }

    if (!lastname || !firstname || !street || !npa || !city || !tel || !email) {
      lastnameError = this.verifyEmpty(lastname) || lastnameError,
      firstnameError = this.verifyEmpty(firstname) || firstnameError,
      streetError = this.verifyEmpty(street) || streetError,
      npaError = this.verifyEmpty(npa) || npaError,
      cityError = this.verifyEmpty(city) || cityError,
      telError = this.verifyEmpty(tel) || telError,
      emailError = this.verifyEmpty(email) || emailError
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
        emailError
      });
    }

    return r;
  }


  // ----------------------------------------
  // ----- Render

  render() {
    const actions = this.getAction();

    const {
      lastname,
      firstname,
      street,
      npa,
      city,
      tel,
      email,
      lastnameError,
      firstnameError,
      streetError,
      npaError,
      cityError,
      telError,
      emailError
    } = this.state;

    const lastnameErrorComp = this.renderError(lastnameError);
    const firstnameErrorComp = this.renderError(firstnameError);
    const streetErrorComp = this.renderError(streetError);
    const npaErrorComp = this.renderError(npaError);
    const cityErrorComp = this.renderError(cityError);
    const telErrorComp = this.renderError(telError);
    const emailErrorComp = this.renderError(emailError);

    const boolError = function(error) {
      return error ? true : false;
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
          <Text style={nativeStyles.textIntro}>{this.getText('text_intro')}</Text>
          <Form>
            <Item stackedLabel error={boolError(lastnameErrorComp)}>
              <Label>{this.getText('form_label.lastname')}</Label>
              <Input autoCorrect={false} onChangeText={(lastname) => this.setState({lastname, lastnameError: ""})} value={lastname}/>
            </Item>
            {lastnameErrorComp}
            <Item style={nativeStyles.secondInput} stackedLabel error={boolError(firstnameErrorComp)}>
              <Label>{this.getText('form_label.firstname')}</Label>
              <Input autoCorrect={false} onChangeText={(firstname) => this.setState({firstname, firstnameError: ""})} value={firstname}/>
            </Item>
            {firstnameErrorComp}
            <Item style={nativeStyles.secondInput} stackedLabel error={boolError(streetErrorComp)}>
              <Label>{this.getText('form_label.street')}</Label>
              <Input autoCorrect={false} onChangeText={(street) => this.setState({street, streetError: ""})} value={street}/>
            </Item>
            {streetErrorComp}
            <Item style={nativeStyles.secondInput} stackedLabel error={boolError(npaErrorComp)}>
              <Label>{this.getText('form_label.npa')}</Label>
              <Input autoCorrect={false} onChangeText={(npa) => this.setState({npa, npaError: ""})} value={npa}/>
            </Item>
            {npaErrorComp}
            <Item style={nativeStyles.secondInput} stackedLabel error={boolError(cityErrorComp)}>
              <Label>{this.getText('form_label.city')}</Label>
              <Input autoCorrect={false} onChangeText={(city) => this.setState({city, cityError: ""})} value={city}/>
            </Item>
            {cityErrorComp}
            <Item style={nativeStyles.secondInput} stackedLabel error={boolError(telErrorComp)}>
              <Label>{this.getText('form_label.tel')}</Label>
              <Input autoCorrect={false} onChangeText={(tel) => this.setState({tel, telError: ""})} value={tel}/>
            </Item>
            {telErrorComp}
            <Item style={nativeStyles.secondInput} stackedLabel error={boolError(emailErrorComp)}>
              <Label>{this.getText('form_label.email')}</Label>
              <Input autoCorrect={false} onChangeText={(email) => this.setState({email, emailError: ""})} value={email}/>
            </Item>
            {emailErrorComp}
            <Button style={nativeStyles.fillInfosButton} info onPress={actions.fillInfos}>
              <Text style={nativeStyles.buttonText}>{this.getText('label_fillinfos_button')}</Text>
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
  secondInput: {
    marginTop: 20
  },
  fillInfosButton: {
    marginTop: 20,
    marginBottom: 20,
    alignSelf: 'center'
  },
  buttonText: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white'
  },
  textIntro: {
    margin: 20,
    fontWeight: '600'
  }
};
