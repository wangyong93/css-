<template>
  <div class="page">
    <route-nav content="地址管理" @back="gotoBack()"></route-nav>
    <div class="content">
      <ul>
        <li v-for="(item, index) in contactList" :key="item.id" @click="selectContact(index)">
          <p class="head">
            <span class="name">{{item.name}}</span>
            <span class="phone">{{item.telephone | divideTel}}</span>
          </p>
          <p class="address">{{item.address.name}}{{item.addressDetail}}</p>
          <div class="line-before handle">
            <div class="select">
              <span class="mint-checkbox">
                <input type="checkbox" class="mint-checkbox-input" v-model="currentSelect" :true-value="item.id">
                <span class="mint-checkbox-core"></span>
              </span>
              <span>当前地址</span>
            </div>
            <div class="modify">
              <span @click.stop="gotoEdit(index)">编辑</span>
              <span @click.stop="deleteContact(index)">删除</span>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div class="btn">
        <mt-button type="default" @click.native="gotoAdd()">新增地址</mt-button>
    </div>
  </div>
    
</template>
<script>
import RouteNav from "../../components/route-nav.vue";
import Store from "../../store.js";
import { Constants, Utils } from "../../utils.js";
import Api from "../../service.js";
import ContactService from "../../contact.js";
import { Indicator, MessageBox } from "mint-ui";
import Logger from "../../logger.js";
import LocalStore from "../../localStore.js";

export default {
  components: {
    RouteNav: RouteNav
  },
  mounted: function() {
    this.getContactList();
    Logger.log("CSSH5_Send_addrchoose_001", {
      address_type: Constants.contactTypeNum[this.type]
    });
  },
  computed: {
    type: function() {
      return this.$route.query.type;
    },

    contactList: function() {
      if (this.type == "from") {
        return Store.state.fromContactList;
      }

      if (this.type == "to") {
        return Store.state.toContactList;
      }
    },

    currentSelect: function() {
      // console.log(Store.state.toContact);
      if (this.type === "from") {
        return Store.state.fromContact.id;
      }

      if (this.type === "to") {
        return Store.state.toContact.id;
      }
    }
  },
  methods: {
    getContactList: function(type) {
      var user = Utils.getUser();
      if (!user) {
        return;
      }

      Indicator.open();
      ContactService.getAll(user.telephone, this.type,user.token)
        .then(data => {
          Store.commit("initContactList", {
            list: data,
            type: this.type
          });
          Indicator.close();
        })
        .catch(error => {
          Indicator.close();
        });
    },
    gotoEdit: function(index) {
      Logger.log("CSSH5_Send_addrchoose_003", {
        addr_no: this.contactList[index].id,
        page_type: Constants.contactTypeNum[this.type]
      });
      LocalStore.setContact(this.contactList[index]);
      this.$router.push({
        path: "/send/editContact",
        query: { type: this.type, from: "contactList" }
      });
    },

    gotoAdd: function() {
      Logger.log("CSSH5_Send_addrchoose_008", {
        page_type: Constants.contactTypeNum[this.type]
      });

      this.$router.push({
        path: "/send/addContact",
        query: { type: this.type, from: "contactList" }
      });
    },

    deleteContact: function(index) {
      var user = Utils.getUser();
      var id = this.contactList[index].id;

      Logger.log("CSSH5_Send_addrchoose_004", {
        addr_no: id,
        address_type: Constants.contactTypeNum[this.type]
      });

      if (!user) {
        return;
      }

      MessageBox.confirm("确定要删除该地址吗？", "温馨提示", {
        confirmButtonText: "删除",
        cancelButtonText: "取消"
      })
        .then(action => {
          if (action === "confirm") {
            Indicator.open();
            return Api.get("findAddress", "2",{
              customerPhone: user.telephone,
              operationFlag: "delete",
              operatorType: Constants.contactType[this.type],
              addrCode: id,
              token:user.token
            });
          } else {
            Logger.log("CSSH5_Send_addrchoose_006", {
              addr_no: id,
              address_type: Constants.contactTypeNum[this.type]
            });
          }
        })
        .then(data => {
          if (data.results && data.results.code == "0000") {
            Logger.log("CSSH5_Send_addrchoose_005", {
              addr_no: id,
              address_type: Constants.contactTypeNum[this.type],
              delete_result: 1
            });
            this.getContactList();
          } else {
            Logger.log("CSSH5_Send_addrchoose_005", {
              addr_no: id,
              address_type: Constants.contactTypeNum[this.type],
              delete_result: 0
            });
          }
          Indicator.close();
        })
        .catch(error => {
          Logger.log("CSSH5_Send_addrchoose_005", {
            addr_no: id,
            address_type: Constants.contactTypeNum[this.type],
            delete_result: 0
          });
          Indicator.close();
        });
    },

    selectContact: function(index) {
      Logger.log("CSSH5_Send_addrchoose_002", {
        addr_no: this.contactList[index].id,
        page_type: Constants.contactTypeNum[this.type]
      });
      var contact = this.contactList[index];
      if (this.type == "from") {
        Store.commit("setFromContact", contact);
      }

      if (this.type == "to") {
        Store.commit("setToContact", contact);
      }

      this.$router.replace("/send/confirm");
    },

    gotoBack: function() {
      Logger.log("CSSH5_Send_addrchoose_009", {
        page_type: Constants.contactTypeNum[this.type]
      });
      history.go(-1);
    }
  }
};
</script>

<style scoped>
li {
  background: #fff;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.17);
  border-radius: 4px;
  padding: 0 16px;
  margin-top: 10px;
}

li:first-of-type {
  margin-top: 0;
}

li .head {
  padding: 14px 0 10px;
}

li .head .name {
  margin-right: 6px;
}

li .address {
  font-size: 13px;
  color: #999;
}

li .handle {
  margin-top: 15px;
  display: flex;
  align-items: center;
  padding: 6px 0 12px;
  color: #666;
}

li .handle * {
  vertical-align: middle;
}

li .handle .modify {
  flex: 1;
  text-align: right;
}

li .handle .modify span {
  padding: 0 13px;
}
li:last-of-type{
  margin-bottom:40px;
}
.btn {
  position: fixed;
  bottom: 0px;
  left: 0px;
  right: 0px;
  margin-top: 20px;
}

.mint-checkbox {
  display: inline-block;
}
.mint-checkbox-input:checked + .mint-checkbox-core {
  background-color: #4a4c5b;
  border-color: #4a4c5b;
}
</style>

