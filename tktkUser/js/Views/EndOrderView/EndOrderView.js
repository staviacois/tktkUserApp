// ----------------------------------------
// ----- Imports

// npm
import React, {Component} from 'react';
import {Text, Alert} from 'react-native';
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
  Input,
  Label,
  Item,
  Form,
  Card,
  CardItem,
  Footer,
  CheckBox
} from 'native-base';
import {createContainer} from 'react-native-meteor';

// libs
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';
import * as storage from '../../libs/storage.js';

// components
import Header from '../../Components/Header.js';

class EndOrderView extends Component {
  // This view shows a summary of an order, and asks for user informations to finalize an order


  // ----------------------------------------
  // ----- Component actions

  constructor(props) {
    super(props);

    this.state = {
      name: props.login.completName,
      tel: props.login.phonenbr,
      address: props.login.adress,
      nameError: "",
      telError: "",
      addressError: "",
      deliverCheck: false
    }
  }


  // ----------------------------------------
  // ----- Our actions

  getAction() {
    return {
      showView: (title) => {
        this.props.navigator.push({title: title});
      },
      goBack: () => {
        const {
          navigator,
          line,
          params
        } = this.props;

        navigator.push({
          title: "RestoView",
          anim: 1,
          params: {
            line: line,
            recap: params.recap,
            from: params.from
          }
        });
      },
      endOrder: () => {
        const {
          name,
          tel,
          deliverCheck,
          address
        } = this.state;

        const {
          params,
          line,
          login,
          navigator
        } = this.props;

        if (this.validateForm()) {
          const tab = [];
          let total = 0;
          let time = 0;

          Object.values(params.recap).forEach((item) => {
            total = total + item.price * item.count;
            time = time + item.count * item.time;
            tab.push({name: item.name, price: item.price, quantity: item.count});
          });

          const payload = {
            idline: line._id,
            urlname: line.urlname,
            name: name,
            phonenumber: tel,
            order: tab,
            timePrep: time,
            payement: {
              choice: 0,
              orderprice: total,
              type: 0
            }
          }
          if (deliverCheck) {
            payload.delivery = {
              adress: address
            };
          }

          const cbSuccess = (err, res) => {
            if (err) {
              Alert.alert('', this.getText("generic_error_message") + " (" + err.error + ")");
              this.setState({nameError: "", telError: "", addressError: ""});
            } else {
              if (!res.problem) {
                this.setState({nameError: "", telError: "", addressError: ""});
                // Stores the ticket
                storage.set('@Ticket' + login._id, JSON.stringify(res), () => {});
                navigator.push({
                  title: 'OrderView',
                  params: {
                    ticket: res
                  }
                });
              } else {
                Alert.alert('', res.message);
                this.setState({nameError: "", telError: "", addressError: ""});
              }
            }
          };

          const cbError = () => {
            this.setState({nameError: "", telError: "", addressError: ""});
          }

          asyncApi.callAsyncServer('takeATicketOrder', payload, cbSuccess, cbError);
        }
      }
    };
  }

  getText(code, noPrefix) {
    return text.getText((noPrefix ? "" : "EndOrderView.") + code);
  }

  manageLostConnection() {
    let checkAgainLater = () => {
      if (!this.props.connected) {
        asyncApi.defaultErrorAction(this.props.navigator);
      }
    }
    setTimeout(checkAgainLater, 3000);
  }

  verifyEmpty(text) {
    if (!text) {
      return this.getText('error_empty');
    }
    return "";
  }

