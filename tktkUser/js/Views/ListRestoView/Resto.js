import React, {Component} from 'react';
import {
   StyleSheet,
   View,
   Text,
   ScrollView,
   TextInput,
   TouchableHighlight,
   Alert,
   PixelRatio
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

export default class Resto extends Component {

   constructor(props) {
      super(props);
   }

   getAction() {
      return {
         showLine: () => {
            this.props.navigator.push({
               title: 'RestoView',
               params: {
                  line: this.props.line
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
         <Card style={nativeStyles.container}>
            <ListItem>
               <Text style={nativeStyles.linename}>{this.props.line.linename}</Text>
            </ListItem>
            <ListItem>
               <Text >{address.route + " " + address.street_number + ", " + address.postal_code + " " + address.locality}</Text>
            </ListItem>
            <ListItem style={nativeStyles.details} onPress={() => actions.showLine()}>
               <Body style={nativeStyles.detailsBody}>
                  <Text>{this.getText('label_details')}</Text>
               </Body>
               <Right>
                  <Icon name="arrow-forward"/>
               </Right>
            </ListItem>
         </Card>
      );
   }
}

var nativeStyles = {
   container: {
      margin: 10
   },
   details: {
      borderWidth: 0
   },
   detailsBody: {
      justifyContent: 'center'
   },
   linename: {
      fontWeight: '600'
   }
};
