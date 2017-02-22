import React, {Component} from 'react';
import {View, Image} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class Logo extends Component {

   render() {
      return (
         <View style={nativeStyles.logoContainer}>
            <LinearGradient start={{
               x: 0.0,
               y: 0.0
            }} end={{
               x: 0.5,
               y: 1.0
            }} colors={['#E53919', '#EC5E18']} style={nativeStyles.logoSubContainer}>
               <Image source={require('../../images/logo.png')}/>
            </LinearGradient>
         </View>
      );
   }
}

var nativeStyles = {
   logoContainer: {
      marginTop: 35,
      marginBottom: 25,
      justifyContent: 'center',
      alignItems: 'center'
   },
   logoSubContainer: {
      padding: 20,
      borderRadius: 40
   }
}
