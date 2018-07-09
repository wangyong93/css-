import Vue from "vue";
import MintUI from "mint-ui";
import { Toast, MessageBox } from "mint-ui";
import "./styles/main.css";
import "mint-ui/lib/style.css";
import Router from "./router.js";
import App from "./App.vue";
import Api from "./service.js";
import Login from "./components/login/login.js";
import Logger from "./logger.js";
import { Utils, Constants } from "./utils.js";
import vConsole from "vconsole";

Vue.use(MintUI);


//手机端调试工具，仅供测试时使用
// var vconsole = new vConsole();

function LoginFactory(success, failure, opts) {
  Logger.log("CSSH5_Login_window_001");
  // ensure only one login instance
  if (LoginFactory.instances.length > 0) {
    LoginFactory.instances.forEach(element => {
      element.distory();
    });
    LoginFactory.instances = [];
  }

  var tip = "";
  if (opts && opts.tip) {
    tip = opts.tip;
  }
  var login = new Login({
    nextCb: function(telephone, reSend) {
      var logEvent = reSend
        ? "CSSH5_Login_window_003"
        : "CSSH5_Login_window_002";
      Api.get("authCode", "1", {
        customerPhone: telephone
      }).then(
        data => {
          if (data.results.code != "0000") {
            Logger.log(logEvent, {
              page_name: Logger.parsePageName(),
              SMScode_send: 1
            });
            if (data.results.code == "1004") {
              MessageBox("您操作太频繁了，请过一小时后再试");
            } else {
              MessageBox(data.results.msg);
            }
          } else {
            Logger.log(logEvent, {
              page_name: Logger.parsePageName(),
              SMScode_send: 2
            });
          }
        },
        error => {
          Logger.log(logEvent, {
            page_name: Logger.parsePageName(),
            SMScode_send: 1
          });
          MessageBox("网络错误，请稍后再试");
        }
      );
    },
    finishCb: function(telephone, code) {
      Api.get("verifyCode", "1", {
        customerPhone: telephone,
        authCode: code
      })
        .then(data => {
          if (data.results && data.results.code == "0000") {
            login.close();
            return Api.auth(telephone, code);
          } else {
            MessageBox(data.results.data);
            Logger.log("CSSH5_Login_window_005", {
              SMScode_identify: 0,
              login_result: 0,
              page_name: Logger.parsePageName()
            });
          }
        })
        .then(data => {
          if (data.results && data.results.code == "0000") {
            Logger.log("CSSH5_Login_window_005", {
              SMScode_identify: 1,
              login_result: 1,
              page_name: Logger.parsePageName()
            });
            var token = data.results.data;
            Utils.setUser({ telephone: telephone, token: token });
            success && success(telephone);
          } else {
            Logger.log("CSSH5_Login_window_005", {
              SMScode_identify: 1,
              login_result: 0,
              page_name: Logger.parsePageName()
            });
            MessageBox("验证失败");
          }
        })
        .catch(error => {
          failure && failure();
        });
    },
    tip: tip
  });

  LoginFactory.instances.push(login);

  login.open();
}

LoginFactory.instances = [];
Vue.prototype.$login = LoginFactory;

Vue.directive("focus", {
  // When the bound element is inserted into the DOM...
  inserted: function(el, { value }) {
    // Focus the element
    if (value) {
      el.focus();
    }
  }
});

// divide string to '3-3-3-3' fromat
Vue.filter("divideOrderNo", function(value) {
  if (value) {
    return Utils.divideString(value, 3, " ");
  }
});

// divide string to '3-4-4' fromat
Vue.filter("divideTel", function(value) {
  if (value) {
    return (
      value.substring(0, 3) +
      " " +
      Utils.divideString(value.substring(3), 4, " ")
    );
  }
});

Vue.filter("orderStatus", function(value) {
  if (!value) {
    return "待揽件";
  }

  return Constants.orderStatus[value];
});

new Vue({
  el: "#app",
  router: Router,
  render: h => h(App),
  mounted: function() {
    var load = document.getElementById("loading-screen");
    load.style.display = "none";
    // If login is open, close it
    if(this.$route.query.channel){
      Utils.setChannel(this.$route.query.channel);
    }
    this.$router.beforeEach((to, from, next) => {
      if (LoginFactory.instances.length > 0) {
        LoginFactory.instances[0].close();
      }

      //渠道号判断，如果链接中存在channel参数，则添加到sessionStorage里面，如果不存在该参数，则获取activeTab的值存到channel里面
      let channel;
      let activeTab = to.query.activeTab;
      if (activeTab != undefined) {
        if (activeTab == 0) {
          channel = 1006;
        } else if (activeTab == 1) {
          channel = 2006;
        } else if (activeTab == 2) {
          channel = 3006;
        } else {
        }
        Utils.setChannel(channel);
      } else {
      }
      channel = from.query.channel;
      if (channel) {
        to.query.channel = from.query.channel;
        Utils.setChannel(channel);
      }
      next();
    });
  }
});

window.onbeforeunload = function() {
  Logger.log("CSSH5_Close_001");
};
