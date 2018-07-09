
var Utils = {
  userCookieName: "sf-css-user",
  channelName: "sf-channel-name",
  setCookie: function(name, value, days) {
    var exp = new Date();
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie =
      name + "=" + escape(value) + ";expires=" + exp.toGMTString();
  },

  setSessionCookie: function(name, value) {
    document.cookie = name + "=" + escape(value) + ";expires=Session";
  },

  getCookie: function(name) {
    var arr,
      reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if ((arr = document.cookie.match(reg))) {
      return unescape(arr[2]);
    } else {
      return null;
    }
  },

  deleteCookie: function(name) {
    var exp = new Date();
    exp.setTime(exp.getTime() - 24 * 60 * 60 * 1000);
    var value = this.getCookie(name);
    if (value != null)
      document.cookie = name + "= " + ";expires=" + exp.toGMTString();
  },

  getUser: function() {
    var user = this.getCookie(this.userCookieName);
    try {
      user = JSON.parse(user);
    } catch (e) {
      return null;
    }
    return user;
  },

  /**
   * @param {Object} user must has telephone
   */
  setUser: function(user) {
    try {
      user = JSON.stringify(user);
    } catch (e) {
      return;
    }
    this.setCookie(this.userCookieName, user, 30); // keep 30 days
  },

  clearUser: function() {
    this.deleteCookie(this.userCookieName);
  },

  getChannel: function() {
    var value = sessionStorage.getItem(this.channelName);
    return value;
  },

  setChannel: function(value) {
    sessionStorage.setItem(this.channelName, value);
  },

  validateTelephone: function(phone) {
    return /^1\d{10}$/.test(phone); // /^1(1|2|3|4|5|6|7|8|9)\d{9}$/.test(phone);
  },

  validatephone: function(phone) {
    return /^(\d{3,4})?\d{7,8}$/.test(phone);
  },
  GetQueryString: function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.hash.match(reg);
    if (r != null) return unescape(r[2]);
    return null;
  },
  getIp: function() {
    alert(
      "IP: " +
        returnCitySN.cip +
        "\nID: " +
        returnCitySN.cid +
        "\nCNAME: " +
        returnCitySN.cname +
        "\nDevice_id: " +
        SfGather.device_id +
        "\nUID: " +
        SfGather.uid
    );
    // alert("device_id" +SfGather.device_id)
  },

  /**
   * @param {Object} target
   * @param {Object} source
   */
  deepCopy: function(target, source) {
    try {
      Object.keys(target).forEach(key => {
        if (
          typeof target[key] === "object" &&
          typeof target[key] &&
          !Array.isArray(target[key])
        ) {
          this.deepCopy(target[key], source[key]);
        } else {
          target[key] =
            typeof source[key] !== undefined ? source[key] : target[key];
        }
      });
    } catch (e) {
      console.log("Deepcopy fail");
    }
  },

  prefixNumber: function(num) {
    return num > 9 ? num.toString() : "0" + num;
  },

  parseDate: function(date) {
    var dt = date ? date : new Date();
    var y = dt.getFullYear();
    var m = dt.getMonth() + 1; //获取当前月份的日期
    var d = dt.getDate();
    var hh = dt.getHours();
    var mm = dt.getMinutes();
    return (
      y +
      "-" +
      this.prefixNumber(m) +
      "-" +
      this.prefixNumber(d) +
      " " +
      this.prefixNumber(hh) +
      ":" +
      this.prefixNumber(mm)
    );
  },

  /**
   * @weight String
   */
  getMaxWeight: function(weight) {
    var w = 0;
    if (weight.indexOf("kg以上") !== -1) {
      w = Number(weight.replace("kg以上", "")) + 1;
    } else {
      w = weight.split("-")[1].replace("kg", "");
    }

    return w.toString() + ".0";
  },

  guid: function() {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    function guid() {
      return (
        S4() +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        "-" +
        S4() +
        S4() +
        S4()
      );
    }
    return guid();
  },

  /**
   * @argument {value} String
   */
  divideString: function(value, divide, separate) {
    if (!value) {
      return;
    }

    var n = 0;
    try {
      n = Math.ceil(value.length / divide);
    } catch (error) {
      return;
    }

    var tmp = [];
    for (var i = 0; i < n; i++) {
      tmp.push(value.substring(i * divide, (i + 1) * divide));
    }

    return tmp.join(separate);
  },

  getLocation: function() {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          position => {
            resolve(position);
          },
          error => {
            reject(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          }
        );
      } else {
        reject(new Error("Browser not support geolocation"));
      }
    }).catch(err => {
      console.log(err);
    });
  }
};

function Timer(count) {
  this.count = count;
  this.timer = null;
}

Timer.prototype = {
  constructor: Timer,
  run: function(cb) {
    if (this.timer) {
      this.stop();
    }

    function action(self) {
      self.count--;
      cb(self.count);
    }

    this.timer = setInterval(() => {
      action(this);
      if (this.count === 0) {
        this.stop();
      }
    }, 1000);
    action(this);
  },
  stop: function() {
    clearInterval(this.timer);
  }
};

var Constants = {
  contactType: {
    from: "0",
    to: "1"
  },
  contactTypeNum: {
    from: 1,
    to: 2
  },
  orderStatus: {
    "10": "已揽收",
    "20": "中转运输中",
    "60": "待派送滞留", // 异常
    "90": "遗失损坏",
    "100": "已理赔",
    "80": "海关通关中",
    "30": "待派送",
    "40": "准备派送",
    "50": "已派送成功",
    "110": "作废", // 异常
    "120": "派送滞留" // 异常
  }
};

export { Utils, Timer, Constants };
