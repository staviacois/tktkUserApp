import React, {Component} from 'react';
import {
   StyleSheet,
   View,
   Text,
   ScrollView,
   TextInput,
   TouchableHighlight,
   Alert,
   Image,
   Dimensions
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
   Spinner,
   Footer,
   FooterTab
} from 'native-base';
import {createContainer} from 'react-native-meteor';
import MapView from 'react-native-maps';
import DismissKeyboard from 'dismissKeyboard';
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';
import Resto from '../ListRestoView/Resto.js';

class MapRestoView extends Component {
   // This view shows a map showing user's position, and position of nearby lines

   constructor(props) {
      super(props);

      this.state = {
         meter: 1000 + "",
         actualMeter: 1000,
         meterError: false,
         pos: null,
         posDenied: false,
         lineToShow: props.params.selected || null
      };
   }

   componentWillMount() {
      const actions = this.getAction();

      // Get current position, and search for nearby lines
      navigator.geolocation.getCurrentPosition((pos) => {
         this.setState({pos: pos, posDenied: false});
         actions.searchWithLocation();
      }, (err) => {
         console.log(err);
         if (err.code === err.PERMISSION_DENIED || err.code === err.POSITION_UNAVAILABLE) {
            this.setState({posDenied: true});
            console.log("Access denied");
         }
      });

      // Automatically search for nearby lines when position updates
      this.watchID = navigator.geolocation.watchPosition((pos) => {
         console.log("-----");
         console.log("--------------- GPS frafraichissement");
         console.log("----------------");
         this.setState({pos: pos, posDenied: false});
         actions.searchWithLocation();
      }, (err) => {});
   }

   componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchID);
      if (this.state.handleLinesSub) {
         this.state.handleLinesSub.stop();
      }
   }

   // Search for nearby lines when state's meter property changes
   componentDidUpdate(oldProps, oldState) {
      if (oldState.actualMeter !== this.state.actualMeter) {
         this.getAction().searchWithLocation();
      }
   }

   getAction() {
      return {
         showView: (title, anim = 0) => {
            this.props.navigator.push({title: title, anim: anim});
         },
         searchWithLocation: () => {
            if (this.state.pos) {
               const meters = this.state.actualMeter;
               const payload = {
                  lng: this.state.pos.coords.longitude,
                  lat: this.state.pos.coords.latitude,
                  meter: meters
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
         : "MapRestoView.") + code);
   }

   manageLostConnection() {
      let checkAgainLater = () => {
         if (!this.props.connected) {
            asyncApi.defaultErrorAction(this.props.navigator);
         }
      }
      setTimeout(checkAgainLater, 3000);
   }

   applyMeter(actions) {
      if (!this.state.meter) {
         this.setState({meterError: true});
         return false;
      }

      const res = parseInt(this.state.meter);
      if (!res) {
         this.setState({meterError: true});
         return false;
      }

      this.setState({meterError: "", actualMeter: res, lineToShow: null});
   }

   renderMarkers(actions, coords) {
      const tab = [];

      tab.push(<MapView.Marker key={1} coordinate={{
         longitude: coords.longitude,
         latitude: coords.latitude
      }} image={require('../../../images/location.png')} anchor={{
         x: 0.5,
         y: 0.5
      }}/>);

      this.props.lines.forEach((line) => {
         if (line.position.loc) {
            const onPress = () => {
               this.setState({lineToShow: line});
            }

            tab.push(<MapView.Marker key={line._id} coordinate={{
               longitude: line.position.loc.coordinates[0],
               latitude: line.position.loc.coordinates[1]
            }} pinColor={line.settings.enable
               ? 'green'
               : 'red'} onPress={onPress}/>);
         }
      });

      return tab;
   }

   render() {
      if (!this.props.connected)
         this.manageLostConnection();

      const actions = this.getAction();

      let content = null;

      if (this.state.pos) {
         const coords = this.state.pos.coords;

         const onSubmit = () => {
            DismissKeyboard();
            this.applyMeter(actions);
         }
         const pos = this.state.pos
            ? this.state.pos.coords
            : null;
         const resto = this.state.lineToShow
            ? (
               <View style={nativeStyles.restoContainer}><Resto line={this.state.lineToShow} navigator={this.props.navigator} from={{
                  view: "MapRestoView",
                  params: {
                     selected: this.state.lineToShow
                  }
               }} pos={pos}/></View>
            )
            : null;

         const boolError = function(error) {
            return error
               ? true
               : false;
         }

         const {width, height} = Dimensions.get('window');
         const delta = 0.05;

         const onPress = () => {
            if (this.state.lineToShow) {
               this.setState({lineToShow: null});
            }
         }

         content = (
            <View style={nativeStyles.container}>
               <View style={nativeStyles.formCard}>
                  <Card>
                     <CardItem>
                        <Text>{this.getText('label_meters') + " :"}</Text>
                        <Form style={nativeStyles.form}>
                           <Item error={boolError(this.state.meterError)}>
                              <Input keyboardType={'number-pad'} placeholder={this.getText('label_meters')} onSubmitEditing={onSubmit} onChangeText={(meter) => this.setState({meter, meterError: ""})} value={this.state.meter}/>
                           </Item>
                        </Form>
                        <Button info onPress={onSubmit}>
                           <Text style={nativeStyles.buttonText}>{this.getText('label_button_search')}</Text>
                        </Button>
                     </CardItem>
                  </Card>
               </View>
               <MapView style={nativeStyles.map} onPress={onPress} initialRegion={{
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                  latitudeDelta: delta,
                  longitudeDelta: delta * width / height
               }}>
                  {this.renderMarkers(actions, coords)}
               </MapView>
               {resto}
            </View>
         );
      } else if (this.state.posDenied) {
         content = (
            <View style={nativeStyles.container}>
               <Card>
                  <CardItem>
                     <Text style={nativeStyles.activateGpsText}>{this.getText('text_gps_disabled')}</Text>
                  </CardItem>
               </Card>
            </View>
         );
      } else {
         content = (
            <View style={nativeStyles.container}>
               <Spinner style={nativeStyles.spinner} color="#909090"/>
            </View>
         );
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
            {content}
            <Footer>
               <FooterTab>
                  <Button onPress={() => actions.showView('AccountView', 1)}>
                     <Icon name="person"/>
                  </Button>
                  <Button onPress={() => actions.showView('ListRestoView', 1)}>
                     <Icon name="list"/>
                  </Button>
                  <Button active>
                     <Icon active name="compass"/>
                  </Button>
               </FooterTab>
            </Footer>
         </Container>
      );
   }
}

var nativeStyles = {
   container: {
      flex: 1,
      backgroundColor: 'white'
   },
   spinner: {
      marginTop: 40
   },
   form: {
      flex: 1,
      paddingRight: 10
   },
   map: {
      flex: 1
   },
   restoMarker: {
      zIndex: 5
   },
   restoContainer: {
      position: 'absolute',
      left: 0,
      bottom: 0,
      right: 0
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
}, MapRestoView);
