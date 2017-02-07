import React, {Component} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import * as text from '../../libs/text.js';

export default class OrderView extends Component {

   getAction() {
      return {
         showView: (title) => {
            this.props.navigator.replace({title: title});
         }
      };
   }

   getText(code) {
      return text.getText("OrderView." + code);
   }

   render() {
      const actions = this.getAction();

      return (
         <View>
            <Text>{this.getText('label_order')}</Text>
            <Button onPress={actions.showView.bind(this, 'ListRestoView')} title={this.getText('label_listresto')} color="blue"/>
         </View>
      );
   }
}

var styles = StyleSheet.create({});
