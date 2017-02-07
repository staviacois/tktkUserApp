import {AsyncStorage} from 'react-native';

function set(key, value, cb) {
   return AsyncStorage.setItem(key, value, cb);
}

function get(key, cb) {
   return AsyncStorage.getItem(key, cb);
}

function remove(key, cb) {
   return AsyncStorage.removeItem(key, cb);
}

function multiGet(keys, cb) {
   return AsyncStorage.multiGet(keys, cb);
}

module.exports = {
   set,
   get,
   remove,
   multiGet
}
