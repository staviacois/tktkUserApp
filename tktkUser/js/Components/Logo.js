import React, {Component} from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';

export default class Logo extends Component {

   render() {
      //return (<Image source={require('../../images/logo.png')}/>);

      return (
         <View>
            <Text style={styles.q}>L</Text>
            <Text style={styles.manager}>logo</Text>
         </View>
      );
   }
}

var styles = StyleSheet.create({
   q: {
      fontSize: 130,
      textAlign: 'center',
      color: '#333'
   },
   manager: {
      fontSize: 30,
      textAlign: 'center',
      color: '#333'
   }
});
