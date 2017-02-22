import React, {Component} from 'react';
import {Text, Linking} from 'react-native';
import {
   Container,
   Content,
   Title,
   Icon,
   ListItem,
   Left,
   Body,
   Right,
   Button,
   Card,
   CardItem,
   Footer
} from 'native-base';
import {createContainer} from 'react-native-meteor';
import Article from './Article.js';
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';
import Header from '../../Components/Header.js';

class RestoView extends Component {
   // This view shows infos and articles from a line
   // This view is used to chose articles from a list, and access to EndOrderView to finalize the order

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
         },
         showEndOrder: (recap) => {
            this.props.navigator.push({
               title: "EndOrderView",
               params: {
                  line: this.props.line,
                  recap: recap,
                  from: this.props.params.from
               }
            });
         },
         openWebsite: () => {
            Linking.openURL(this.props.line.settings.website);
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

      const handleRefresh = () => {
         this.forceUpdate();
      }

      this.props.articles.forEach((article) => {
         if (!article.count && article.count !== 0) {
            let newCount = 0;
            if (this.props.params.recap && this.props.params.recap[article._id]) {
               newCount = this.props.params.recap[article._id].count;
            }
            article.count = newCount;
         }
         tab.push(<Article key={article._id} article={article} onRefresh={handleRefresh}/>);
      });

      return tab;
   }

   renderAbout(actions) {
      const tab = [];

      if (this.props.line.settings.description) {
         tab.push(
            <ListItem style={nativeStyles.listAbout} key={'description'}>
               <Text style={nativeStyles.titleAbout}>{this.getText('label_description')}</Text>
               <Text>{this.props.line.settings.description}</Text>
            </ListItem>
         );
      }

      if (this.props.line.settings.website) {
         tab.push(
            <ListItem style={nativeStyles.listAbout} key={'website'} onPress={actions.openWebsite}>
               <Text style={nativeStyles.titleAbout}>{this.getText('label_website')}</Text>
               <Text style={nativeStyles.linkText}>{this.props.line.settings.website}</Text>
            </ListItem>
         );
      }

      if (this.props.line.settings.phonenbr) {
         tab.push(
            <ListItem style={nativeStyles.listAbout} key={'tel'}>
               <Text style={nativeStyles.titleAbout}>{this.getText('label_tel')}</Text>
               <Text>{this.props.line.settings.phonenbr}</Text>
            </ListItem>
         );
      }

      if (tab.length > 0) {
         return (
            <Card style={nativeStyles.aboutContainer}>
               <CardItem>
                  <Text style={nativeStyles.cardTitle}>{this.getText('title_about')}</Text>
               </CardItem>
               {tab}
            </Card>
         );
      } else {
         return null;
      }
   }

   render() {
      if (!this.props.connected)
         this.manageLostConnection();

      const actions = this.getAction();

      let footerEnabled = false;
      let footerMessage = "";

      if (this.props.line.settings.enable) {
         this.props.articles.forEach((article) => {
            if (article.count) {
               footerEnabled = true;
            }
         });
         if (footerEnabled) {
            footerMessage = this.getText('footer_next');
         } else {
            footerMessage = this.getText('footer_choose');
         }
      } else {
         footerMessage = this.getText('footer_disabled');
      }

      const footerButtonStyle = !footerEnabled
         ? nativeStyles.footerButtonDisabled
         : null;

      const onPress = () => {
         const recap = {};
         this.props.articles.forEach((article) => {
            if (article.available && article.count) {
               recap[article._id] = article;
            }
         });
         actions.showEndOrder(recap);
      }

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
            <Content>
               {this.renderAbout(actions)}
               <Card>
                  <CardItem>
                     <Text style={nativeStyles.cardTitle}>{this.getText('title_articles')}</Text>
                  </CardItem>
                  {this.renderArticles(actions)}
               </Card>
            </Content>
            <Footer>
               <Body>
                  <Button onPress={onPress} disabled={!footerEnabled} info full style={footerButtonStyle}>
                     <Text style={nativeStyles.footerButtonText}>{footerMessage}</Text>
                  </Button>
               </Body>
            </Footer>
         </Container>
      );
   }
}

const nativeStyles = {
   footerButtonText: {
      color: 'white',
      fontWeight: '700'
   },
   footerButtonDisabled: {
      backgroundColor: '#b5b5b5'
   },
   cardTitle: {
      fontSize: 17,
      fontWeight: '700'
   },
   aboutContainer: {
      paddingBottom: 10
   },
   linkText: {
      color: 'blue',
      textDecorationLine: 'underline'
   },
   listAbout: {
      flexDirection: 'column',
      alignItems: 'flex-start'
   },
   titleAbout: {
      fontSize: 16,
      fontWeight: '600'
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
