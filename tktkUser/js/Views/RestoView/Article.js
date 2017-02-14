import React, {Component} from 'react';
import {
   StyleSheet,
   View,
   Text,
   ScrollView,
   TextInput,
   TouchableHighlight,
   Alert
} from 'react-native';
import {
   Container,
   Header,
   Content,
   Title,
   Icon,
   List,
   ListItem,
   Left,
   Body,
   Right,
   Button,
   StyleProvider,
   Input,
   Label,
   Item,
   Form,
   Card,
   CardItem
} from 'native-base';
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
         <Card>
            <CardItem>
               <Text style={nativeStyles.title}>{this.props.article.name}</Text>
            </CardItem>
            <CardItem>
               <Text>{this.props.article.description}</Text>
            </CardItem>
            <CardItem>
               <Text>{this.props.article.price + " CHF"}</Text>
            </CardItem>
         </Card>
      );

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

var nativeStyles = {
   title: {
      fontWeight: '600'
   }
};

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
