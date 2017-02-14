import React, {Component} from 'react';
import {StyleSheet, View, Text} from 'react-native';
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
   StyleProvider
} from 'native-base';
import * as text from '../../libs/text.js';
import Logo from '../../Components/Logo.js';

export default class HomeView extends Component {

   getAction() {
      return {
         showView: (title) => {
            this.props.navigator.push({title: title});
         }
      };
   }

   getText(code, noPrefix) {
      return text.getText((noPrefix
         ? ""
         : "HomeView.") + code);
   }

   componentDidMount() {
      if (this.props.params.networkError) {
         Alert.alert('', this.getText('not_connected'));
      }
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
               <Right/>
            </Header>
            <Content>
               <View style={nativeStyles.logoContainer}>
                  <Logo/>
               </View>
               <View>
                  <List>
                     <ListItem button onPress={() => actions.showView('SignInView')}>
                        <Body>
                           <Text>{this.getText('label_signin')}</Text>
                        </Body>
                        <Right>
                           <Icon name="ios-arrow-forward"/>
                        </Right>
                     </ListItem>
                     <ListItem iconLeft iconRight button onPress={() => actions.showView('SignUpView')}>
                        <Body>
                           <Text>{this.getText('label_signup')}</Text>
                        </Body>
                        <Right>
                           <Icon name="ios-arrow-forward"/>
                        </Right>
                     </ListItem>
                  </List>
               </View>
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
   }
};
