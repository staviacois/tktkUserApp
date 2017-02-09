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

export default class Article extends Component {

   constructor(props) {
      super(props);
   }

   getAction() {
      return {};
   }

   getText(code) {
      return text.getText("RestoView." + code);
   }

   render() {
      const actions = this.getAction();

      return (
         <View style={styles.container}>
            <Text style={styles.text}>{this.props.article.name}</Text>
            <View style={styles.separator}/>
            <Text style={styles.text}>{this.props.article.description}</Text>
            <View style={styles.separator}/>
            <Text style={styles.text}>{this.props.article.price + " CHF"}</Text>
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
