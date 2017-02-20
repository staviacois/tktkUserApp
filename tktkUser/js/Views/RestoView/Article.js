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
   CardItem,
   Badge
} from 'native-base';
import {createContainer} from 'react-native-meteor';
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';

export default class Article extends Component {

   constructor(props) {
      super(props);

      this.add = this.add.bind(this);
      this.remove = this.remove.bind(this);
   }

   getAction() {
      return {};
   }

   getText(code) {
      return text.getText("RestoView." + code);
   }

   add() {
      this.props.article.count++;
      this.props.onRefresh();
   }

   remove() {
      if (this.props.article.count) {
         this.props.article.count--;
         this.props.onRefresh();
      }
   }

   render() {
      const actions = this.getAction();

      const article = this.props.article;

      let iconEnable = null;
      if (article.available) {
         if (article.count) {
            iconEnable = (
               <Badge>
                  <Text style={nativeStyles.badgeText}>{article.count}</Text>
               </Badge>
            );
         } else {
            iconEnable = (<Icon name='checkmark-circle' style={{
               color: 'green'
            }}/>);
         }
      } else {
         iconEnable = (<Icon name='close-circle' style={{
            color: 'red'
         }}/>);
      }

      let iconsAddRemove = null;
      if (article.available) {
         if (article.count) {
            iconsAddRemove = (
               <View style={nativeStyles.row}>
                  <Button style={nativeStyles.addRemoveButtons} rounded info onPress={this.remove}>
                     <Icon name='remove'/>
                  </Button>
                  <Button style={nativeStyles.addRemoveButtons} rounded info onPress={this.add}>
                     <Icon name='add'/>
                  </Button>
               </View>
            );
         } else {
            iconsAddRemove = (
               <Button style={nativeStyles.addRemoveButtons} rounded info onPress={this.add}>
                  <Icon name='add'/>
               </Button>
            );
         }
      }

      return (
         <Card style={nativeStyles.container}>
            <CardItem>
               <Body>
                  <Text style={nativeStyles.title}>{article.name}</Text>
               </Body>
               <Right style={nativeStyles.badgeContainer}>
                  {iconEnable}
               </Right>
            </CardItem>
            <CardItem>
               <Text>{article.description}</Text>
            </CardItem>
            <CardItem>
               <Body>
                  <Text>{article.price + " CHF"}</Text>
               </Body>
               <Right>
                  {iconsAddRemove}
               </Right>
            </CardItem>
         </Card>
      );
   }
}

var nativeStyles = {
   container: {
      margin: 10
   },
   title: {
      fontWeight: '600',
      fontSize: 15
   },
   row: {
      flexDirection: 'row'
   },
   addRemoveButtons: {
      paddingLeft: 12,
      paddingRight: 12,
      marginLeft: 8
   },
   badgeText: {
      color: 'white',
      fontWeight: '700'
   },
   badgeContainer: {
      height: 26
   }
};
