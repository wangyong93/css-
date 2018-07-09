<template>
  <div class="page">
    <route-nav :content="navContent" @back="goBack()"></route-nav>
    <div class="content">
      <ul>
        <li>
          <div class="label">
            {{typeName}}人
          </div>
          <div class="input-wrap">
            <input type="text" v-model="contact.name" :placeholder="'请输入' + typeName + '人信息'" @focus="logBefore()" @blur="logAfter('name')" maxlength="20">
          </div>
        </li>
        <li class="line-before" v-if="phoneType==true">
          <div class="label">
            手机号
          </div>
          <div class="input-wrap">
            <input type="tel" v-model="contact.telephone" :placeholder="'请输入' + typeName + '人手机号码'" maxlength="11" @focus="logBefore()" @blur="logAfter('telephone')">
          </div>
        </li>

        <li class="line-before"  v-else>
          <div class="label">
            固定电话
          </div>
          <div class="fix-phoneinput">
            <input type="telhead" v-model="contact.telephone1" maxlength="4" @focus="logBefore()" @blur="logAfter('telephone')">
          </div> - 
          <div class="fix-phoneinputtail">
            <input type="tel1" v-model="contact.telephone2" maxlength="8" @focus="logBefore()" @blur="logAfter('telephone')">
          </div>
        </li>

        <li class="line-before after-arrow">
          <div class="label">
            {{typeName}}地址
          </div>
          <div class="input-wrap" @click="showCitySelect = true;logBefore()">
            <p v-if="contact.address.name">{{contact.address.name}}</p>
            <p v-else class="fake-placeholder">请选择省市区</p>
          </div>
        </li>
        <li class="line-before detail">
          <div class="label" style="margin-top: 3px;">
            详细地址
          </div>
          <div class="input-wrap">
            <textarea cols="30" rows="3" placeholder="镇\街道\详细地址" v-model="contact.addressDetail" @focus="logBefore()" @blur="logAfter('addressDetail')" maxlength="30"></textarea>
          </div>
        </li>
      </ul>
      <!-- <div class="save">
                <label><input type="radio">保存至地址薄</label>
            </div> -->
      <div class="btn">
        <mt-button @click="saveContact()" :class="{'is-disabled': !isValidContact}">下一步</mt-button>
      </div>
    </div>
    <mt-popup v-model="showCitySelect" position="bottom">
      <city-select :autoLoc="autoLoc" @finishSelect="setAddress"></city-select>
    </mt-popup>
  </div>
</template>

<script>
import RouteNav from "../../components/route-nav.vue";
import CitySelect from "../../components/city-select.vue";
import Store from "../../store.js";
import { Utils, Constants } from "../../utils.js";
import { Indicator } from "mint-ui";
import Api from "../../service.js";
import Logger from "../../logger.js";
import LocalStore from "../../localStore.js";

