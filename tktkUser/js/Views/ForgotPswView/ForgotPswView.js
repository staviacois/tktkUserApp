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
import * as storage from '../../libs/storage.js';

import Logo from '../../Components/Logo.js';

export default class ForgotPswView extends Component {
   // This view is used to recover password if forgotten

   constructor(props) {
      super(props);

      this.state = {
         email: "test@test.com",
         emailError: ""
      }
   }

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
      return text.getText((noPrefix
         ? ""
         : "ForgotPswView.") + code);
   }

   validateForm() {
      if (!this.state.email) {
         this.setState({emailError: this.getText('error_empty')});
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

      const onSubmit = () => {
         if (this.state.email) {
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
               <View style={nativeStyles.logoContainer}>
                  <Logo/>
               </View>
               <Form>
                  <Item stackedLabel error={boolError(emailError)}>
                     <Label>{this.getText('label_email')}</Label>
                     <Input onSubmitEditing={onSubmit} autoCorrect={false} onChangeText={(email) => this.setState({email, emailError: ""})} value={this.state.email}/>
                  </Item>
                  {emailError}
                  <Button style={nativeStyles.nextButton} info onPress={actions.signIn}>
                     <Text style={nativeStyles.buttonTextWhite}>{this.getText('label_next_button')}</Text>
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
