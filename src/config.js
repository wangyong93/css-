
var baseURL = '';
var sfGatherUrl = "http://218.17.248.243:40021/json_data";
var geoUrl = 'http://gis-rss-rgeo.intsit.sfdc.com.cn:1080/rgeo';
var geoAk = 'a2c8bf3e5a236d2019494908c7156bbf';

if(PRODUCTION) { // PRODUCTION define by webpack
    baseURL = '';
    sfGatherUrl = 'https://inc-ubas-web.sf-express.com/json_data';
}

export default {
  baseURL: baseURL,
  sfGatherUrl: sfGatherUrl,
  appVersion: 'V1.2 SP2',
  geoUrl,
  geoAk
};