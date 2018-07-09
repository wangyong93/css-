import { Utils } from './utils.js';
export default {
  setContact: function(contact) {
    try {
      contact = JSON.stringify(contact);
    } catch (error) {}
    if (sessionStorage) {
      sessionStorage.setItem('contact', contact);
    } else {
      Utils.setCookie('contact', contact, 0.5);
    }
  },

  getContact: function() {
    var contact = '';
    if (sessionStorage) {
      contact = sessionStorage.getItem('contact');
    } else {
      contact = Utils.getCookie('contact');
    }
    try {
      contact = JSON.parse(contact);
    } catch (error) {}
    return contact;
  }
};
