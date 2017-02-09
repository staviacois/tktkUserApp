import React, {Component} from 'react';
import {
   StyleSheet,
   View,
   Text,
   Button,
   ScrollView,
   TextInput,
   TouchableHighlight,
   Alert
} from 'react-native';
import {createContainer} from 'react-native-meteor';
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';

export default class Resto extends Component {

   constructor(props) {
      super(props);
   }

   getAction() {
      return {
         showLine: (urlName) => {
            this.props.navigator.push({
               title: 'RestoView',
               params: {
                  urlName: urlName
               }
            });
         }
      };
   }

   getText(code) {
      return text.getText("ListRestoView." + code);
   }

   render() {
      const actions = this.getAction();

      const address = this.props.line.adress;

      return (
         <View style={styles.container}>
            <Text style={styles.text}>{this.props.line.linename}</Text>
            <View style={styles.separator}/>
            <Text style={styles.text}>{address.route + " " + address.street_number + ", " + address.postal_code + " " + address.locality}</Text>
            <View style={styles.separator}/>
            <Text onPress={() => actions.showLine(this.props.line.urlname)} style={[styles.text, styles.textDetails]}>{this.getText('label_details') + " >"}</Text>
         </View>
      );
   }
}

var styles = StyleSheet.create({
   container: {
      backgroundColor: 'white',
      marginBottom: 15
   },
   separator: {
      height: 2,
      backgroundColor: '#eee',
      marginLeft: 13,
      marginRight: 13
   },
   text: {
      padding: 13
   },
   textDetails: {
      textAlign: 'right'
   }
});
