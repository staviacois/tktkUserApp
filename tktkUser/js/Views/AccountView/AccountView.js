import React, {Component} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import * as text from '../../libs/text.js';

export default class AccountView extends Component {

   getAction() {
      return {
         showView: (title) => {
            this.props.navigator.replace({title: title});
         }
      };
   }

   getText(code) {
      return text.getText("AccountView." + code);
   }

   render() {
      const actions = this.getAction();

      return (
         <View>
            <Text>{this.getText('label_account')}</Text>
            <Button onPress={actions.showView.bind(this, 'HomeView')} title={this.getText('label_home')} color="blue"/>
            <Button onPress={actions.showView.bind(this, 'MapRestoView')} title={this.getText('label_mapresto')} color="blue"/>
            <Button onPress={actions.showView.bind(this, 'ListRestoView')} title={this.getText('label_listresto')} color="blue"/>
         </View>
      );
   }
}

var styles = StyleSheet.create({});
