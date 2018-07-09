import Vue from 'vue';
import Vuex from 'vuex';
import Api from './service.js';
import {Utils} from './utils';

Vue.use(Vuex);

const contactFactory = function() {
  return {
    id: '',
    name: '',
    telephone: '',
    address: {
      name: '',
      province: '',
      city: {
        name: '',
        deptCode: ''
      },
      district: {
        name: '',
        zoneCode: ''
      }
    },
    addressDetail: ''
  };
};

const store = new Vuex.Store({
  state: {
    fromContact: contactFactory(),
    toContact: contactFactory(),
    fromContactList: [],
    toContactList: [],
    isShowNews:JSON.parse(Utils.GetQueryString('showPush')) || false
  },
  mutations: {
    setFromContact: function(state, contact) {
      if (!contact) {
        state.fromContact = contactFactory();
      } else {
        state.fromContact = contact;
      }
    },
    setToContact: function(state, contact) {
      if (!contact) {
        state.toContact = contactFactory();
      } else {
        state.toContact = contact;
      }
    },
    initContactList: function(state, payload) {
      if (payload.type == 'from') {
        state.fromContactList = payload.list;
      }

      if (payload.type == 'to') {
        state.toContactList = payload.list;
      }
    }
  }
});

export default store;
