// ----------------------------------------
// ----- Imports

// npm
import React, {Component} from 'react';
import {View, Image} from 'react-native';
import {Header} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';

export default class CustomHeader extends Component {

  
  // ----------------------------------------
  // ----- Render

  render() {
    const start = {
      x: 0.0,
      y: 0.0
    };

    const end = {
      x: 1.0,
      y: 1.0
    };

    const colors = ['#E53919', '#EC5E18'];

    return (
      <LinearGradient start={start} end={end} colors={colors}>
        <Header>
          {this.props.children}
        </Header>
      </LinearGradient>
    );
  }
}