export default {
  components: {
    RouteNav: RouteNav,
    CitySelect: CitySelect
  },
  data: function() {
    return {
      contact: {
        id: "",
        name: "",
        telephone: "",
        address: "",
        addressDetail: ""
      },
      showCitySelect: false,
      lockContact: null,
      phoneType: true
    };
  },
  computed: {
    isEdit: function() {
      return this.$route.name === "editContact";
    },
    type: function() {
      return this.$route.query.type;
    },
    from: function() {
      return this.$route.query.from; // Come from where
    },
    typeName: function() {
      return this.type == "from" ? "寄件" : "收件";
    },
    navContent: function() {
      var type = this.type;
      return type == "from" ? "寄件人信息" : "收件人信息";
    },
    isValidContact: function() {
      var c = this.contact;
      return !!(
        c.name &&
        Utils.validateTelephone(c.telephone) &&
        c.address &&
        c.addressDetail
      );
    },
    autoLoc: function() {
      return this.isEdit ? false : true;
    }
  },
  mounted: function() {
    this.initContact();
    Logger.log("CSSH5_Send_addrinput_001", {
      data_preload: this.isEdit ? 1 : 0,
      page_type: Constants.contactTypeNum[this.type]
    });
  },
  methods: {
    logBefore: function() {
      this.lockContact = JSON.parse(JSON.stringify(this.contact));
    },
    logAfter: function(key) {
      var hasChange = 0;
      switch (key) {
        case "name":
          if (this.lockContact && this.lockContact.name !== this.contact.name) {
            hasChange = 1;
          }
          Logger.log("CSSH5_Send_addrinput_002", {
            info_change: hasChange,
            page_type: Constants.contactTypeNum[this.type],
            data_preload: this.isEdit ? 1 : 0
          });
          break;
        case "telephone":
          if (
            this.lockContact &&
            this.lockContact.telephone !== this.contact.telephone
          ) {
            hasChange = 1;
          }
          Logger.log("CSSH5_Send_addrinput_003", {
            info_change: hasChange,
            page_type: Constants.contactTypeNum[this.type],
            data_preload: this.isEdit ? 1 : 0
          });
          break;
        case "addressDetail":
          if (
            this.lockContact &&
            this.lockContact.addressDetail !== this.contact.addressDetail
          ) {
            hasChange = 1;
          }
          Logger.log("CSSH5_Send_addrinput_005", {
            info_change: hasChange,
            page_type: Constants.contactTypeNum[this.type],
            data_preload: this.isEdit ? 1 : 0
          });
          break;

        default:
          break;
      }
    },
    initContact: function() {
      if (!this.isEdit) {
        return;
      }

      var contact = null;
      var type = this.$route.query.type;
      contact = LocalStore.getContact();
      Utils.deepCopy(this.contact, contact);
    },
    setAddress: function(address) {
      this.showCitySelect = false;
      this.contact.address = address;
      // If 'lockContact' is null, so it's called by auto Geolocation
      // Not logger
      if (!this.lockContact) {
        return;
      }
      var hasChange = address.name !== this.lockContact.address.name ? 1 : 0;
      Logger.log("CSSH5_Send_addrinput_004", {
        info_change: hasChange,
        page_type: Constants.contactTypeNum[this.type],
        data_preload: this.isEdit ? 1 : 0
      });
    },

    saveContact: function() {
      if (!this.isValidContact) {
        return;
      }

      if (this.from === "contactList") {
        this.gotoContactList();
      } else {
        this.gotoConfirm();
      }
    },
    gotoContactList: function() {
      var operate = {
        addContact: "insert",
        editContact: "update"
      }[this.$route.name];

      var user = Utils.getUser();
      if (!user) {
        return;
      }
      Indicator.open();
      Api.get("findAddress", "1", {
        customerPhone: user.telephone,
        operationFlag: operate,
        operatorType: Constants.contactType[this.type],
        token:user.token,
        addrCode: this.contact.id || "",
        userName: this.contact.name,
        userPhone: this.contact.telephone,
        province: this.contact.address.province,
        city: this.contact.address.city.name,
        county: this.contact.address.district.name,
        addressDetail: this.contact.addressDetail,
        origin: this.contact.address.city.deptCode
      })
        .then(data => {
          Indicator.close();
          Logger.log("CSSH5_Send_addrinput_007", {
            addr_no: this.contact.id,
            page_type: Constants.contactTypeNum[this.type],
            save_result: 1
          });
          this.$router.replace({
            path: "/send/contactList",
            query: { type: this.type }
          });
        })
        .catch(error => {
          Logger.log("CSSH5_Send_addrinput_007", {
            addr_no: this.contact.id,
            page_type: Constants.contactTypeNum[this.type],
            save_result: 0
          });
          Indicator.close();
        });
    },
    gotoConfirm: function() {
      if (this.type === "from") {
        Store.commit("setFromContact", this.contact);
      } else {
        Store.commit("setToContact", this.contact);
      }
      this.$router.replace("/send/confirm");
    },
    goBack: function() {
      Logger.log("CSSH5_Send_addrinput_008", {
        page_type: Constants.contactTypeNum[this.type]
      });
      history.go(-1);
    }
  }
};
</script>

<style scoped>
.mint-popup {
  width: 100%;
}
.btn {
  margin-top: 14px;
}

ul {
  background: #fff;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.17);
  border-radius: 4px;
  padding: 0 8px;
}

li {
  display: flex;
  align-items: center;
  padding: 12px 0 10px 8px;
}

li .label {
  width: 80px;
  line-height: 1.6;
}

li .input-wrap {
  flex: 1;
  padding-right: 30px;
}

li .input-wrap > p {
  line-height: 1.6;
}

li .input-wrap input,
li .input-wrap textarea {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0;
  border: 0;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  outline: 0;
  line-height: 1.6;
  font-size: inherit;
  width: 100%;
  padding: 0;
  background: none;
}

li.detail {
  align-items: flex-start;
}

.after-arrow::after {
  right: 4px;
}

.save {
  margin-top: 13px;
  color: #666;
}
li .fix-phoneinput {
  margin-right:10px;
}
.fix-phoneinputtail {
  margin-left:10px;
}
li .fix-phoneinput input{
  width:50px;
}
.teltail {
 
}
</style>

