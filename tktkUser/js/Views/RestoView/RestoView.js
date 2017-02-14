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

class RestoView extends Component {

   constructor(props) {
      super(props);
   }

   componentWillMount() {
      this.props.commonFuncs.onSetTextHeader(this.getText('text_header') + this.props.line.linename);
   }

   getAction() {
      return {
         showView: (title) => {
            this.props.navigator.push({title: title});
         }
      };
   }

   getText(code, noPrefix) {
      return text.getText((noPrefix
         ? ""
         : "RestoView.") + code);
   }

   manageLostConnection() {
      let checkAgainLater = () => {
         if (!this.props.connected) {
            asyncApi.defaultErrorAction(this.props.navigator);
         }
      }
      setTimeout(checkAgainLater, 3000);
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
      if (!this.props.connected)
         this.manageLostConnection();

      const actions = this.getAction();

      return (
         <View style={styles.container}>
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
   content: {
      backgroundColor: 'rgb(238, 238, 238)'
   },
   articlesContainer: {
      margin: 15
   }
});

export default createContainer(props => {

   const payload = props.params.line.urlname;
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
      line: asyncApi.findOne('lines', {urlname: props.params.line.urlname}),
      articles: asyncApi.find('items')
   }

   return data;
}, RestoView);
