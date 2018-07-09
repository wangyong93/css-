import axios from "axios";
import Qs from "qs";
import jsonp from "jsonp";
import Config from "./config.js";
import { Utils } from "./utils.js";

axios.defaults.baseURL = Config.baseURL;
axios.defaults.headers["Content-Type"] =
  "application/x-www-form-urlencoded;charset=UTF-8";


//区分开发环境与生成环境的请求地址
let autoService = '';
if (PRODUCTION || CI) {
  autoService = '/CSS/automaticService.pub'
} else {
  autoService = '/css/automatic/automaticService.pub'
}


function get(operation, userType, body) {
  return new Promise((resolve, reject) => {
    axios.get(autoService, {
        params: {
          requestJson: {
            header: {
              operation: operation,
              orderSource: "1",
              userType: userType
            },
            body: body
          }
        }
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

function auth(telephone, code) {
  return new Promise((resolve, reject) => {
    axios.get(autoService, {
        params: {
          requestJson: {
            header: {
              operation: "findToken",
              orderSource: "1",
              userType: "1"
            },
            body: {
              customerPhone: telephone,
              authCode: code
            }
          }
        }
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}
function getUserType(telephone,token) {
  return new Promise((resolve, reject) => {
    axios.get(autoService, {
        params: {
          requestJson: {
            header: {
              operation: "findAddress",
              orderSource: "1",
              userType: "1"
            },
            body: {
              customerPhone: telephone,
              operationFlag: "select",
              operatorType: "0",
              token:token
            }
          }
        }
      })
      .then(response => {
        var data = response.data;
        if (data.results && data.results.code == "0000") {
          if (data.results.data && data.results.data.length > 0) {
            resolve("2"); // old user
          } else {
            resolve("1"); // new user
          }
        } else {
          reject(data.msg);
        }
      })
      .catch(error => {
        reject(error);
      });
  });
}

function parseLocation(x, y) {
  return new Promise((resolve, reject) => {
    var url =
      Config.geoUrl +
      "?" +
      Qs.stringify({
        ak: Config.geoAk,
        x: x,
        y: y
      });

    jsonp(url, { param: "cb" }, (err, data) => {
      if (err) {
        reject(err);
        return;
      }

      if (data.status == 0) {
        resolve(data.result);
      }
    });
  });
}

function getGeoPosition() {
  return Utils.getLocation().then(pos => {
    return parseLocation(pos.coords.longitude, pos.coords.latitude);
  });
}

function getDetailInfo(telephoneNum,wbNum,tokenStr){
	return new Promise((resolve, reject) => {
		axios.get('/CSS/queryWaybillInfoByNoOnCss.pub',{
			 params:{
			 	 requestJson:{
			 	 		header:{
			 	 			 "operation":"queryWaybillInfoByNoOnCss",
			 	 			 "orderSource":"1",
			 	 			 "userType":"1"
			 	 		},
				    body:{
				        "telNo":telephoneNum,
				        "waybillNo":wbNum,
				        "token":tokenStr
				    }			 	 		
			 	 }
			 }
		})
		.then(response => {
			resolve(response);
		});
	})
}


export default {
  get,
  auth,
  getUserType,
  parseLocation,
  getGeoPosition,
  getDetailInfo
};
