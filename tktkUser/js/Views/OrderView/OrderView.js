import React, {Component} from 'react';
import {
   StyleSheet,
   View,
   Text,
   ScrollView,
   TextInput,
   TouchableHighlight,
   Alert,
   Dimensions,
   Linking,
   Platform
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
import * as storage from '../../libs/storage.js';

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
         ticket = this.props.ticket || this.props.archive;

         const tab = [];

         let total = 0;

         ticket.order.forEach((article) => {
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
                  <Text style={nativeStyles.cardHeaderText}>{this.getText('label_order') + ticket.number}</Text>
               </CardItem>
               {tab}
               <CardItem>
                  <Right>
                     <Text>{this.getText('label_total') + ticket.payement.orderprice + " CHF"}</Text>
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
      const defaultReturn = (
         <Card>
            <CardItem>
               <Text style={nativeStyles.cardHeaderText}>{this.getText('not_found')}</Text>
            </CardItem>
            <CardItem>
               <Text>{this.getText('not_found_text')}</Text>
            </CardItem>
         </Card>
      );
      if (this.props.ticket) {
         const infoPay = (
            <Card key={0}>
               <CardItem>
                  <Text>{this.getText('payment_at_reception')}</Text>
               </CardItem>
            </Card>
         );

         const onOpenMap = () => {
            Linking.openURL(this.props.line.position.url);
         };
         const buttonMap = (
            <CardItem style={nativeStyles.buttonMap} onPress={onOpenMap}>
               <Text style={nativeStyles.buttonMapText}>{this.getText('open_map')}</Text>
               <Icon name="arrow-forward"/>
            </CardItem>
         );

         let r = null;
         switch (this.props.ticket.status) {
            case 10:
               let position = 0;
               this.props.tickets.forEach((ticket) => {
                  if (ticket.number < this.props.ticket.number && ticket.status <= 12 && ticket.payement.choice !== -1) {
                     position++;
                  }
               });

               let textPosition = position === 0
                  ? this.getText('next')
                  : (position + 1) + this.getText('number_position_suffix');

               r = [(
                     <Card key={1}>
                        <CardItem>
                           <Icon name='timer'/>
                           <Text style={nativeStyles.cardHeaderText}>{this.getText('waiting')}</Text>
                        </CardItem>
                        <CardItem>
                           <Text>{this.getText('waiting_text1') + " " + this.getText('waiting_text2') + " " + textPosition + " " + this.getText('waiting_text3')}</Text>
                        </CardItem>
                        {buttonMap}
                     </Card>
                  ), infoPay];
               break;
            case 15:
               r = [(
                     <Card key={1}>
                        <CardItem>
                           <Icon name='time'/>
                           <Text style={nativeStyles.cardHeaderText}>{this.getText('preparation')}</Text>
                        </CardItem>
                        <CardItem>
                           <Text>{this.getText('preparation_text1') + " " + this.state.time + " " + this.getText('preparation_text2_' + (this.state.time > 1
                                 ? 'p'
                                 : 's'))}</Text>
                        </CardItem>
                        {buttonMap}
                     </Card>
                  ), infoPay];
               break;
            case 20:
               r = [(
                     <Card key={1}>
                        <CardItem>
                           <Icon name='alarm'/>
                           <Text style={nativeStyles.cardHeaderText}>{this.getText('ready')}</Text>
                        </CardItem>
                        <CardItem>
                           <Text>{this.getText('ready_text')}</Text>
                        </CardItem>
                        {buttonMap}
                     </Card>
                  ), infoPay];
               break;
            case 25:
               r = [(
                     <Card key={1}>
                        <CardItem>
                           <Icon name='alarm'/>
                           <Text style={nativeStyles.cardHeaderText}>{this.getText('delivery')}</Text>
                        </CardItem>
                        <CardItem>
                           <Text>{this.getText('delivery_text')}</Text>
                        </CardItem>
                     </Card>
                  ), infoPay];
               break;
            case 27:
               r = [(
                     <Card key={1}>
                        <CardItem>
                           <Text style={nativeStyles.cardHeaderText}>{this.getText('blocked')}</Text>
                        </CardItem>
                        <CardItem>
                           <Text>{this.getText('blocked_text')}</Text>
                        </CardItem>
                        <CardItem>
                           <Text style={nativeStyles.important}>{this.props.ticket.phonenumber}</Text>
                        </CardItem>
                     </Card>
                  ), infoPay];
               break;
            default:
               r = defaultReturn;
               break;
         }
         return r;
      } else if (this.props.archive) {
         let r = null;

         switch (this.props.archive.status) {
            case 30:
               r = (
                  <Card>
                     <CardItem>
                        <Text style={nativeStyles.cardHeaderText}>{this.getText('end')}</Text>
                     </CardItem>
                     <CardItem>
                        <Text>{this.getText('end_text')}</Text>
                     </CardItem>
                  </Card>
               );
               break;
            case 70:
               r = (
                  <Card>
                     <CardItem>
                        <Text style={nativeStyles.cardHeaderText}>{this.getText('canceled')}</Text>
                     </CardItem>
                     <CardItem>
                        <Text>{this.getText('canceled_text')}</Text>
                     </CardItem>
                  </Card>
               );
               break;
            case 80:
               r = (
                  <Card>
                     <CardItem>
                        <Text style={nativeStyles.cardHeaderText}>{this.getText('end')}</Text>
                     </CardItem>
                     <CardItem>
                        <Text>{this.getText('end_text')}</Text>
                     </CardItem>
                  </Card>
               );
               break;
            default:
               r = defaultReturn;
               break;
         }

         return r;
      } else {
         return defaultReturn;
      }
   }

   renderFooter() {
      let r = null;
      if (this.props.ticket && this.props.ticket.status === 10) {
         const onPress = () => {
            const payload = {
               ticketid: this.props.ticket._id,
               tokenticket: this.props.params.ticket.token
            }

            const cbSuccess = (err, res) => {
               if (err) {
                  Alert.alert('', this.getText("generic_error_message") + " (" + err.error + ")");
               } else {
                  if (!res.problem) {
                     storage.remove('@Ticket', (err) => {
                        if (!err) {
                           this.props.navigator.push({title: 'ListRestoView', anim: 1});
                        }
                     });
                  } else {
                     Alert.alert('', res.message);
                  }
               }
            };

            asyncApi.callAsyncServer('cancelTicket', payload, cbSuccess, () => {}, true);
         };
         r = (
            <Footer>
               <Body>
                  <Button onPress={onPress} info full>
                     <Text style={nativeStyles.footerButtonText}>{this.getText('label_cancel')}</Text>
                  </Button>
               </Body>
            </Footer>
         );
      } else if (this.props.archive) {
         const onPress = () => {
            storage.remove('@Ticket', (err) => {
               if (!err) {
                  this.props.navigator.push({title: 'ListRestoView', anim: 1});
               }
            });
         };

         r = (
            <Footer>
               <Body>
                  <Button onPress={onPress} info full>
                     <Text style={nativeStyles.footerButtonText}>{this.getText('label_end')}</Text>
                  </Button>
               </Body>
            </Footer>
         );
      }

      return r;
   }

   render() {
      if (!this.props.connected)
         this.manageLostConnection();

      const actions = this.getAction();

      /*
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
      */

      if (this.props.ready) {

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
               {this.renderFooter()}
            </Container>
         );
      } else {
         return (
            <Container>
               <Header>
                  <Left/>
                  <Body>
                     <Title>{this.getText('text_header')}</Title>
                  </Body>
                  <Right/>
               </Header>
               <Content></Content>
            </Container>
         );
      }
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
   important: {
      fontWeight: '600'
   },
   buttonMap: {
      justifyContent: 'flex-end'
   },
   buttonMapText: {
      fontWeight: '600',
      marginRight: 20
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
      ticket: asyncApi.findOne('tickets', {
         urlname: props.params.ticket.urlname,
         number: props.params.ticket.number
      }),
      archive: asyncApi.findOne('tickets_arch', {
         urlname: props.params.ticket.urlname,
         number: props.params.ticket.number
      }),
      tickets: asyncApi.find('tickets')
   }

   return data;
}, OrderView);
