import React, {Component} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import * as text from '../../libs/text.js';

export default class EndOrderView extends Component {

   getAction() {
      return {
         showView: (title) => {
            this.props.navigator.replace({title: title});
         }
      };
   }

   getText(code) {
      return text.getText("EndOrderView." + code);
   }

   render() {
      const actions = this.getAction();

      return (
         <View>
            <Text>{this.getText('label_endorder')}</Text>
            <Button onPress={actions.showView.bind(this, 'RestoView')} title={this.getText('label_resto')} color="blue"/>
            <Button onPress={actions.showView.bind(this, 'OrderView')} title={this.getText('label_order')} color="blue"/>
         </View>
      );
   }
}

var styles = StyleSheet.create({});
