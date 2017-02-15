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
import Article from './Article.js';
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';

class RestoView extends Component {

   constructor(props) {
      super(props);
   }

   getAction() {
      return {
         showView: (title) => {
            this.props.navigator.push({title: title});
         },
         goBack: () => {
            const from = this.props.params.from;
            this.props.navigator.push({title: from.view, anim: 1, params: from.params});
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

      return tab;
   }

   render() {
      if (!this.props.connected)
         this.manageLostConnection();

      const actions = this.getAction();

      return (
         <Container>
            <Header>
               <Left>
                  <Button onPress={actions.goBack} transparent>
                     <Icon name='arrow-back'/>
                  </Button>
               </Left>
               <Body>
                  <Title>{this.getText('text_header') + this.props.line.linename}</Title>
               </Body>
               <Right/>
            </Header>
            <Content>{this.renderArticles(actions)}</Content>
         </Container>
      );
   }
}

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
