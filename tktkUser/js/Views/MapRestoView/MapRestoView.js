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
import MapView from 'react-native-maps';
import DismissKeyboard from 'dismissKeyboard';
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';
import Resto from '../ListRestoView/Resto.js';

class MapRestoView extends Component {

   constructor(props) {
      super(props);

      this.state = {
         meter: 1000 + "",
         meterError: false,
         pos: null,
         lineToShow: null
      }
   }

   componentWillMount() {
      const actions = this.getAction();

      this.props.commonFuncs.onSetTextHeader(this.getText('text_header'));

      navigator.geolocation.getCurrentPosition((pos) => {
         this.setState({pos: pos});
         actions.searchWithLocation();
      }, (err) => {});

      this.watchID = navigator.geolocation.watchPosition((pos) => {
         console.log("-----");
         console.log("--------------- GPS frafraichissement");
         console.log("----------------");
         this.setState({pos: pos});
         actions.searchWithLocation();
      }, (err) => {});
   }

   componentWillUnmount() {
      navigator.geolocation.clearWatch(this.watchID);
      if (this.state.handleLinesSub) {
         this.state.handleLinesSub.stop();
      }
   }

   getAction() {
      return {
         showView: (title) => {
            this.props.navigator.push({title: title});
         },
         searchWithLocation: () => {
            if (this.state.pos) {
               const meters = this.getMeters();
               if (meters) {
                  const payload = {
                     lng: this.state.pos.coords.longitude,
                     lat: this.state.pos.coords.latitude,
                     meter: meters
                  }
                  const onReady = () => {
                     this.forceUpdate();
                  }
                  const handler = asyncApi.subscribe('linesToTakeATicket', payload, onReady);
                  if (this.state.handleLinesSub) {
                     this.state.handleLinesSub.stop();
                  }
                  this.setState({handleLinesSub: handler});
               }
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

   getMeters() {
      if (!this.state.meter) {
         this.setState({meterError: true});
         return false;
      }

      const res = parseInt(this.state.meter);
      if (!res) {
         this.setState({meterError: true});
         return false;
      }

      this.setState({meterError: ""});
      return res;
   }

   renderMarkers(actions, coords) {
      const tab = [];

      tab.push(<MapView.Marker key={1} coordinate={{
         longitude: coords.longitude,
         latitude: coords.latitude
      }} pinColor={'blue'}/>);

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

      if (this.state.pos) {
         const coords = this.state.pos.coords;

         const onSubmit = () => {
            DismissKeyboard();
            actions.searchWithLocation();
         }

         const inputStyle = this.state.meterError
            ? styles.formInputError
            : styles.formInput;

         const resto = this.state.lineToShow
            ? (<View style={styles.restoContainer}><Resto line={this.state.lineToShow} navigator={this.props.navigator}/></View>)
            : null;

         return (
            <View style={styles.container}>
               <View style={styles.formContainer}>
                  <Text style={styles.formLabel}>{this.getText('label_meters')}</Text>
                  <TextInput keyboardType={'number-pad'} onSubmitEditing={onSubmit} onChangeText={(meter) => this.setState({meter: meter})} value={this.state.meter} style={inputStyle}/>
                  <TouchableHighlight onPress={onSubmit} style={styles.formButton} underlayColor={'#286090'}>
                     <Text style={styles.formButtonText}>{this.getText('label_button_search')}</Text>
                  </TouchableHighlight>
               </View>
               <MapView style={{
                  flex: 1
               }} initialRegion={{
                  latitude: coords.latitude,
                  longitude: coords.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05
               }}>
                  {this.renderMarkers(actions, coords)}
               </MapView>
               {resto}
            </View>
         );
      } else {
         return (
            <Text>En attente du GPS</Text>
         );
      }
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
   formContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 40
   },
   formInput: {
      height: 35,
      borderColor: '#eee',
      borderWidth: 1,
      paddingLeft: 10,
      flex: 1,
      alignSelf: 'center'
   },
   formInputError: {
      height: 35,
      borderColor: 'rgb(217, 83, 79)',
      borderWidth: 1,
      borderRadius: 3,
      paddingLeft: 10,
      flex: 1,
      alignSelf: 'center'
   },
   formLabel: {
      fontWeight: '600',
      paddingLeft: 10,
      paddingRight: 10,
      fontSize: 17
   },
   formButton: {
      height: 35,
      marginLeft: 10,
      marginRight: 5,
      paddingLeft: 10,
      paddingRight: 10,
      backgroundColor: '#337ab7',
      borderWidth: 1,
      borderColor: 'rgb(32, 77, 116)',
      borderRadius: 6,
      justifyContent: 'center'
   },
   formButtonText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 17
   },
   restoContainer: {
     paddingTop: 15,
     paddingLeft: 15,
     paddingRight: 15,
     backgroundColor: 'rgb(238, 238, 238)'
   }
});

export default createContainer(props => {

   const data = {
      connected: asyncApi.checkConnection(),
      lines: asyncApi.find('lines')
   }

   return data;
}, MapRestoView);
