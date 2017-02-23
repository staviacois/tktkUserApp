// ----------------------------------------
// ----- Imports

// npm
import React, {Component} from 'react';
import {View, Text, Dimensions} from 'react-native';
import {
  Container,
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
  Spinner,
  Footer,
  FooterTab
} from 'native-base';
import {createContainer} from 'react-native-meteor';
import MapView from 'react-native-maps';
import DismissKeyboard from 'dismissKeyboard';

// libs
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';

// components
import Header from '../../Components/Header.js';
import Resto from '../ListRestoView/Resto.js';

class MapRestoView extends Component {
  // This view shows a map showing user's position, and position of nearby lines


  // ----------------------------------------
  // ----- Component actions

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

  // Search for nearby lines when state's meter property changes
  componentDidUpdate(oldProps, oldState) {
    if (oldState.actualMeter !== this.state.actualMeter) {
      this.getAction().searchWithLocation();
    }
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
    if (this.state.handleLinesSub) {
      this.state.handleLinesSub.stop();
    }
  }


  // ----------------------------------------
  // ----- Our actions

  getAction() {
    return {
      showView: (title, anim = 0) => {
        this.props.navigator.push({title: title, anim: anim});
      },
      searchWithLocation: () => {
        const {
          pos,
          actualMeter,
          handleLinesSub
        } = this.state;

        if (pos) {
          const meters = actualMeter;
          const payload = {
            lng: pos.coords.longitude,
            lat: pos.coords.latitude,
            meter: meters
          }
          const onReady = (oldHandler) => {
            if (oldHandler) {
              oldHandler.stop();
            }
            this.forceUpdate();
          }

          const handler = asyncApi.subscribe('linesToTakeATicket', payload, () => onReady(handleLinesSub));

          this.setState({handleLinesSub: handler});
        }
      }
    };
  }

  getText(code, noPrefix) {
    return text.getText((noPrefix? "" : "MapRestoView.") + code);
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
    const {
      meter
    } = this.state;

    if (!meter) {
      this.setState({meterError: true});
      return false;
    }

    const res = parseInt(meter);
    if (!res) {
      this.setState({meterError: true});
      return false;
    }

    this.setState({meterError: "", actualMeter: res, lineToShow: null});
  }


  // ----------------------------------------
  // ----- Render

  render() {
    if (!this.props.connected)
    this.manageLostConnection();

    const actions = this.getAction();

    const {
      pos,
      lineToShow,
      meterError,
      meter,
      posDenied
    } = this.state;

    let content = null;

    if (pos) {
      const coords = pos.coords;

      const onSubmit = () => {
        DismissKeyboard();
        this.applyMeter(actions);
      }

      const resto = lineToShow ? (
        <View style={nativeStyles.restoContainer}>
          <Resto line={lineToShow} navigator={this.props.navigator} from={{view: "MapRestoView", params: {selected: lineToShow}}} pos={coords}/>
        </View>
      ) : null;

      const boolError = function(error) {
        return error
        ? true
        : false;
      }

      const {width, height} = Dimensions.get('window');
      const delta = 0.05;

      const onPress = () => {
        if (lineToShow) {
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
                  <Item error={boolError(meterError)}>
                    <Input
                      keyboardType={'number-pad'}
                      placeholder={this.getText('label_meters')}
                      onSubmitEditing={onSubmit}
                      onChangeText={(meter) => this.setState({meter, meterError: ""})}
                      value={meter}/>
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
    } else if (posDenied) {
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

        tab.push(
          <MapView.Marker
            key={line._id}
            coordinate={{longitude: line.position.loc.coordinates[0], latitude: line.position.loc.coordinates[1]}}
            pinColor={line.settings.enable ? 'green' : 'red'}
            onPress={onPress}/>
        );
      }
    });

    return tab;
  }
}


// ----------------------------------------
// ----- Styles

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
