import React, {Component} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import * as text from '../../libs/text.js';

export default class ListRestoView extends Component {

   getAction() {
      return {
         showView: (title) => {
            this.props.navigator.replace({title: title});
         }
      };
   }

   getText(code) {
      return text.getText("ListRestoView." + code);
   }

   render() {
      const actions = this.getAction();

      return (
         <View>
            <Text>{this.getText('label_listresto')}</Text>
            <Button onPress={actions.showView.bind(this, 'HomeView')} title={this.getText('label_home')} color="blue"/>
            <Button onPress={actions.showView.bind(this, 'MapRestoView')} title={this.getText('label_mapresto')} color="blue"/>
            <Button onPress={actions.showView.bind(this, 'AccountView')} title={this.getText('label_account')} color="blue"/>
            <Button onPress={actions.showView.bind(this, 'RestoView')} title={this.getText('label_resto')} color="blue"/>
         </View>
      );
   }
}

var styles = StyleSheet.create({});
