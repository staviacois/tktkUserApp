import React, {Component} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import * as text from '../../libs/text.js';

export default class RestoView extends Component {

   getAction() {
      return {
         showView: (title) => {
            this.props.navigator.replace({title: title});
         }
      };
   }

   getText(code) {
      return text.getText("RestoView." + code);
   }

   render() {
      const actions = this.getAction();

      return (
         <View>
            <Text>{this.getText('label_resto')}</Text>
            <Button onPress={actions.showView.bind(this, 'ListRestoView')} title={this.getText('label_listresto')} color="blue"/>
            <Button onPress={actions.showView.bind(this, 'MapRestoView')} title={this.getText('label_mapresto')} color="blue"/>
            <Button onPress={actions.showView.bind(this, 'EndOrderView')} title={this.getText('label_endorder')} color="blue"/>
         </View>
      );
   }
}

var styles = StyleSheet.create({});
