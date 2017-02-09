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
import Resto from './Resto.js';
import * as text from '../../libs/text.js';
import * as asyncApi from '../../libs/asyncApi.js';

class SignUpView extends Component {

   constructor(props) {
      super(props);

      this.state = {
         npa: "1470",
         npaError: ""
      }
   }

   componentWillMount() {
      this.props.commonFuncs.onSetTextHeader(this.getText('text_header'));
      this.props.commonFuncs.onSetMenu(this.renderMenu());

      this.searchWithLocation();
   }

   renderMenu() {
      const actions = this.getAction();

      const onPress = (label) => {
         if (label) {
            actions.showView(label);
         }
         this.props.commonFuncs.onSetMenuIsOpen(false);
      }

      return (
         <ScrollView scrollsToTop={false}>
            <Text onPress={() => onPress('SignInView')} style={styles.menuText}>{this.getText('menu_label.loginview', true)}</Text>
            <Text onPress={() => onPress('SignUpView')} style={styles.menuText}>{this.getText('menu_label.signupview', true)}</Text>
            <Text onPress={() => onPress()} style={[styles.menuText, styles.menuTextActive]}>{this.getText('menu_label.listrestoview', true)}</Text>
         </ScrollView>
      );
   }

   getAction() {
      return {
         showView: (title) => {
            this.props.navigator.push({title: title});
         },
         search: () => {
            if (this.validateForm()) {
               if (this.state.handleLinesNPASub) {
                  this.state.handleLinesNPASub.stop();
               }

               const payload = {
                  npa: this.state.npa
               }

               const onReady = () => {
                  this.forceUpdate();
               }

               const handler = asyncApi.subscribe('linesToTakeATicketWithNpa', payload, onReady);
               this.setState({handleLinesNPASub: handler, npaError: ""});
            }
         },
         removeSub: () => {
            this.state.handleLinesNPASub.stop();
            this.setState({handleLinesNPASub: null});
         }
      };
   }

   getText(code, noPrefix) {
      return text.getText((noPrefix
         ? ""
         : "ListRestoView.") + code);
   }

   searchWithLocation() {
      navigator.geolocation.getCurrentPosition((pos) => {
         const payload = {
            lng: pos.coords.longitude,
            lat: pos.coords.latitude,
            meter: 10
         }
         const onReady = () => {
            this.forceUpdate();
         }
         // TODO : publication 'linesToTakeATicket' ne fonctionne pas ?
         //const handler = asyncApi.subscribe('linesToTakeATicket', payload, onReady);
         //this.setState({handleLinesSub: handler});
      }, (err) => {}, {
         enableHighAccuracy: true,
         timeout: 20000,
         maximumAge: 1000
      });
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
            <Text style={styles.errorLabel}>{error}</Text>
         );
      }
      return null;
   }

   renderStyle(error) {
      if (error) {
         return styles.formTextInputError;
      }
      return styles.formTextInput;
   }

   renderSearch(actions) {
      const npaError = this.renderError(this.state.npaError);
      const npaStyle = this.renderStyle(this.state.npaError);

      return (
         <View style={styles.formContainer}>
            <Text style={styles.formLabel}>{this.getText('text_npa')}</Text>
            <Text style={styles.formLabel}>{this.getText('label_npa')}</Text>
            <TextInput style={npaStyle} onChangeText={(npa) => this.setState({npa})} value={this.state.npa}/>{npaError}
            <TouchableHighlight style={styles.searchButton} onPress={actions.search} underlayColor={'#286090'}>
               <Text style={styles.searchButtonText}>{this.getText('label_search_button')}</Text>
            </TouchableHighlight>
         </View>
      );
   }

   renderSearchedLines(actions) {
      const tab = [];

      this.props.lines.forEach((line) => {
         tab.push(<Resto key={line._id} line={line} navigator={this.props.navigator}/>);
      });

      return (
         <View style={styles.linesNpaContainer}>
            {tab}
            <TouchableHighlight style={styles.searchButton} onPress={actions.removeSub} underlayColor={'#286090'}>
               <Text style={styles.searchButtonText}>{this.getText('label_cancel_button')}</Text>
            </TouchableHighlight>
         </View>
      );
   }

   renderNotFound(actions) {
      return (
         <View style={styles.formContainer}>
            <Text>Not found</Text>
         </View>
      );
   }

   render() {
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
         <View style={styles.container}>
            <ScrollView style={styles.content}>{content}</ScrollView>
         </View>
      );
   }
}

var styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: 'white'
   },
   menuText: {
      color: 'white',
      fontSize: 17,
      padding: 20,
      fontWeight: '700'
   },
   menuTextActive: {
      color: '#aaa'
   },
   content: {
      backgroundColor: 'rgb(238, 238, 238)'
   },
   formContainer: {
      margin: 15,
      paddingLeft: 15,
      paddingRight: 15,
      paddingBottom: 15,
      backgroundColor: 'white',
      borderWidth: 4,
      borderColor: 'rgb(238, 238, 238)',
      borderStyle: 'dotted'
   },
   formLabel: {
      marginBottom: 5,
      marginTop: 15
   },
   formTextInput: {
      height: 35,
      borderColor: '#eee',
      borderWidth: 1,
      paddingLeft: 10
   },
   formTextInputError: {
      height: 35,
      borderColor: 'rgb(217, 83, 79)',
      borderWidth: 1,
      borderRadius: 3,
      paddingLeft: 10
   },
   searchButton: {
      backgroundColor: '#337ab7',
      borderWidth: 1,
      borderColor: 'rgb(32, 77, 116)',
      borderRadius: 6,
      height: 40,
      justifyContent: 'center',
      marginTop: 20
   },
   searchButtonText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 20
   },
   errorLabel: {
      color: '#a94442',
      fontWeight: '600'
   },
   linesNpaContainer: {
      margin: 15
   }
});

export default createContainer(props => {

   const data = {
      connected: asyncApi.checkConnection(),
      lines: asyncApi.find('lines')
   }

   return data;

}, SignUpView);
