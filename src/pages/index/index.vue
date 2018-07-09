<template>
  <div class="page">
    <div class="tab-nav">
      <div class="protrait" @click="toggleLogin();log('CSSH5_Navigation_001')" :class="{dark: isLogin}">
        <i class="icon"></i>
      </div>
      <route-nav :content="oprationName" v-if="showRouteNav==true"></route-nav>
      <ul class="tab" v-else>
        <li @click="switchTab(0);log('CSSH5_Navigation_003');logEnter()" :class="{active: tabIndex === 0}">寄快递</li>
        <li @click="switchTab(1);log('CSSH5_Navigation_004')" :class="{active: tabIndex === 1}">查快递</li>
        <li @click="switchTab(2);log('CSSH5_Navigation_005')" :class="{active: tabIndex === 2}">查服务</li>
      </ul>
      <div class="space"></div>
    </div>
    <div class="searchTips" v-if='tabIndex === 2 && tipShow'>
	  	<span class="context">
	  		若包裹体积较大，可关注微信公众号通过体积查询更准确
	  	</span>
	  	<i class='ic_close' @click='closeTips()'></i>
		</div>
    <div class="tab-content">
      <div v-if="tabIndex === 0" class="send-index">
        <contact :from-action="fromAction" :from="fromContact" :to-action="toAction" :class="{'to-disable': toDisable}"></contact>
        <div class="btn">
          <mt-button type="default" @click.native="quickEnter()" :class="{'is-disabled': disabledBtn}">快速下单</mt-button>
        </div>
        <p class="tip">提供您的寄件信息，即可预订快递员上门为您取件</p>
      </div>
      <div v-if="tabIndex === 1">
        <search-index></search-index>
      </div>
      <div v-if="tabIndex === 2">
        <price-index :isShow='tipShow'></price-index>
      </div>
    </div>
      <footer-push v-if="showNews" @click="$_closeFooterPush"></footer-push>
  </div>
</template>

