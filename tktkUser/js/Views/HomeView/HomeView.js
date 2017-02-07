import React, {Component} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import * as text from '../../libs/text.js';

export default class HomeView extends Component {

   getAction() {
      return {
         showView: (title) => {
            this.props.navigator.replace({title: title});
         }
      };
   }

   getText(code) {
      return text.getText("HomeView." + code);
   }

   render() {
      const actions = this.getAction();

      return (
         <View>
            <Text>{this.getText('label_home')}</Text>
            <Button onPress={actions.showView.bind(this, "SignUpView")} title={this.getText('label_signup')} color="blue"/>
            <Button onPress={actions.showView.bind(this, "SignInView")} title={this.getText('label_signin')} color="blue"/>
         </View>
      );
   }
}

var styles = StyleSheet.create({});
