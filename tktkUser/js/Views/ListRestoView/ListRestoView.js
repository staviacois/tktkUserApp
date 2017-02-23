// ----------------------------------------
// ----- Imports

// npm
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

// libs
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';

// components
import Header from '../../Components/Header.js';
import Resto from './Resto.js';

class ListRestoView extends Component {
  // This view shows a list of lines
  // It gives access to a search by NPA, and a search by location (nearby lines)


  // ----------------------------------------
  // ----- Component actions

  constructor(props) {
    super(props);

    const npa = props.params.npa || (props.login ? props.login.npa : "");

    this.state = {
      npa: npa,
      npaError: "",
      pos: null,
      posDenied: false
    }
  }

  componentWillMount() {
    const actions = this.getAction();

    const {
      handleLinesNPASub,
      handleLinesSub
    } = this.state;

    if (this.props.params.npa) {
      actions.search();
    }

    // Get current location and search for nearby lines
    navigator.geolocation.getCurrentPosition((pos) => {
      this.setState({pos: pos, posDenied: false});
      if (!handleLinesNPASub) {
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
      if (handleLinesSub && !handleLinesNPASub) {
        actions.searchWithLocation();
      }
    }, (err) => {});
  }

  componentWillUnmount() {
    const {
      handleLinesNPASub,
      handleLinesSub
    } = this.state;

    navigator.geolocation.clearWatch(this.watchID);
    if (handleLinesNPASub) {
      handleLinesNPASub.stop();
    }
    if (handleLinesSub) {
      handleLinesSub.stop();
    }
  }


  // ----------------------------------------
  // ----- Our actions

  getAction() {
    return {
      showView: (title, anim = 0) => {
        this.props.navigator.push({title: title, anim: anim});
      },
      search: () => {
        const {
          npa,
          handleLinesNPASub,
          handleLinesSub
        } = this.state;

        // Search lines by NPA
        if (this.validateForm()) {

          const payload = {
            npa: npa
          }

          const onReady = () => {
            this.forceUpdate();
          }

          const handler = asyncApi.subscribe('linesToTakeATicketWithNpa', payload, onReady);
          if (handleLinesNPASub) {
            handleLinesNPASub.stop();
          }
          if (handleLinesSub) {
            handleLinesSub.stop();
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
        const {
          pos,
          handleLinesSub
        } = this.state;

        // Search lines by location
        if (pos) {
          const payload = {
            lng: pos.coords.longitude,
            lat: pos.coords.latitude,
            meter: 1000
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
    return text.getText((noPrefix ? "" : "ListRestoView.") + code);
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
    const {
      npa
    } = this.state;

    if (!npa) {
      this.setState({npaError: this.getText('error_empty')});
      return false;
    }

    const re = /^\d{4}$/;
    if (!re.test(npa)) {
      this.setState({npaError: this.getText('error_invalid_npa')});
      return false;
    }
    return true;
  }


  // ----------------------------------------
  // ----- Render

  render() {
    if (!this.props.connected)
    this.manageLostConnection();

    const actions = this.getAction();

    const {
      handleLinesNPASub
    } = this.state;

    const {
      lines,
      onSignOut
    } = this.props;

    let content;

    if (!handleLinesNPASub || !handleLinesNPASub.ready()) {
      content = this.renderSearch(actions);
    } else if (lines.length) {
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
            <Button onPress={onSignOut} transparent>
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

    const {
      npaError,
      npa,
      posDenied,
      handleLinesSub,
      pos
    } = this.state;

    const {
      lines,
      navigator
    } = this.props;

    const npaErrorComp = this.renderError(npaError);

    let linesComp = null;

    if (!posDenied) {
      if (handleLinesSub) {
        if (lines.length) {
          let tab = [];
          const fromProp = {
            view: "ListRestoView"
          };
          lines.forEach((line) => {
            tab.push(<Resto key={line._id} line={line} navigator={navigator} from={fromProp} pos={pos ? pos.coords : null}/>);
          });

          linesComp = (
            <Card>
              <CardItem>
                <Text style={nativeStyles.gpsFoundText}>{lines.length + " " + this.getText('text_gps_found')}</Text>
              </CardItem>
              {tab}
            </Card>
          );
        } else {
          const cont = handleLinesSub.ready()
          ? <Text style={nativeStyles.gpsFoundText}>{this.getText('text_gps_not_found')}</Text>
          : null;
          linesComp = (
            <Card>
              <CardItem>
                {cont}
              </CardItem>
            </Card>
          );
        }
      }
    } else {
      linesComp = (
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
              <Item error={boolError(npaErrorComp)}>
                <Input
                  placeholder={this.getText('label_npa')}
                  onSubmitEditing={actions.search}
                  autoCorrect={false}
                  onChangeText={(npa) => this.setState({npa, npaError: ""})}
                  value={npa}/>
                {npaErrorComp}
              </Item>
            </Form>
            <Button info onPress={actions.search}>
              <Text style={nativeStyles.buttonText}>{this.getText('label_search_button')}</Text>
            </Button>
          </CardItem>
        </Card>
        {linesComp}
      </View>
    );
  }

  renderSearchedLines(actions) {
    // Render lines found by NPA

    const {
      npa,
      pos
    } = this.state;

    const {
      lines,
      navigator
    } = this.props;

    const tab = [];
    const fromProp = {
      view: "ListRestoView",
      params: {
        npa: npa
      }
    };
    lines.forEach((line) => {
      tab.push(<Resto key={line._id} line={line} navigator={navigator} from={fromProp} pos={pos ? pos.coords : null}/>);
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
}


// ----------------------------------------
// ----- Styles

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