<script>
import Contact from "../../components/contact.vue";
import Api from "../../service.js";
import Store from "../../store.js";
import { Utils } from "../../utils.js";
import { MessageBox, Indicator } from "mint-ui";
import ContactService from "../../contact.js";
import Logger from "../../logger.js";
import RouteNav from "../../components/route-nav.vue";
import pushMixins from '../common/index';
import FooterPush from '../common/footer-push.vue';
export default {
  mixins: [pushMixins],
  components: {
    PriceIndex: function(resolve) {
      require(["../price/index.vue"], resolve); // split code
    },
    SearchIndex: function(resolve) {
      require(["../search/index.vue"], resolve); // split code
    },
    Contact: Contact,
    RouteNav: RouteNav,
      FooterPush
  },
  computed: {
    fromContact: function() {
      return Store.state.fromContactList[0] || null;
    },
    toDisable: function() {
      return !this.fromContact;
    },
    disabledBtn: function() {
      return this.isLogin && !this.fromContact;
    }
  },
  mounted: function() {
    // Set default active tab
    this.initActiveTab();
    // Get contact list
    if (this.tabIndex == 0) {
      this.getContactList().then(_ => {
        this.logEnter();
      });
    }
    // Set login flag
    if (Utils.getUser()) {
      this.isLogin = true;
    }

    // Keep toContact alawys be empty
    Store.commit("setToContact", null);


    //链接参数判断，如果存在RouteType则改变ui，否则没变化
    if (this.$route.query.RouteType && this.$route.query.RouteType == 2) {
      this.showRouteNav = true;
    } else {
      this.showRouteNav = false;
    }
    
  },
  data() {
    return {
      tabIndex: 0,
      isLogin: false,
      showRouteNav: false,
      oprationName: "寄快递",
      tipShow:true
    };
  },
  watch: {
    tabIndex: function(value) {
      if (value === 0) {
        this.getContactList();
      }
      this.oprationName = {
        0: "寄快递",
        1: "查快递",
        2: "运费时效"
      }[value];
    }
  },
  methods: {
  	closeTips:function(){
	  	this.tipShow=false;
	  },  	
    logEnter: function() {
      Logger.log("CSSH5_Send_home_001", {
        addr_info: Store.state.fromContactList.length > 0 ? 1 : 0
      });
    },
    log: function(event, message) {
      Logger.log(event, message);
    },
    initActiveTab: function() {
      var activeTab = Number(this.$route.query.activeTab);
      if (activeTab in [0, 1, 2]) {
        this.tabIndex = activeTab;
      }
    },
    toggleLogin: function() {
      var user = Utils.getUser();
      if (user) {
        var tel =
          user.telephone.substring(0, 3) +
          " " +
          Utils.divideString(user.telephone.substring(3), 4, " ");
        MessageBox.confirm(tel, "确定要退出该账号登录吗？", {
          confirmButtonText: "退出",
          cancelButtonText: "取消"
        }).then(
          action => {
            Utils.clearUser();
            this.isLogin = false;
            this.clearContactList();
            Logger.log("CSSH5_CSSH5_Navigation_002");
          },
          cancel => {}
        );
      } else {
        this.$login(
          telephone => {
            this.isLogin = true;
            this.getContactList();
          },
          failure => {},
          {
            tip: "请验证手机号将为您提供更加便捷的寄件查件服务"
          }
        );
      }
    },
    switchTab: function(index) {
      this.tabIndex = index;
      var query = this.$route.query || {};
      query = JSON.parse(JSON.stringify(query));
      query.activeTab = index;
      this.$router.replace({ query: query });
    },
    quickEnter: function() {
      Logger.log("CSSH5_Send_home_004", {
        addr_info: this.fromContact ? 1 : 0
      });
      if (!this.isLogin) {
        this.toggleLogin();
        return;
      }

      if (this.fromContact) {
        Store.commit("setFromContact", this.fromContact);
        this.$router.push("/send/confirm");
      }
    },

    clearContactList: function() {
      Store.commit("initContactList", {
        list: [],
        type: "from"
      });
      Store.commit("initContactList", {
        list: [],
        type: "to"
      });
    },

    getContactList: function() {
      return new Promise((resolve, reject) => {
        var user = Utils.getUser();
        if (!user) {
          resolve();
          return;
        }
        Indicator.open();
        var loading = 0;
        ContactService.getAll(user.telephone, "from",user.token)
          .then(data => {
            Store.commit("initContactList", {
              list: data,
              type: "from"
            });

            loading = loading | 1;
            if (loading == 3) {
              Indicator.close();
              resolve();
            }
          })
          .catch(error => {
            Indicator.close();
            resolve();
          });

        ContactService.getAll(user.telephone, "to",user.token)
          .then(data => {
            Store.commit("initContactList", {
              list: data,
              type: "to"
            });
            loading = loading | 2;
            if (loading == 3) {
              Indicator.close();
              resolve();
            }
          })
          .catch(error => {
            Indicator.close();
            resolve();
          });
      });
    },
    fromAction: function() {
      Logger.log("CSSH5_Send_home_002", {
        addr_info: Store.state.fromContactList.length > 0 ? 1 : 0
      });
      if (Store.state.fromContactList.length > 0) {
        Store.commit(
          "setFromContact",
          JSON.parse(JSON.stringify(this.fromContact))
        );
        this.$router.push({
          path: "/send/contactList",
          query: { type: "from" }
        });
      } else {
        this.$router.push({
          path: "/send/addContact",
          query: { type: "from" }
        });
      }
    },
    toAction: function() {
      Logger.log("CSSH5_Send_home_003", {
        addr_info: Store.state.toContactList.length > 0 ? 1 : 0
      });
      if (this.toDisable) {
        return;
      }
      Store.commit(
        "setFromContact",
        JSON.parse(JSON.stringify(this.fromContact))
      );
      if (Store.state.toContactList.length > 0) {
        this.$router.push({
          path: "/send/contactList",
          query: { type: "to" }
        });
      } else {
        this.$router.push({
          path: "/send/addContact",
          query: {
            type: "to"
          }
        });
      }
    }
  }
};
</script>
<style>
.send-index .cmpt-contact.to-disable li.to .icon {
  background-image: url("../../assets/to-grey.png");
}
</style>

<style scoped>
.protrait {
  text-align: center;
}
.protrait .icon {
  width: 15px;
  height: 15px;
  background-image: url("../../assets/user.png");
}

.protrait.dark .icon {
  background-image: url("../../assets/user-dark.png");
}

.tab-nav {
  display: flex;
  height: 50px;
  background: #fff;
  box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.29);
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.tab-nav .protrait,
.tab-nav .space {
  width: 48px;
}

.tab-nav .tab {
  display: flex;
  flex: 1;
  text-align: center;
  color: #666;
}

.tab-nav .tab li {
  flex: 1;
}

.tab-nav .tab li.active {
  color: #ff5c24;
}

.tab-content {
  padding: 60px 10px 10px 10px;
}

.btn {
  margin-top: 25px;
}

.tip {
  margin-top: 10px;
}
.searchTips{
	margin-top: 50px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: 40px;
	background: #FFF3DE;
	line-height: 40px;
	padding-left:8px;
	box-sizing: border-box;
	z-index: 101;
}
.context{
	font-family: PingFangSC-Regular;
	font-size: 12px;
	color: #FF8B16;
	letter-spacing: 0;
}
.ic_close{
	transform: scale(0.5);
	display: block;
	width: 50px;
	height: 50px;
	border-radius: 6px;
  background: url(../../assets/ic_close.svg) center no-repeat;
}
@media screen and (max-width: 325px) {
	.context{
		font-size: 10px;
	}
}
</style>
