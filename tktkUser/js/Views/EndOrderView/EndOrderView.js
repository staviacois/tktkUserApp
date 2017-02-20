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

class EndOrderView extends Component {

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

   getAction() {
      return {
         showView: (title) => {
            this.props.navigator.push({title: title});
         },
         goBack: () => {
            this.props.navigator.push({
               title: "RestoView",
               anim: 1,
               params: {
                  line: this.props.line,
                  recap: this.props.params.recap,
                  from: this.props.params.from
               }
            });
         },
         endOrder: () => {
            if (this.validateForm()) {
               const tab = [];
               let total = 0;
               let time = 0;

               Object.values(this.props.params.recap).forEach((item) => {
                  total = total + item.price * item.count;
                  time = time + item.count * item.time;
                  tab.push({name: item.name, price: item.price, quantity: item.count});
               });

               const payload = {
                  idline: this.props.line._id,
                  urlname: this.props.line.urlname,
                  name: this.state.name,
                  phonenumber: this.state.tel,
                  order: tab,
                  timePrep: time,
                  payement: {
                     choice: 0,
                     orderprice: total,
                     type: 0
                  }
               }

               const cbSuccess = (err, res) => {
                  if (err) {
                     Alert.alert('', this.getText("generic_error_message") + " (" + err.error + ")");
                     this.setState({nameError: "", telError: "", addressError: ""});
                  } else {
                     if (!res.problem) {
                        this.setState({nameError: "", telError: "", addressError: ""});
                        this.props.navigator.push({
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
      return text.getText((noPrefix
         ? ""
         : "EndOrderView.") + code);
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
      if (!this.state.name || !this.state.tel || (this.props.line.settings.delivery && this.state.deliverCheck && !this.state.address)) {
         this.setState({
            nameError: this.verifyEmpty(this.state.name),
            telError: this.verifyEmpty(this.state.tel),
            addressError: (this.state.deliverCheck && this.props.line.settings.delivery
               ? this.verifyEmpty(this.state.address)
               : "")
         });
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

   renderRecap() {

      const tab = [];

      let total = 0;

      for (key in this.props.params.recap) {
         const article = this.props.params.recap[key];
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
      const nameError = this.renderError(this.state.nameError);
      const telError = this.renderError(this.state.telError);

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
               <Item stackedLabel error={boolError(nameError)}>
                  <Label>{this.getText('label_name')}</Label>
                  <Input autoCorrect={false} onChangeText={(name) => this.setState({name, nameError: ""})} value={this.state.name}/>
               </Item>
               {nameError}
               <Item style={nativeStyles.secondInput} stackedLabel error={boolError(telError)}>
                  <Label>{this.getText('label_tel')}</Label>
                  <Input autoCorrect={false} autoCorrect={false} onChangeText={(tel) => this.setState({tel, telError: ""})} value={this.state.tel}/>
               </Item>
               {telError}
            </Form>
         </Card>
      );
   }

   renderDeliver() {
      if (this.props.line.settings.delivery) {
         const addressError = this.renderError(this.state.addressError);

         const boolError = function(error) {
            return error
               ? true
               : false;
         }

         const deliverForm = this.state.deliverCheck
            ? (
               <Form style={nativeStyles.form}>
                  <Item stackedLabel error={boolError(addressError)}>
                     <Label>{this.getText('label_address')}</Label>
                     <Input autoCorrect={false} onChangeText={(address) => this.setState({address, addressError: ""})} value={this.state.address}/>
                  </Item>
                  {addressError}
               </Form>
            )
            : null;
         return (
            <Card>
               <CardItem>
                  <CheckBox checked={this.state.deliverCheck} onPress={() => this.setState({
                     deliverCheck: !this.state.deliverCheck
                  })}/>
                  <Text style={nativeStyles.cardHeaderText}>{this.getText('label_deliver')}</Text>
               </CardItem>
               {deliverForm}
            </Card>
         );
      } else {
         return null;
      }
   }

   render() {
      if (!this.props.connected)
         this.manageLostConnection();

      const actions = this.getAction();

      let footerEnabled = this.props.line.settings.enable;
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
                  <Title>{this.getText('text_header') + this.props.line.linename}</Title>
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
}

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

   const payload = props.params.line.urlname;
   const handleSubs = asyncApi.multiSubscribe([
      {
         name: 'lineChoose',
         payload: payload
      }
   ]);

   const data = {
      connected: asyncApi.checkConnection(),
      ready: handleSubs.ready(),
      line: asyncApi.findOne('lines', {urlname: props.params.line.urlname})
   }

   return data;
}, EndOrderView);
