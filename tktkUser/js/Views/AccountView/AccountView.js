import React, {Component} from 'react';
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
   Form,
   Footer,
   FooterTab
} from 'native-base';
import * as text from '../../libs/text.js';
import Header from '../../Components/Header.js';

export default class AccountView extends Component {
   // This view is used to show and edit user's informations

   constructor(props) {
      super(props);

      const login = this.props.login;

      this.state = {
         name: login.completName,
         tel: login.phonenbr,
         address: login.street + ", " + login.npa + " " + login.city,
         nameError: "",
         telError: "",
         addressError: ""
      }
   }

   getAction() {
      return {
         showView: (title, anim) => {
            this.props.navigator.push({title: title, anim: anim});
         }
      };
   }

   getText(code, noPrefix) {
      return text.getText((noPrefix
         ? ""
         : "AccountView.") + code);
   }

   render() {
      const actions = this.getAction();

      return (
         <Container>
            <Header>
               <Left/>
               <Body>
                  <Title>{this.getText('text_header')}</Title>
               </Body>
               <Right>
                  <Button onPress={this.props.onSignOut} transparent>
                     <Icon name='log-out'/>
                  </Button>
               </Right>
            </Header>
            <Content>
               <Form>
                  <Item disabled style={nativeStyles.input} stackedLabel>
                     <Label>{this.getText('label_name')}</Label>
                     <Input disabled onChangeText={(name) => this.setState({name, nameError: ""})} value={this.state.name}/>
                  </Item>
                  <Item disabled style={nativeStyles.input} stackedLabel>
                     <Label>{this.getText('label_tel')}</Label>
                     <Input disabled onChangeText={(tel) => this.setState({tel, telError: ""})} value={this.state.tel}/>
                  </Item>
                  <Item disabled style={nativeStyles.input} stackedLabel>
                     <Label>{this.getText('label_address')}</Label>
                     <Input disabled onChangeText={(address) => this.setState({address, addressError: ""})} value={this.state.address}/>
                  </Item>
               </Form>
            </Content>
            <Footer>
               <FooterTab>
                  <Button active>
                     <Icon active name="person"/>
                  </Button>
                  <Button onPress={() => actions.showView('ListRestoView')}>
                     <Icon name="list"/>
                  </Button>
                  <Button onPress={() => actions.showView('MapRestoView')}>
                     <Icon name="compass"/>
                  </Button>
               </FooterTab>
            </Footer>
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
   },
   input: {
      marginTop: 20
   }
};
