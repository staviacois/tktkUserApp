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
      console.log(this.props.login);
      const actions = this.getAction();

      return (
         <Container>
            <Header>
               <Left>
                  <Button onPress={this.props.commonFuncs.onOpenMenu} transparent>
                     <Icon name='menu'/>
                  </Button>
               </Left>
               <Body>
                  <Title>{this.getText('text_header')}</Title>
               </Body>
               <Right/>
            </Header>
            <Content>
               <Form>
                  <Item style={nativeStyles.input} stackedLabel>
                     <Label>{this.getText('label_name')}</Label>
                     <Input disabled onChangeText={(name) => this.setState({name, nameError: ""})} value={this.state.name}/>
                  </Item>
                  <Item style={nativeStyles.input} stackedLabel>
                     <Label>{this.getText('label_tel')}</Label>
                     <Input disabled onChangeText={(tel) => this.setState({tel, telError: ""})} value={this.state.tel}/>
                  </Item>
                  <Item style={nativeStyles.input} stackedLabel>
                     <Label>{this.getText('label_address')}</Label>
                     <Input disabled onChangeText={(address) => this.setState({address, addressError: ""})} value={this.state.address}/>
                  </Item>
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
