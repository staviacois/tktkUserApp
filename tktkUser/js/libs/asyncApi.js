import Meteor from 'react-native-meteor';
import {Alert, Platform} from 'react-native';
import * as text from './text.js';

const TIMEOUT_MS = 3000;

function getText(code) {
   return text.getText('asyncApi.' + code);
}

function init() {
   let dev = true;
   let server = "";
   if (dev) server = '10.7.26.77:3000'; // 10.7.26.77 192.168.1.112

   if(Platform.OS === 'ios')
     server = dev ? "http://" + server : "https://" + server;
   else if(Platform.OS === 'android')
     server = dev ? "ws://" + server : "ws://" + server;

   server = server + '/websocket';
   //server = 'http://10.7.26.77:3000/websocket';


   Meteor.connect(server);
}

function checkConnection() {
   const stateOfConnection = Meteor.status();
   return stateOfConnection.connected;
}

// name : nom de la méthode à appeler
// payload : paramètres à donner à la méthode
// cbSuccess : callback en cas de succès
// onTimeout : fonction à appeler en cas de timeout (si pas définie, pas de timeout)
function callAsyncServer(name, payload, cbSuccess, onTimeout, multiArgs) {
   let finish = false;
   const cb = (err, res) => {
      if (!finish) {
         finish = true;
         cbSuccess(err, res);
      }
   };
   if (multiArgs) {
      const tab = Object.values(payload);
      Meteor.call(name, ...tab, cb);
   } else {
      Meteor.call(name, payload, cb);
   }

   if (onTimeout) {
      setTimeout(() => {
         if (!finish) {
            finish = true;
            Alert.alert('', getText('not_connected'));
            onTimeout();
         }
      }, TIMEOUT_MS);
   }
}

// subscriptions : tableau d'objets {name, payload} représentant une subscription
// onReady : fonction à appeler lorsque les subscriptions sont prêtes
// onTimeout : fonction à appeler en cas de timeout (si pas définie, pas de timeout)
/*
function subscribe(subscriptions, onReady, onTimeout) {
   const tab = [];
   subscriptions.forEach((subscription) => {
      const obj = {};
      obj.handler = Meteor.subscribe(subscription.name, subscription.payload, () => {
         obj.wasReady = true;
         onReady();
      });
      tab.push(obj);
   });

   const r = () => {
      let ready = true;
      tab.forEach((subscription) => {
         ready = ready && subscription.wasReady;
      });
      return ready;
   };

   if (onTimeout) {
      setTimeout(() => {
         if (!r()) {
            onTimeout();
         }
      }, TIMEOUT_MS);
   }

   return {ready: r};
}
*/

function subscribe(name, payload, onReady) {
   const tab = Object.values(payload);
   return Meteor.subscribe(name, ...tab, onReady);
}

function multiSubscribe(subscriptions) {
   const tab = [];
   subscriptions.forEach((subscription) => {
      if (subscription.multiArgs) {
         const tab = Object.values(subscription.payload);
         tab.push(Meteor.subscribe(subscription.name, ...tab));
      } else {
         tab.push(Meteor.subscribe(subscription.name, subscription.payload));
      }
   });

   const r = () => {
      let ready = true;
      tab.forEach((handler) => {
         ready = ready && handler.ready();
      });
      return ready;
   };

   return {ready: r};
}

function defaultErrorAction(nav) {
   Alert.alert(getText('not_connected_title'), getText('not_connected'));
   nav.replace({title: 'HomeView'});
}

function findOne(collection, find = {}, options = {}) {
   return Meteor.collection(collection).findOne(find, options);
}

function find(collection, find = {}, options = {}) {
   return Meteor.collection(collection).find(find, options);
}

module.exports = {
   init: init,
   checkConnection: checkConnection,
   callAsyncServer: callAsyncServer,
   subscribe: subscribe,
   multiSubscribe: multiSubscribe,
   defaultErrorAction: defaultErrorAction,
   findOne: findOne,
   find: find
}
