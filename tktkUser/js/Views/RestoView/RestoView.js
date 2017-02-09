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
import Article from './Article.js';
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';

class Resto extends Component {

   constructor(props) {
      super(props);
   }

   getAction() {
      return {
         showView: (title) => {
            this.props.navigator.push({title: title});
         }
      };
   }

   getText(code) {
      return text.getText("ListRestoView." + code);
   }

   renderArticles(actions) {
      const tab = [];

      this.props.articles.forEach((article) => {
         tab.push(<Article key={article._id} article={article}/>);
      });

      return (
         <View style={styles.articlesContainer}>
            {tab}
         </View>
      );
   }

   render() {
      const actions = this.getAction();

      return (
         <View style={styles.container}>
            <View style={styles.header}>
               <Text style={styles.headerText}>{this.getText('text_header')}</Text>
            </View>
            <ScrollView style={styles.content}>{this.renderArticles(actions)}</ScrollView>
         </View>
      );
   }
}

var styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: 'white'
   },
   header: {
      backgroundColor: 'rgb(230, 50, 12)',
      height: 55,
      justifyContent: 'center'
   },
   headerText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 20
   },
   content: {
      backgroundColor: 'rgb(238, 238, 238)'
   },
   articlesContainer: {
      margin: 15
   }
});

export default createContainer(props => {

   const payload = props.params.urlName;
   const handleSubs = asyncApi.multiSubscribe([
      {
         name: 'lineChoose',
         payload: payload
      }, {
         name: 'itemsForPublic',
         payload: payload
      }
   ]);

   const data = {
      connected: asyncApi.checkConnection(),
      ready: handleSubs.ready(),
      line: asyncApi.findOne('lines', {urlname: props.params.urlName}),
      articles: asyncApi.find('items')
   }

   return data;
}, Resto);
