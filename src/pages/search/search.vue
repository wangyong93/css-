<template>
  <div class="page">
    <route-nav :content="RouteName" v-show="showRouteNav==true"></route-nav>
    <div class="tab" >
      <ul>
        <li @click="switchTab(1);log('CSSH5_Check_searchwaybills_004')" :class="{active: tabIndex == 1}">快递单号查询</li>
        <li @click="switchTab(2);log('CSSH5_Check_searchwaybills_005')" :class="{active: tabIndex == 2}">手机号查询</li>
      </ul>
    </div>
    <div class="content" style="padding-top: 10px;">
      <section v-show="tabIndex == 1" class="order-search">
        <search-input v-model="orderNo" :autofocus="true" ref="searchInput"></search-input>
        <div class="btn">
          <mt-button @click="searchOrder()" :class="{'is-disabled': this.orderNo.length != 12}">查询</mt-button>
        </div>
        <div class="history" v-if="history.length > 0">
          <div class="title line-after">
            <span class="clear" @click="clearHistory()">清除历史</span>
            <span>查询历史</span>
          </div>
          <ul>
            <li v-for="(item, index) in history" :key="item" class="after-arrow line-before" @click="searchHistoryOrder(index)">
              {{item | divideOrderNo}}
            </li>
          </ul>
        </div>
      </section>
      <section v-show="tabIndex == 2" class="phone-search">
        <form>
          <div class="line-after">
            <div class="label">
              手机号
            </div>
            <div class="input-wrap">
              <input class="input-no" type="tel" v-model="form.telephone" placeholder="请输入手机号码" ref="phoneInput" v-focus="true">
            </div>
          </div>
          <div>
            <div class="label">
              验证码
            </div>
            <div class="input-wrap">
              <input class="input-no" type="tel" v-model="form.code" placeholder="请输入验证码" maxlength="6">
            </div>
            <div class="code-tip" @click="getCode()">{{timerTip}}</div>
          </div>
        </form>
        <div class="btn">
          <mt-button @click="validateCode()" :class="{'is-disabled': !canValidateCode}">查询</mt-button>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { Utils, Timer } from "../../utils.js";
