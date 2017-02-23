// ----------------------------------------
// ----- Imports

// npm
import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {
  Container,
  Content,
  Title,
  Icon,
  List,
  ListItem,
  Left,
  Body,
  Right
} from 'native-base';

// libs
import * as text from '../../libs/text.js';

// components
import Header from '../../Components/Header.js';
import Logo from '../../Components/Logo.js';

export default class HomeView extends Component {
  // This view is the default view at application startup
  // It gives access to SignInView and SignUpView


  // ----------------------------------------
  // ----- Our actions

  getAction() {
    return {
      showView: (title) => {
        this.props.navigator.push({title: title});
      }
    };
  }

  getText(code, noPrefix) {
    return text.getText((noPrefix ? "" : "HomeView.") + code);
  }

  componentDidMount() {
    if (this.props.params.networkError) {
      Alert.alert('', this.getText('not_connected'));
    }
  }


  // ----------------------------------------
  // ----- Render

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
          <Logo/>
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
