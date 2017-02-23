// ----------------------------------------
// ----- Imports

// npm
import React, {Component} from 'react';
import {Text, Alert, Linking} from 'react-native';
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

// libs
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';
import * as storage from '../../libs/storage.js';

// components
import Header from '../../Components/Header.js';

class OrderView extends Component {
  // This view shows the state and informations about a ticket


  // ----------------------------------------
  // ----- Component actions

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const {
      ticket
    } = this.props;

    // This inerval is used to keep the time up to date in the state
    const handler = setInterval(() => {
      if (ticket && ticket.logs.accepted) {
        const newTime = this.getTimePrep();
        if (this.state.time !== newTime) {
          this.setState({time: this.getTimePrep()});
        }
      }
    }, 1000);
    this.setState({handleTimerInterval: handler});
  }

  componentWillUpdate(nextProps, nextState) {
    // Instantly set the time to wait, before the interval updates it
    if (nextProps.ticket && nextProps.ticket.logs.accepted) {
      nextState.time = this.getTimePrep(nextProps.ticket);
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.handleTimerInterval);
  }


  // ----------------------------------------
  // ----- Our actions

  getAction() {
    return {
      showView: (title) => {
        this.props.navigator.push({title: title});
      }
    };
  }

  getText(code, noPrefix) {
    return text.getText((noPrefix ? "" : "OrderView.") + code);
  }

  manageLostConnection() {
    let checkAgainLater = () => {
      if (!this.props.connected) {
        asyncApi.defaultErrorAction(this.props.navigator);
      }
    }
    setTimeout(checkAgainLater, 3000);
  }

  getTimePrep(ticket = this.props.ticket) {
    // Calc difference in minutes between ticket.logs.accepted and now
    const diff = Math.round((new Date() - ticket.logs.accepted) / 1000 / 60);
    let minutes = ticket.timePrep - diff;
    if (minutes < 1) {
      minutes = 1;
    }
    return minutes;
  }


  // ----------------------------------------
  // ----- Render

  render() {
    if (!this.props.connected)
    this.manageLostConnection();

    const actions = this.getAction();

    const {
      ready,
      line
    } = this.props;

    if (ready) {

      return (
        <Container>
          <Header>
            <Left/>
            <Body>
              <Title>{this.getText('text_header') + line.linename}</Title>
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

  renderRecap() {
    const {
      ticket,
      archive
    } = this.props;

    if (ticket || archive) {
      ticketToUse = ticket || archive;

      const tab = [];

      let total = 0;

      ticketToUse.order.forEach((article) => {
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
            <Text style={nativeStyles.cardHeaderText}>{this.getText('label_order') + ticketToUse.number}</Text>
          </CardItem>
          {tab}
          <CardItem>
            <Right>
              <Text>{this.getText('label_total') + ticketToUse.payement.orderprice + " CHF"}</Text>
            </Right>
          </CardItem>
        </Card>
      );
    } else {
      return null;
    }
  }

  renderMessage() {
    const {
      time
    } = this.state;

    const {
      ticket,
      line,
      tickets,
      archive
    } = this.props;

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
    if (ticket) {
      const infoPay = (
        <Card key={0}>
          <CardItem>
            <Text>{this.getText('payment_at_reception')}</Text>
          </CardItem>
        </Card>
      );

      const onOpenMap = () => {
        Linking.openURL(line.position.url);
      };
      const buttonMap = (
        <CardItem style={nativeStyles.buttonMap} onPress={onOpenMap}>
          <Text style={nativeStyles.buttonMapText}>{this.getText('open_map')}</Text>
          <Icon name="arrow-forward"/>
        </CardItem>
      );

      let r = null;
      switch (ticket.status) {
        case 10:
        let position = 0;
        tickets.forEach((ticket) => {
          if (ticket.number < ticket.number && ticket.status <= 12 && ticket.payement.choice !== -1) {
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
              <Text>{this.getText('preparation_text1') + " " + this.state.time + " " + this.getText('preparation_text2_' + (this.state.time > 1 ? 'p' : 's'))}</Text>
            </CardItem>
            {buttonMap}
          </Card>
        ), infoPay];
        break;
        case 20:
        r = [(
          <Card key={1}>
            <CardItem>
              <Icon name='restaurant'/>
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
              <Icon name='restaurant'/>
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
              <Text style={nativeStyles.important}>{ticket.phonenumber}</Text>
            </CardItem>
          </Card>
        ), infoPay];
        break;
        default:
        r = defaultReturn;
        break;
      }
      return r;
    } else if (archive) {
      let r = null;

      switch (archive.status) {
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
    const {
      ticket,
      params,
      navigator,
      archive,
      login
    } = this.props;

    let r = null;
    if (ticket && ticket.status === 10) {
      const onPress = () => {
        const payload = {
          ticketid: ticket._id,
          tokenticket: params.ticket.token
        }

        const cbSuccess = (err, res) => {
          if (err) {
            Alert.alert('', this.getText("generic_error_message") + " (" + err.error + ")");
          } else {
            if (!res.problem) {
              storage.remove('@Ticket' + login._id, (err) => {});
              navigator.push({title: 'ListRestoView', anim: 1});
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
    } else if (archive) {
      const onPress = () => {
        storage.remove('@Ticket' + login._id, (err) => {
          if (!err) {
            navigator.push({title: 'ListRestoView', anim: 1});
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
}


// ----------------------------------------
// ----- Styles

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
  const {
    params
  } = props;

  const handleSubs = asyncApi.multiSubscribe([
    {
      name: 'lineChoose',
      payload: params.ticket.urlname
    }, {
      name: 'tickets',
      payload: {
        urlname: params.ticket.urlname,
        tokenticket: params.ticket.token
      },
      multiArgs: true
    }, {
      name: 'archiveForClient',
      payload: {
        urlname: params.ticket.urlname,
        tokenticket: params.ticket.token
      },
      multiArgs: true
    }
  ]);

  const data = {
    connected: asyncApi.checkConnection(),
    ready: handleSubs.ready(),
    line: asyncApi.findOne('lines', {urlname: params.ticket.urlname}),
    ticket: asyncApi.findOne('tickets', {
      urlname: params.ticket.urlname,
      number: params.ticket.number
    }),
    archive: asyncApi.findOne('tickets_arch', {
      urlname: params.ticket.urlname,
      number: params.ticket.number
    }),
    tickets: asyncApi.find('tickets')
  }

  return data;
}, OrderView);
