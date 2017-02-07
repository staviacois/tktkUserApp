import Meteor from 'react-native-meteor';
import { Alert } from 'react-native';
import * as text from './text.js';

function getText(code) {
    return text.getText('asyncApi.' + code);
}

function init() {
    Meteor.connect('ws://10.7.26.78:3000/websocket');
    //Meteor.connect('ws://localhost:3000/websocket');
}

function checkConnection() {
    const stateOfConnection = Meteor.status();
    return stateOfConnection.connected;
}

function callAsyncServer(name, payload, cbSuccess, cbError) {
    if (checkConnection()) {
        Meteor.call(name, payload, cbSuccess);
        return true;
    } else {
        Alert.alert('', getText('not_connected'));
        cbError();
        return false;
    }
}

function subscribe(subscriptions, cbError) {
    if (checkConnection()) {
        const tab = [];
        subscriptions.forEach((subscription) => {
            tab.push(Meteor.subscribe(subscription.name, subscription.payload));
        });

        const r = () => {
            let ready = true;
            tab.forEach((subscription) => {
                ready = ready && subscription.ready();
            });
            return ready;
        };

        return { ready: r };
    } else {
        Alert.alert('', getText('not_connected'));
        cbError();
        return {
            ready: () => {
                return false;
            }
        };
    }
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
    findOne: findOne,
    find: find
}
