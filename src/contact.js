import City from "./assets/city.json";
import { Constants, Utils } from "./utils.js";
import Api from "./service.js";

function getDeptCode(name) {
  var deptCode = "";
  for (var i = 0; i < City.length; i++) {
    for (var j = 0; j < City[i].sub.length; j++) {
      if (name === City[i].sub[j].name) {
        deptCode = City[i].sub[j].deptCode;
        break;
      }
    }

    if (deptCode) {
      break;
    }
  }

  return deptCode;
}

function getZoneCode(name) {
  var zoneCode = "";
  for (var i = 0; i < City.length; i++) {
    for (var j = 0; j < City[i].sub.length; j++) {
      for (var z = 0; z < City[i].sub[j].sub.length; z++) {
        if (name === City[i].sub[j].sub[z].name) {
          zoneCode = City[i].sub[j].sub[z].zoneCode;
          break;
        }
      }
      if (zoneCode) {
        break;
      }
    }

    if (zoneCode) {
      break;
    }
  }

  return zoneCode;
}

/**
 * @description Just copy properties
 * @param {Object} contact
 */
function ContactFactory(contact) {
  var addressName = contact.province + contact.city + contact.county;
  var deptCode = contact.areaCode || getDeptCode(contact.city);
  var zoneCode = getZoneCode(contact.county);

  return {
    id: contact.addressId,
    name: contact.userName,
    telephone: contact.userPhone,
    address: {
      name: addressName,
      province: contact.province,
      city: {
        name: contact.city,
        deptCode: deptCode
      },
      district: {
        name: contact.county,
        zoneCode: zoneCode
      }
    },
    addressDetail: contact.addressDetail
  };
}

export default {
  /**
   * @param {String} type  'from' or 'to'
   */
  getAll: function(telephone, type,token) {
    return new Promise((resolve, reject) => {
      Api.get("findAddress", "1", {
        customerPhone: telephone,
        operationFlag: "select",
        operatorType: Constants.contactType[type],
        token:token
      }).then(data => {
        if (data.results && data.results.data && data.results.data.length > 0) {
          resolve(
            data.results.data.map(element => {
              return ContactFactory(element);
            })
          );
        } else {
          resolve([]);
        }
      });
    });
  }
};