  validateForm() {
    const {
      name,
      tel,
      deliverCheck,
      address
    } = this.state;

    const {
      line
    } = this.props;

    if (!name || !tel || (line.settings.delivery && deliverCheck && !address)) {
      this.setState({
        nameError: this.verifyEmpty(name),
        telError: this.verifyEmpty(tel),
        addressError: (deliverCheck && line.settings.delivery ? this.verifyEmpty(address) : "")
      });
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
      line
    } = this.props;

    let footerEnabled = line.settings.enable;
    let footerMessage = footerEnabled
    ? this.getText('footer_ordernow')
    : this.getText('footer_disabled');

    const footerButtonStyle = !footerEnabled
    ? nativeStyles.footerButtonDisabled
    : null;

    const onPress = () => {
      actions.endOrder();
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
            <Title>{this.getText('text_header') + line.linename}</Title>
          </Body>
          <Right/>
        </Header>
        <Content>
          {this.renderRecap()}
          {this.renderForm()}
          {this.renderDeliver()}
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

  renderError(error) {
    if (error) {
      return (
        <Text style={nativeStyles.errorLabel}>{error}</Text>
      );
    }
    return null;
  }

  renderRecap() {
    const {
      params
    } = this.props;

    const tab = [];

    let total = 0;

    for (key in params.recap) {
      const article = params.recap[key];
      total += article.count * article.price;
      tab.push(
        <ListItem key={article._id}>
          <Body>
            <Text>{article.count + "x " + article.name}</Text>
          </Body>
          <Right>
            <Text>{article.price + " CHF"}</Text>
          </Right>
        </ListItem>
      );
    }

    return (
      <Card>
        <CardItem>
          <Text style={nativeStyles.cardHeaderText}>{this.getText('label_order')}</Text>
        </CardItem>
        {tab}
        <CardItem>
          <Right>
            <Text>{this.getText('label_total') + total + " CHF"}</Text>
          </Right>
        </CardItem>
      </Card>
    );
  }

  renderForm() {
    const {
      nameError,
      telError,
      name,
      tel
    } = this.state;

    const nameErrorComp = this.renderError(nameError);
    const telErrorComp = this.renderError(telError);

    const boolError = function(error) {
      return error
      ? true
      : false;
    }

    return (
      <Card>
        <CardItem>
          <Text style={nativeStyles.cardHeaderText}>{this.getText('label_form')}</Text>
        </CardItem>
        <Form style={nativeStyles.form}>
          <Item stackedLabel error={boolError(nameErrorComp)}>
            <Label>{this.getText('label_name')}</Label>
            <Input autoCorrect={false} onChangeText={(name) => this.setState({name, nameError: ""})} value={name}/>
          </Item>
          {nameErrorComp}
          <Item style={nativeStyles.secondInput} stackedLabel error={boolError(telErrorComp)}>
            <Label>{this.getText('label_tel')}</Label>
            <Input autoCorrect={false} autoCorrect={false} onChangeText={(tel) => this.setState({tel, telError: ""})} value={tel}/>
          </Item>
          {telErrorComp}
        </Form>
      </Card>
    );
  }

  renderDeliver() {
    const {
      addressError,
      deliverCheck,
      address
    } = this.state;

    const {
      line
    } = this.props;

    if (line.settings.delivery) {
      const addressErrorComp = this.renderError(addressError);

      const boolError = function(error) {
        return error
        ? true
        : false;
      }

      const deliverForm = deliverCheck ? (
        <Form style={nativeStyles.form}>
          <Item stackedLabel error={boolError(addressErrorComp)}>
            <Label>{this.getText('label_address')}</Label>
            <Input autoCorrect={false} onChangeText={(address) => this.setState({address, addressError: ""})} value={address}/>
          </Item>
          {addressErrorComp}
        </Form>
      ) : null;
      return (
        <Card>
          <CardItem>
            <CheckBox checked={deliverCheck} onPress={() => this.setState({deliverCheck: !deliverCheck})}/>
            <Text style={nativeStyles.cardHeaderText}>{this.getText('label_deliver')}</Text>
          </CardItem>
          {deliverForm}
        </Card>
      );
    } else {
      return null;
    }
  }
}


// ----------------------------------------
// ----- Styles

const nativeStyles = {
  footerButtonText: {
    color: 'white',
    fontWeight: '700'
  },
  footerButtonDisabled: {
    backgroundColor: '#b5b5b5'
  },
  cardHeaderText: {
    fontWeight: '700',
    fontSize: 17
  },
  errorLabel: {
    paddingLeft: 25,
    color: '#a94442',
    fontWeight: '600'
  },
  form: {
    marginBottom: 20
  },
  secondInput: {
    marginTop: 20
  }
}

export default createContainer(props => {
  const {
    params
  } = props;

  const payload = params.line.urlname;
  const handleSubs = asyncApi.multiSubscribe([
    {
      name: 'lineChoose',
      payload: payload
    }
  ]);

  const data = {
    connected: asyncApi.checkConnection(),
    ready: handleSubs.ready(),
    line: asyncApi.findOne('lines', {urlname: params.line.urlname})
  }

  return data;
}, EndOrderView);