import SearchHistory from "../../history.js";
import Api from "../../service.js";
import SearchInput from "../../components/search-input.vue";
import { MessageBox, Indicator, Toast } from "mint-ui";
import Logger from "../../logger.js";
import RouteNav from "../../components/route-nav.vue";
export default {
  components: {
    SearchInput: SearchInput,
    RouteNav: RouteNav
  },
  computed: {
    canGetCode: function() {
      return Utils.validateTelephone(this.form.telephone) && this.count == 60;
    },
    canValidateCode: function() {
      return (
        Utils.validateTelephone(this.form.telephone) &&
        this.form.code.length === 6
      );
    },
    timerTip: function() {
      if (this.count === 0 || !this.timer) {
        this.timer = null;
        this.count = 60;
        return "获取验证码";
      } else {
        return this.count + "秒后重发";
      }
    }
  },
  data: function() {
    return {
      tabIndex: 1,
      history: [],
      orderNo: "",
      form: {
        telephone: "",
        code: ""
      },
      timer: null,
      count: 60,
      searchFocus: false,
      count11: 0,
      showRouteNav: false,
      RouteName: "快递单号查询"
    };
  },
  mounted: function() {
    
    //链接参数判断，如果存在RouteType则改变ui，否则没变化
    if (this.$route.query.RouteType && this.$route.query.RouteType == 2) {
      this.showRouteNav = true;
    } else {
      this.showRouteNav = false;
    }



    this.tabIndex = this.$route.query.searchType || this.tabIndex;
    this.history = SearchHistory.get();
    if (this.$route.query.searchType == 1) {
      this.orderNo = this.$route.query.orderNo || "";
      Logger.log("CSSH5_Check_searchwaybills_001");
    } else {
      Logger.log("CSSH5_Login_page_001");
      var user = Utils.getUser();
      if (user && user.telephone && user.token) {
        this.$router.replace({
          path: "/search/list"
        });
      }
    }
  },
  watch: {
    tabIndex: function(value) {
      var user = Utils.getUser();
      if (value === 2) {
        if (user && user.telephone && user.token) {
          this.$router.replace({
            path: "/search/list"
          });
        }
      }
      this.RouteName = {
        1: "快递单号查询",
        2: "手机号查单"
      }[value];
    }
  },
  methods: {
    log: function(event) {
      Logger.log(event);
    },
    switchTab: function(index) {
      if (index == 1) {
        setTimeout(_ => {
          this.$refs.searchInput && this.$refs.searchInput.$refs.input.focus();
        }, 500);
      }
      if (index == 2) {
        setTimeout(_ => {
          this.$refs.phoneInput && this.$refs.phoneInput.focus();
        }, 500);
      }
      this.tabIndex = index;
      var query = JSON.parse(JSON.stringify(this.$route.query || {}));
      query.searchType = index;
      this.$router.replace({ query: query });
    },
    searchOrder: function() {
      if (this.orderNo.length !== 12) {
        return;
      }

      var user = Utils.getUser();
      var token = "";
      if (user) {
        token = user.token;
      } else {
        token = "";
      }
      SearchHistory.add(this.orderNo);
      this.$router.push({
        path: "/search/detail",
        query: { orderNo: this.orderNo }
      });
      Logger.log("CSSH5_Check_searchwaybills_002", {
        tracking_no: this.orderNo
      });
      // Indicator.open();
      // Api.get("searchTrace", "1", {
      //   waybillNo: this.orderNo,
      //   token: token,
      //   operationEquipment: SfGather.device_id
      // })
      //   .then(response => {
      //     Indicator.close();
      //     if (response.results.code == "0000") {
      //       SearchHistory.add(this.orderNo);
      //       this.$router.push({
      //         path: "/search/detail",
      //         query: { orderNo: this.orderNo }
      //       });
      //       Logger.log("CSSH5_Check_searchwaybills_002", {
      //         tracking_no: this.orderNo,
      //         search_status: 1
      //       });
      //     } else if (response.results.code == "1006") {
      //       this.$login(telephone => {
      //         this.searchOrder();
      //       }, failure => {}, {
      //         tip: "请验证手机号以后方可继续查询订单路由信息"
      //       });
      //     } else {
      //       Toast("无该订单信息");
      //       Logger.log("CSSH5_Check_searchwaybills_002", {
      //         tracking_no: this.orderNo,
      //         search_status: 0
      //       });
      //     }
      //   })
      //   .catch(_ => {
      //     Indicator.close();
      //   });
    },
    clearHistory: function() {
      SearchHistory.clear();
      this.history = [];
    },
    searchHistoryOrder: function(index) {
      var user = Utils.getUser();
      var token = "";
      var orderNo = this.history[index];
      Logger.log("CSSH5_Check_searchwaybills_003", {
        tracking_no: this.orderNo
      });
      if (user) {
        token = user.token;
      }
      this.$router.push({
        path: "/search/detail",
        query: {
          orderNo: orderNo,
          token: token,
          operationEquipment: SfGather.device_id
        }
      });
    },
    getCode: function() {
      if (!this.canGetCode) {
        return;
      }
      this.timer = new Timer(this.count);
      this.timer.run(count => {
        this.count = count;
      });

      Api.get("authCode", "1", {
        customerPhone: this.form.telephone
      }).then(
        data => {
          if (data.results.code != "0000") {
            if (data.results.code == "1004") {
              MessageBox("您下单太频繁了，请过一小时后再试");
            } else {
              MessageBox(data.results.msg);
            }
            Logger.log("CSSH5_Login_page_002", {
              page_name: "手机号查询",
              SMScode_request: 0
            });
          } else {
            Logger.log("CSSH5_Login_page_002", {
              page_name: "手机号查询",
              SMScode_request: 1
            });
          }
        },
        error => {
          MessageBox("网络错误，请稍后再试");
          Logger.log("CSSH5_Login_page_002", {
            page_name: "手机号查询",
            SMScode_request: 0
          });
        }
      );
    },
    validateCode: function() {
      if (!this.canValidateCode) return;
      Api.get("verifyCode", "1", {
        customerPhone: this.form.telephone,
        authCode: this.form.code
      })
        .then(data => {
          if (data.results && data.results.code == "0000") {
            return Api.auth(this.form.telephone, this.form.code);
          } else if (data.results.code == "9999") {
            MessageBox(data.results.data);
            Logger.log("CSSH5_Login_page_005", {
              page_name: "手机号查询",
              SMScode_identify: 0,
              login_result: 0
            });
          } else {
            MessageBox(data.results.msg);
          }
        })
        .then(data => {
          if (data.results.code == "0000") {
            Logger.log("CSSH5_Login_page_005", {
              page_name: "手机号查询",
              SMScode_identify: 1,
              login_result: 1
            });
            Utils.setUser({
              telephone: this.form.telephone,
              token: data.results.data
            });
            this.$router.replace({
              path: "/search/list"
            });
          } else {
            Logger.log("CSSH5_Login_page_005", {
              page_name: "手机号查询",
              SMScode_identify: 1,
              login_result: 0
            });
            MessageBox("验证失败");
          }
        })
        .catch(error => {
          Logger.log("CSSH5_Login_page_005", {
            page_name: "手机号查询",
            SMScode_identify: 0,
            login_result: 0
          });
        });
    }
  }
};
</script>

<style scoped>
.tab ul {
  display: flex;
  width: 100%;
  align-items: center;
  background: #4a4c5b;
}

.tab ul li {
  flex: 1;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  position: relative;
  height: 50px;
  line-height: 50px;
}

.tab ul li.active {
  color: #fff;
}

.tab ul li.active::after {
  content: " ";
  display: block;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #efefef;
  position: absolute;
  left: 50%;
  bottom: 0;
  margin-left: -10px;
}

.btn {
  margin-top: 20px;
}
.order-search .history {
  margin-top: 20px;
  background: #ffffff;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.17);
}
.order-search .history .title {
  padding: 10px 8px 11px 15px;
  font-size: 14px;
}
.order-search .history .title .clear {
  float: right;
  color: #999;
}
.order-search .history ul {
  padding: 0 8px;
}
.order-search .history ul li {
  padding: 12px 2px 12px 8px;
}
.order-search .history ul li:first-of-type::before {
  display: none;
}
.order-search .history ul li::after {
  right: 8px;
}

form {
  padding-left: 15px;
  background: #fff;
}

form > div {
  display: flex;
  padding: 12px 0;
  align-items: center;
}

form .label {
  width: 66px;
}

form .input-wrap {
  flex: 1;
  padding-right: 10px;
}

.code-tip {
  width: 98px;
  position: relative;
  padding-left: 13px;
  color: #ff5c24;
}

.code-tip::before {
  content: " ";
  position: absolute;
  height: 100%;
  left: 0;
  background: #ddd;
  width: 1px;
}
</style>

