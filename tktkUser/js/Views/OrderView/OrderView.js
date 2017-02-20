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
   Footer,
   FooterTab,
   CheckBox
} from 'native-base';
import {createContainer} from 'react-native-meteor';
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';

class OrderView extends Component {

   constructor(props) {
      super(props);
   }

   componentDidMount() {
      const handler = setInterval(() => {
         if (this.props.ticket && this.props.ticket.logs.accepted) {
            const newTime = this.getTimePrep();
            if (this.state.time !== newTime) {
               this.setState({time: this.getTimePrep()});
            }
         }
      }, 1000);
      this.setState({handleTimerInterval: handler});
   }

   componentWillUpdate(nextProps, nextState) {
      if (nextProps.ticket && nextProps.ticket.logs.accepted) {
         nextState.time = this.getTimePrep(nextProps.ticket);
      }
   }

   componentWillUnmount() {
      clearInterval(this.state.handleTimerInterval);
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
         : "OrderView.") + code);
   }

   manageLostConnection() {
      let checkAgainLater = () => {
         if (!this.props.connected) {
            asyncApi.defaultErrorAction(this.props.navigator);
         }
      }
      setTimeout(checkAgainLater, 3000);
   }

   renderRecap() {
      if (this.props.ticket || this.props.archive) {
         const tab = [];

         let total = 0;

         this.props.ticket.order.forEach((article) => {
            total += article.count * article.price;
            tab.push(
               <ListItem key={article.name}>
                  <Body>
                     <Text>{article.quantity + "x " + article.name}</Text>
                  </Body>
                  <Right>
                     <Text>{article.price + " CHF"}</Text>
                  </Right>
               </ListItem>
            );
         });

         return (
            <Card>
               <CardItem>
                  <Text style={nativeStyles.cardHeaderText}>{this.getText('label_order') + this.props.ticket.number}</Text>
               </CardItem>
               {tab}
               <CardItem>
                  <Right>
                     <Text>{this.getText('label_total') + this.props.ticket.payement.orderprice + " CHF"}</Text>
                  </Right>
               </CardItem>
            </Card>
         );
      } else {
         return null;
      }
   }

   getTimePrep(ticket = this.props.ticket) {
      const diff = Math.round((new Date() - ticket.logs.accepted) / 1000 / 60);
      let minutes = ticket.timePrep - diff;
      if (minutes < 1) {
         minutes = 1;
      }
      return minutes;
   }

   renderMessage() {
      if (this.props.ticket) {
         let r = null;
         switch (this.props.ticket.status) {
            case 10:
               r = (
                  <Card>
                     <CardItem>
                        <Text style={nativeStyles.cardHeaderText}>{"En attente"}</Text>
                     </CardItem>
                     <CardItem>
                        <Text>{"Votre commande est en attente de validation, une fois acceptée le temps de préparation vous sera indiqué. Vous êtes le prochain."}</Text>
                     </CardItem>
                  </Card>
               );
               break;
            case 15:
               r = (
                  <Card>
                     <CardItem>
                        <Text style={nativeStyles.cardHeaderText}>{"En préparation"}</Text>
                     </CardItem>
                     <CardItem>
                        <Text>{"Votre commande est en préparation. Elle sera prête dans environ " + this.state.time + " minutes."}</Text>
                     </CardItem>
                  </Card>
               );
               break;
            case 20:
               r = (
                  <Card>
                     <CardItem>
                        <Text style={nativeStyles.cardHeaderText}>{"C'est prêt !"}</Text>
                     </CardItem>
                     <CardItem>
                        <Text>{"Votre commande est prête, elle vous attend."}</Text>
                     </CardItem>
                  </Card>
               );
               break;
            case 27:
               r = (
                  <Card>
                     <CardItem>
                        <Text style={nativeStyles.cardHeaderText}>{"Commande non-collectée"}</Text>
                     </CardItem>
                     <CardItem>
                        <Text>{"Veuillez contacter le restaurateur pour débloquer votre commande"}</Text>
                     </CardItem>
                     <CardItem>
                        <Text style={nativeStyles.important}>{this.props.ticket.phonenumber}</Text>
                     </CardItem>
                  </Card>
               );
               break;
         }
         return r;
      } else if (this.props.archive) {
         return (
            <Card>
               <CardItem>
                  <Text style={nativeStyles.cardHeaderText}>{"Terminé"}</Text>
               </CardItem>
               <CardItem>
                  <Text>{"Merci d'avoir utilisé tktk !"}</Text>
               </CardItem>
            </Card>
         );
      } else {
         return (
            <Text>Indisponible</Text>
         );
      }
   }

   render() {
      if (!this.props.connected)
         this.manageLostConnection();

      const actions = this.getAction();

      console.log("-------- Les props : ----------");
      console.log("--- (params) ticket :");
      console.log(this.props.params.ticket);
      console.log("--- line :");
      console.log(this.props.line);
      console.log("--- ticket :");
      console.log(this.props.ticket);
      console.log("--- archive :");
      console.log(this.props.archive);
      console.log("-------------------------------");

      const footerEnabled = true;

      const footerButtonStyle = {};

      const footerMessage = "footer";

      return (
         <Container>
            <Header>
               <Left/>
               <Body>
                  <Title>{this.getText('text_header') + this.props.line.linename}</Title>
               </Body>
               <Right/>
            </Header>
            <Content>
               {this.renderMessage()}
               {this.renderRecap()}
            </Content>
            <Footer>
               <Body>
                  <Button onPress={() => console.log("teset")} disabled={!footerEnabled} info full style={footerButtonStyle}>
                     <Text style={nativeStyles.footerButtonText}>{footerMessage}</Text>
                  </Button>
               </Body>
            </Footer>
         </Container>
      );
   }
}

const nativeStyles = {
   cardHeaderText: {
      fontWeight: '700',
      fontSize: 17
   },
   footerButtonText: {
      color: 'white',
      fontWeight: '700'
   },
   footerButtonDisabled: {
      backgroundColor: '#b5b5b5'
   },
   important: {
      fontWeight: '600'
   }
};

export default createContainer(props => {
   const handleSubs = asyncApi.multiSubscribe([
      {
         name: 'lineChoose',
         payload: props.params.ticket.urlname
      }, {
         name: 'tickets',
         payload: {
            urlname: props.params.ticket.urlname,
            tokenticket: props.params.ticket.token
         },
         multiArgs: true
      }, {
         name: 'archiveForClient',
         payload: {
            urlname: props.params.ticket.urlname,
            tokenticket: props.params.ticket.token
         },
         multiArgs: true
      }
   ]);

   const data = {
      connected: asyncApi.checkConnection(),
      ready: handleSubs.ready(),
      line: asyncApi.findOne('lines', {urlname: props.params.ticket.urlname}),
      ticket: asyncApi.findOne('tickets'),
      archive: asyncApi.findOne('tickets_arch')
   }

   return data;
}, OrderView);
