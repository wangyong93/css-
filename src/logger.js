import SFGather from './assets/SfGather-1.0.6.min.js';
import Config from './config.js';
import { Utils } from './utils.js';
import md5 from 'js-md5';

/**
 * Generate fake uid just md5 user's telephone
 */
function getUid() {
  var user = Utils.getUser();
  if (user && user.telephone) {
    return md5(user.telephone);
  } else {
    return '';
  }
}

/**
 * Get channel
 */
function getChannel() {
  return Utils.getChannel();
}

function getLoginStatus() {
  var user = Utils.getUser();
  return (user && user.telephone) ? 1 : 0;
}

function getOs() {}

function getBase() {
  return {
    channel: getChannel(),
    login_status: getLoginStatus(),
    app_version: Config.appVersion
  };
}

// Set cookie for SfGather
if (!Utils.getCookie('JSESSIONID')) {
  Utils.setSessionCookie('JSESSIONID', Utils.guid());
}

SfGather.init({
  app_id: 'esg_css_core',
  debug: PRODUCTION ? false : true,
  url: Config.sfGatherUrl,
  platform: 'h5'
});

var log = function(event, message) {
  var base = getBase();
  SfGather.set_login_info(getUid());
  SfGather.q.push([
    'add_event',
    Object.assign(
      {
        event_id: event
      },
      base,
      message
    )
  ]);
};



var parsePageName = function() {
  var h = document.location.hash;
  if(h.indexOf('/#/send/confirm') !== -1) {
    return '确认寄件信息';
  }
  if (h.indexOf('/#/send/contactList') !== -1) {
    return '地址管理';
  }

  return '首页';
}

export default {
  log: log,
  parsePageName: parsePageName
};
