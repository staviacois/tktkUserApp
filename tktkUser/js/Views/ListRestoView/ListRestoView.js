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
import Resto from './Resto.js';
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';

class ListRestoView extends Component {

   constructor(props) {
      super(props);

      const npa = props.params.npa || (props.login
         ? props.login.npa
         : "");

      this.state = {
         npa: npa,
         npaError: "",
         pos: null
      }
   }

   componentWillMount() {
      const actions = this.getAction();

      if (this.props.params.npa) {
         actions.search();
      }

      navigator.geolocation.getCurrentPosition((pos) => {
         this.setState({pos: pos});
         if (!this.state.handleLinesNPASub) {
            actions.searchWithLocation();
         }
      }, (err) => {}, {
         enableHighAccuracy: true,
         timeout: 20000,
         maximumAge: 1000
      });

      this.watchID = navigator.geolocation.watchPosition((pos) => {
         this.setState({pos: pos});
         if (this.state.handleLinesSub && !this.state.handleLinesNPASub) {
            actions.searchWithLocation();
         }
      }, (err) => {}, {
         enableHighAccuracy: true,
         timeout: 20000,
         maximumAge: 1000
      });
   }

   componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchID);
      if (this.state.handleLinesNPASub) {
         this.state.handleLinesNPASub.stop();
      }
      if (this.state.handleLinesSub) {
         this.state.handleLinesSub.stop();
      }
   }

   getAction() {
      return {
         showView: (title) => {
            this.props.navigator.push({title: title});
         },
         search: () => {
            if (this.validateForm()) {

               const payload = {
                  npa: this.state.npa
               }

               const onReady = () => {
                  this.forceUpdate();
               }

               const handler = asyncApi.subscribe('linesToTakeATicketWithNpa', payload, onReady);
               if (this.state.handleLinesNPASub) {
                  this.state.handleLinesNPASub.stop();
               }
               if (this.state.handleLinesSub) {
                  this.state.handleLinesSub.stop();
               }
               this.setState({handleLinesNPASub: handler, npaError: ""});
            }
         },
         removeSub: () => {
            if (this.state.handleLinesNPASub) {
               this.state.handleLinesNPASub.stop();
               this.setState({handleLinesNPASub: null});
            }
         },
         searchWithLocation: () => {
            if (this.state.pos) {
               const payload = {
                  lng: this.state.pos.coords.longitude,
                  lat: this.state.pos.coords.latitude,
                  meter: 1000
               }
               const onReady = (oldHandler) => {
                  if (oldHandler) {
                     oldHandler.stop();
                  }
                  this.forceUpdate();
               }

               const oldHandler = this.state.handleLinesSub;

               const handler = asyncApi.subscribe('linesToTakeATicket', payload, () => onReady(oldHandler));

               this.setState({handleLinesSub: handler});
            }
         }
      };
   }

   getText(code, noPrefix) {
      return text.getText((noPrefix
         ? ""
         : "ListRestoView.") + code);
   }

   manageLostConnection() {
      let checkAgainLater = () => {
         if (!this.props.connected) {
            asyncApi.defaultErrorAction(this.props.navigator);
         }
      }
      setTimeout(checkAgainLater, 3000);
   }

   validateForm() {
      if (!this.state.npa) {
         this.setState({npaError: this.getText('error_empty')});
         return false;
      }

      const re = /^\d{4}$/;
      if (!re.test(this.state.npa)) {
         this.setState({npaError: this.getText('error_invalid_npa')});
         return false;
      }
      return true;
   }

   renderError(error) {
      if (error) {
         return (
            <Text style={nativeStyles.errorLabel}>{error}</Text>
         );
      }
      return null;
   }

   renderSearch(actions) {
      const npaError = this.renderError(this.state.npaError);

      let lines = null;

      if (this.state.handleLinesSub && this.state.handleLinesSub.ready()) {
         if (this.props.lines.length) {
            let tab = [];
            const fromProp = {
               view: "ListRestoView"
            };
            const pos = this.state.pos
               ? this.state.pos.coords
               : null;
            this.props.lines.forEach((line) => {
               tab.push(<Resto key={line._id} line={line} navigator={this.props.navigator} from={fromProp} pos={pos}/>);
            });

            lines = (
               <Card>
                  <CardItem>
                     <Text style={nativeStyles.gpsFoundText}>{this.props.lines.length + " " + this.getText('text_gps_found')}</Text>
                  </CardItem>
                  {tab}
               </Card>
            );
         } else {
            lines = (
               <Card>
                  <CardItem>
                     <Text style={nativeStyles.gpsFoundText}>{this.getText('text_gps_not_found')}</Text>
                  </CardItem>
               </Card>
            );
         }
      }

      const boolError = function(error) {
         return error
            ? true
            : false;
      }

      return (
         <View>
            <Card>
               <CardItem>
                  <Text>{this.getText('text_npa')}</Text>
               </CardItem>
               <CardItem style={nativeStyles.formContainer}>
                  <Form style={nativeStyles.form}>
                     <Item error={boolError(npaError)}>
                        <Input placeholder={this.getText('label_npa')} onSubmitEditing={actions.search} autoCorrect={false} onChangeText={(npa) => this.setState({npa, npaError: ""})} value={this.state.npa}/>{npaError}
                     </Item>
                  </Form>
                  <Button info onPress={actions.search}>
                     <Text style={nativeStyles.buttonText}>{this.getText('label_search_button')}</Text>
                  </Button>
               </CardItem>
            </Card>
            {lines}
         </View>
      );
   }

   renderSearchedLines(actions) {
      const tab = [];
      const fromProp = {
         view: "ListRestoView",
         params: {
            npa: this.state.npa
         }
      };
      const pos = this.state.pos
         ? this.state.pos.coords
         : null;
      this.props.lines.forEach((line) => {
         tab.push(<Resto key={line._id} line={line} navigator={this.props.navigator} from={fromProp} pos={pos}/>);
      });

      const onBack = () => {
         actions.removeSub();
         actions.searchWithLocation();
      }

      return (
         <View>
            {tab}
            <Button style={nativeStyles.buttonBack} block info onPress={onBack}>
               <Text style={nativeStyles.buttonText}>{this.getText('label_cancel_button')}</Text>
            </Button>
         </View>
      );
   }

   renderNotFound(actions) {
      const onBack = () => {
         actions.removeSub();
         actions.searchWithLocation();
      }

      return (
         <View>
            <Card>
               <CardItem>
                  <Text>{this.getText('not_found')}</Text>
               </CardItem>
            </Card>
            <Button style={nativeStyles.buttonBack} block info onPress={onBack}>
               <Text style={nativeStyles.buttonText}>{this.getText('label_cancel_button')}</Text>
            </Button>
         </View>
      );
   }

   render() {
      if (!this.props.connected)
         this.manageLostConnection();

      const actions = this.getAction();

      let content;

      if (!this.state.handleLinesNPASub || !this.state.handleLinesNPASub.ready()) {
         content = this.renderSearch(actions);
      } else if (this.props.lines.length) {
         content = this.renderSearchedLines(actions);
      } else {
         content = this.renderNotFound(actions);
      }

      return (
         <Container>
            <Header>
               <Left>
                  <Button onPress={this.props.commonFuncs.onOpenMenu} transparent>
                     <Icon name='menu'/>
                  </Button>
               </Left>
               <Body>
                  <Title>{this.getText('text_header')}</Title>
               </Body>
               <Right>
                  <Button onPress={this.props.onSignOut} transparent>
                     <Icon name='log-out'/>
                  </Button>
               </Right>
            </Header>
            <Content>{content}</Content>
         </Container>
      );
   }
}

var nativeStyles = {
   errorLabel: {
      paddingRight: 10,
      color: '#a94442',
      fontWeight: '600'
   },
   formContainer: {
      flexDirection: 'row'
   },
   form: {
      flex: 1,
      paddingRight: 10
   },
   gpsFoundText: {
      fontWeight: '700'
   },
   buttonBack: {
      margin: 20
   },
   buttonText: {
      color: 'white',
      fontWeight: '700'
   }
};

export default createContainer(props => {

   const data = {
      connected: asyncApi.checkConnection(),
      lines: asyncApi.find('lines')
   }

   return data;

}, ListRestoView);
