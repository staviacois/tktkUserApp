import React, {Component} from 'react';
import {StyleSheet, View, Text, Button} from 'react-native';
import * as text from '../../libs/text.js';

export default class ForgotPswView extends Component {

   getAction() {
      return {
         showView: (title) => {
            this.props.navigator.push({title: title});
         }
      };
   }

   getText(code) {
      return text.getText("ForgotPswView." + code);
   }

   render() {
      const actions = this.getAction();

      return (
         <View style={styles.container}>
            <Text>{this.getText('label_forgotpsw')}</Text>
            <Button onPress={actions.showView.bind(this, 'HomeView')} title={this.getText('label_home')} color="blue"/>
         </View>
      );
   }
}

var styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: 'white'
   }
});
