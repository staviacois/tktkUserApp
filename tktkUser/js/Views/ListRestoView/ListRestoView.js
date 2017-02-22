import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {
   Container,
   Content,
   Title,
   Icon,
   Left,
   Body,
   Right,
   Button,
   Input,
   Item,
   Form,
   Card,
   CardItem,
   Footer,
   FooterTab
} from 'native-base';
import {createContainer} from 'react-native-meteor';
import Resto from './Resto.js';
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';
import Header from '../../Components/Header.js';

class ListRestoView extends Component {
   // This view shows a list of lines
   // It gives access to a search by NPA, and a search by location (nearby lines)

   constructor(props) {
      super(props);

      const npa = props.params.npa || (props.login
         ? props.login.npa
         : "");

      this.state = {
         npa: npa,
         npaError: "",
         pos: null,
         posDenied: false
      }
   }

   componentWillMount() {
      const actions = this.getAction();

      if (this.props.params.npa) {
         actions.search();
      }

      // Get current location and search for nearby lines
      navigator.geolocation.getCurrentPosition((pos) => {
         this.setState({pos: pos, posDenied: false});
         if (!this.state.handleLinesNPASub) {
            actions.searchWithLocation();
         }
      }, (err) => {
         console.log(err);
         if (err.code === err.PERMISSION_DENIED || err.code === err.POSITION_UNAVAILABLE) {
            this.setState({posDenied: true});
            console.log("Access denied");
         }
      });

      // Updates nearby lines when location updates
      this.watchID = navigator.geolocation.watchPosition((pos) => {
         this.setState({pos: pos, posDenied: false});
         if (this.state.handleLinesSub && !this.state.handleLinesNPASub) {
            actions.searchWithLocation();
         }
      }, (err) => {});
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
         showView: (title, anim = 0) => {
            this.props.navigator.push({title: title, anim: anim});
         },
         search: () => {
            // Search lines by NPA
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
            // Search lines by location
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
      // Render :
      //  - Form to search by NPA
      //  - Lines found by location

      const npaError = this.renderError(this.state.npaError);

      let lines = null;

      if (!this.state.posDenied) {
         if (this.state.handleLinesSub) {
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
               const cont = this.state.handleLinesSub.ready()
                  ? <Text style={nativeStyles.gpsFoundText}>{this.getText('text_gps_not_found')}</Text>
                  : null;
               lines = (
                  <Card>
                     <CardItem>
                        {cont}
                     </CardItem>
                  </Card>
               );
            }
         }
      } else {
         lines = (
            <Card>
               <CardItem>
                  <Text style={nativeStyles.activateGpsText}>{this.getText('text_gps_disabled')}</Text>
               </CardItem>
            </Card>
         );
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
      // Render lines found by NPA

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
      // Render a message if no lines were found with given NPA

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
               <Left/>
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
            <Footer>
               <FooterTab>
                  <Button onPress={() => actions.showView('AccountView', 1)}>
                     <Icon name="person"/>
                  </Button>
                  <Button active>
                     <Icon active name="list"/>
                  </Button>
                  <Button onPress={() => actions.showView('MapRestoView')}>
                     <Icon name="compass"/>
                  </Button>
               </FooterTab>
            </Footer>
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
   },
   activateGpsText: {
      fontWeight: '600'
   }
};

export default createContainer(props => {

   const data = {
      connected: asyncApi.checkConnection(),
      lines: asyncApi.find('lines')
   }

   return data;

}, ListRestoView);
