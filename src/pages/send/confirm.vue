<template>
  <div class="page">
    <route-nav content="预约寄件确认" @back="gotoBack()"></route-nav>
    <div class="content">
      <contact :from="from" :to="to" :from-action="fromAction" :to-action="toAction"></contact>
      <ul>
        <li class="after-arrow">
          <div class="label">上门时间</div>
          <div class="input-wrap" @click="showDatePicker = true">
            {{selectedDate}}
          </div>
        </li>
        <li class="line-before after-arrow">
          <div class="label">
            快件重量
          </div>
          <div class="input-wrap" @click="showWeightPicker = true">
            {{selectedWeight}}
          </div>
        </li>
        <li class="line-before remark">
          <div class="label" style="margin-top: 6px;">备注</div>
          <div class="input-wrap">
            <ul class="remarks" ref="remarks">
              <li v-for="r in remarks" :key="r.text" :class="{selected: r.selected}" @click="r.selected = !r.selected;log(r.i)">{{r.text}}</li>
            </ul>
          </div>
        </li>
        <li class="line-before remark" v-if="showOtherRemark">
          <div class="label" style="line-height: 1.6;margin-top: 3px;">其他</div>
          <div class="input-wrap">
            <textarea rows="2" v-model="otherRemark" placeholder="请填写备注信息，限20个字符" maxlength="20" @blur="logOther()"></textarea>
          </div>
        </li>
      </ul>
      <div class="acc">
        <label class="mint-checklist-label acc">
          <span class="mint-checkbox">
            <input type="checkbox" class="mint-checkbox-input" v-model="isAgree" @change="logAgree()">
            <span class="mint-checkbox-core"></span>
          </span>
          <span class="mint-checkbox-label">我已同意
            <router-link to="/send/agreement">《快件运单契约条款》</router-link>
          </span>
        </label>
      </div>

      <div class="btn">
        <mt-button @click="submitOrder()" :class="{'is-disabled': !canSubmitOrder}">确认无误，下单</mt-button>
      </div>
    </div>
    <mt-popup v-model="showDatePicker" position="bottom">
      <div @touchmove.prevent>
        <div class="line-after toolbar">
          <div class="middle" style="padding-left:60px;">{{tmpSelectedDate}}</div>
          <mt-button @click="setSelectedDate()">确定</mt-button>
        </div>
        <mt-picker :slots="dateSlots" @change="setTmpDate" ref='picker'></mt-picker>
      </div>
    </mt-popup>
    <mt-popup v-model="showWeightPicker" position="bottom">
      <div @touchmove.prevent>
        <div class="line-after toolbar">
          <div class="middle" style="padding-left:60px;">{{tmpSelectedWeight}}</div>
          <mt-button @click="setSelectedWeight()">确定</mt-button>
        </div>
        <mt-picker :slots="weightSlots" @change="setTmpWeight"></mt-picker>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import RouteNav from "../../components/route-nav.vue";
import Contact from "../../components/contact.vue";
import Store from "../../store.js";
import Api from "../../service.js";
import { Toast, MessageBox, Indicator } from "mint-ui";
import { Utils } from "../../utils.js";
import Logger from "../../logger.js";
import LocalStore from "../../localStore.js";

//操作时间数据
function getTimeData(data) {
  if (data == "今天 一小时内") {
    var nowDate = new Date();
    var yy = nowDate.getFullYear();
    var mm = nowDate.getMonth() + 1; //获取当前月份的日期
    var dd = nowDate.getDate();
    var hh = nowDate.getHours();
    var mn = nowDate.getMinutes();
    var ss = nowDate.getSeconds();
    mm = mm > 9 ? mm : "0" + mm;
    dd = dd > 9 ? dd : "0" + dd;
    hh = hh > 9 ? hh : "0" + hh;
    mn = mn > 9 ? mn : "0" + mn;
    ss = ss > 9 ? ss : "0" + ss;
    var nowTime = yy + "-" + mm + "-" + dd + " " + hh + ":" + mn + ":" + ss;
    return nowTime;
  }
  var dataValue = data.split(" ");
  var date = dataValue[0];
  var hourMinuteSecond = dataValue[1].split("~")[0];

  if (date == "今天") {
    return GetDateStr(0) + " " + hourMinuteSecond + ":00";
  } else if (date == "明天") {
    return GetDateStr(1) + " " + hourMinuteSecond + ":00";
  } else if (date == "后天") {
    return GetDateStr(2) + " " + hourMinuteSecond + ":00";
  }
}

function GetDateStr(AddDayCount) {
  var dd = new Date();
  dd.setDate(dd.getDate() + AddDayCount); //获取AddDayCount天后的日期
  var y = dd.getFullYear();
  var m = dd.getMonth() + 1; //获取当前月份的日期
  var d = dd.getDate();
  return y + "-" + (m > 9 ? m : "0" + m) + "-" + (d > 9 ? d : "0" + d);
}

export default {
  components: {
    RouteNav: RouteNav,
    Contact: Contact
  },

  computed: {
    from: function() {
      return Store.state.fromContact;
    },
    to: function() {
      return Store.state.toContact;
    },
    selectedRemarks: function() {
      var temp = [];
      this.remarks.forEach(element => {
        if (element.selected && !element.spec) {
          temp.push(element.text);
        } else if (element.spec && this.otherRemark.lenth > 0) {
          temp.push(this.otherRemark);
        }
      });

      return temp.join();
    },
    showOtherRemark: function() {
      var b = false;
      this.remarks.forEach(e => {
        if (e.spec && e.selected) {
          b = true;
        }
      });
      return b;
    },
    canSubmitOrder: function() {
      return this.from.name && this.isAgree;
    }
  },
  data: function() {
    return {
      showDatePicker: false,
      showWeightPicker: false,
      dateSlots: [
        {
          flex: 1,
          values: ["今天", "明天", "后天"],
          defaultIndex: 0,
          value: "今天",
          className: "slot1",
          textAlign: "center"
        },
        {
          flex: 1,
          values: [
            "08:00~09:00",
            "09:00~10:00",
            "10:00~11:00",
            "11:00~12:00",
            "12:00~13:00",
            "13:00~14:00",
            "14:00~15:00",
            "15:00~16:00",
            "16:00~17:00",
            "17:00~18:00",
            "18:00~19:00",
            "19:00~20:00",
            "20:00~21:00"
          ],
          defaultIndex: 0,
          value: "08:00~09:00",
          className: "slot1",
          textAlign: "center"
        }
      ],
      copydatevalues: [
        "08:00~09:00",
        "09:00~10:00",
        "10:00~11:00",
        "11:00~12:00",
        "12:00~13:00",
        "13:00~14:00",
        "14:00~15:00",
        "15:00~16:00",
        "16:00~17:00",
        "17:00~18:00",
        "18:00~19:00",
        "19:00~20:00",
        "20:00~21:00"
      ],
      copydatevalues2: [],
      selectedDate: "",
      lockDate: "",
      tmpSelectedDate: "",
      tmpDate: "一小时内",
      tmpDate2: "",
      weightSlots: [
        {
          flex: 1,
          values: ["0-1kg", "1-2kg", "2-5kg", "5-10kg", "10-20kg", "20kg以上"],
          defaultIndex: 0,
          value: "0-1kg",
          className: "slot1",
          textAlign: "center"
        }
      ],
      selectedWeight: "0-1kg",
      lockWeight: "0-1kg",
      tmpSelectedWeight: "",
      remarks: [
        { text: "上门前联系", selected: false, i: 2 },
        { text: "爬楼梯", selected: false, i: 1 },
        { text: "带纸箱", selected: false, i: 3 },
        { text: "缺包装袋", selected: false, i: 5 },
        { text: "缺文件封", selected: false, i: 4 },
        { text: "其它", selected: false, spec: true }
      ],
      otherRemark: "",
      isAgree: true
    };
  },
  watch: {
    showDatePicker: function(value) {
      if (value) {
        this.initDatePicker();
      }
    }
  },
  mounted: function() {
    this.initDatePicker();

    var pageType = 1;
    if (this.from && this.from.name && this.to && this.to.name) {
      pageType = 2;
    }
    Logger.log("CSSH5_Send_comfirm_001", {
      page_type: pageType
    });
    this.$nextTick(_ => {
      this.setRemarkStyle();
    });
  },
  methods: {
    log: function(index) {
      Logger.log("CSSH5_Send_comfirm_006", {
        fastnote_choose: index
      });
    },
    logOther: function() {
      Logger.log("CSSH5_Send_comfirm_007");
    },
    logAgree: function() {
      Logger.log("CSSH5_Send_comfirm_008", {
        agree_accept: this.isAgree ? 1 : 0
      });
    },
    setRemarkStyle: function() {
      var w = this.$refs.remarks.offsetWidth;
      var n = Math.floor(w / 78); // li base width
      // At least has 2 li
      if (n < 2) {
        return;
      }
      var lw = (w - 7 * (n - 1)) / n;
      // li min-width
      if (lw < 70) {
        n = n - 1;
        lw = (w - 7 * (n - 1)) / n;
      }
      var lis = this.$refs.remarks.children;
      for (var i = 0; i < lis.length; i++) {
        lis[i].style.width = lw + "px";
        if ((i + 1) % n === 0) {
          lis[i].style.marginRight = "0px";
        }
      }
    },

    fromAction: function() {
      Logger.log("CSSH5_Send_comfirm_002", {
        addr_exist: this.from && this.from.name ? 1 : 0
      });
      if (Store.state.fromContactList.length > 0) {
        this.$router.push({
          path: "/send/contactList",
          query: { type: "from" }
        });
      } else {
        var path = "addContact";
        if (this.from && this.from.name) {
          path = "editContact";
        }
        LocalStore.setContact(Store.state.fromContact);
        this.$router.push({
          path: "/send/" + path,
          query: {
            type: "from"
          }
        });
      }
    },

    toAction: function() {
      Logger.log("CSSH5_Send_comfirm_003", {
        addr_exist: this.to && this.to.name ? 1 : 0
      });
      if (Store.state.toContactList.length > 0) {
        this.$router.push({ path: "/send/contactList", query: { type: "to" } });
      } else {
        var path = "addContact";
        if (this.to && this.to.name) {
          path = "editContact";
        }
        LocalStore.setContact(Store.state.toContact);
        this.$router.push({
          path: "/send/" + path,
          query: { type: "to" }
        });
      }
    },

    initDatePicker: function() {
      var date = new Date();
      var h = date.getHours();
      var picker = this.$refs.picker;
      var slot = "";
      if (h >= 8) {
        var t1 = (h > 9 ? h : "0" + h) + ":00";
        var t2 = (h + 1 > 9 ? h + 1 : "0" + (h + 1)) + ":00";
        slot = t1 + "~" + t2;
        if (h >= 20) {
          this.dateSlots[0].defaultIndex = 1; // set datepicker to '明天'
          this.dateSlots[1].values = this.copydatevalues;
          picker.setSlotValue(1, "08:00~09:00");
        } else {
          this.dateSlots[1].values.forEach((e, i) => {
            if (e == slot) {
              this.dateSlots[1].defaultIndex = i;
            }
          });
        }
      }
      // Set default date
      if (this.dateSlots[0].defaultIndex == 0) {
        picker.setSlotValue(1, "一小时内");
      }
      this.selectedDate =
        this.dateSlots[0].values[this.dateSlots[0].defaultIndex] +
        " " +
        this.dateSlots[1].values[this.dateSlots[1].defaultIndex];
      this.lockDate = this.selectedDate;
    },
    setTmpDate: function(picker, values) {
      var date = new Date();
      var h = date.getHours();
      var v0 = values[0];
      var v1 = values[1];
      var start = "";
      var dateSlotsBack = [];
      if (v0 === "今天") {
        this.tmpDate = v1;
        if (this.tmpDate === this.tmpDate2) {
          dateSlotsBack = this.dateSlots[1].values.slice(
            0,
            this.dateSlots[1].values.length
          );
          this.dateSlots[1].values = dateSlotsBack;
          picker.setSlotValue(1, "一小时内");
          this.tmpDate = "一小时内";
          this.tmpDate2 = "08:00~09:00";
        }
        if (h >= 20) {
          picker.setSlotValue(0, "明天");
          picker.setSlotValue(1, "08:00~09:00");
        }
        if (h > v1.substring(0, 2)) {
          var t1 = (h > 9 ? h : "0" + h) + ":00";
          var t2 = (h + 1 > 9 ? h + 1 : "0" + (h + 1)) + ":00";
          // picker.setSlotValue(1, t1 + "~" + t2);
          var slot = t1 + "~" + t2;
          this.dateSlots[1].values.forEach((e, i) => {
            if (e == slot) {
              start = i;
            }
          });
          dateSlotsBack = this.dateSlots[1].values.slice(
            start + 1,
            this.dateSlots[1].values.length
          );
          this.dateSlots[1].values = ["一小时内"].concat(dateSlotsBack);
          picker.setSlotValue(1, "一小时内");
        }
      } else {
        this.tmpDate2 = v1;
        this.dateSlots[1].values = this.copydatevalues;
        this.dateSlots[1].defaultIndex = 1;
        this.dateSlots[1].value = "08:00~09:00";
        if (this.tmpDate === this.tmpDate2) {
          picker.setSlotValue(1, "08:00~09:00");
          this.tmpDate = "一小时内";
        }
      }

      this.tmpSelectedDate = values[0] + " " + values[1];
    },
    setSelectedDate: function() {
      Logger.log("CSSH5_Send_comfirm_004", {
        booktime_change: this.selectedDate === this.tmpSelectedDate ? 0 : 1,
        booktime_status: this.lockDate === this.tmpSelectedDate ? 0 : 1
      });
      this.selectedDate = this.tmpSelectedDate;
      this.showDatePicker = false;
    },

    setTmpWeight: function(picker, values) {
      this.tmpSelectedWeight = values[0];
    },

    setSelectedWeight: function() {
      Logger.log("CSSH5_Send_comfirm_005", {
        booktime_change: this.selectedWeight === this.tmpSelectedWeight ? 0 : 1,
        booktime_status: this.lockWeight === this.tmpSelectedWeight ? 0 : 1
      });
      this.selectedWeight = this.tmpSelectedWeight;
      this.showWeightPicker = false;
    },

    makeOrder: function() {
      var from = this.from;
      var to = this.to;
      return {
        customerName: from.name,
        customerPhone: from.telephone,
        province: from.address.province,
        city: from.address.city.name,
        county: from.address.district.name,
        addressDetail: from.addressDetail,
        origin: from.address.city.deptCode,
        pickupTime: getTimeData(this.selectedDate),
        recipientName: to.name,
        recipientPhone: to.telephone,
        receiveProvince: to.address.province,
        receiveCity: to.address.city.name,
        receiveCounty: to.address.district.name,
        receiveAddressDetail: to.addressDetail,
        destination: to.address.city.deptCode,
        supportValue: "",
        remark: this.selectedRemarks,
        weight: Utils.getMaxWeight(this.selectedWeight)
      };
    },

    submitOrder: function() {
      Logger.log("CSSH5_Send_comfirm_009", {
        sendaddr_status: this.from && this.from.name ? 1 : 0,
        reciaddr_status: this.to && this.to.name ? 1 : 0,
        booktime_status: !!this.selectedDate ? 1 : 0,
        weight_status: !!this.selectedWeight ? 1 : 0,
        note_status: !!this.selectedRemarks ? 1 : 0
      });
      var self = this;
      if (!this.canSubmitOrder) {
        return;
      }

      var user = Utils.getUser();
      if (user && user.telephone && user.token) {
        this.saveOrder();
      } else {
        this.$login(function(telephone) {
          self.saveOrder();
        });
      }
    },

    saveOrder: function() {
      var params = this.makeOrder();
      var telephone = Utils.getUser().telephone;
      var token = Utils.getUser().token;

      Indicator.open();
      Api.getUserType(telephone , token)
        .then(userType => {
          params.sessionPhone = telephone;
          params.token = token;
          return Api.get("makeOrder", userType, params);
        })
        .then(data => {
          Indicator.close();
          if (data.results && data.results.code == "0000") {
            this.$router.replace({
              path: "/send/success",
              query: {
                orderNo: data.results.data,
                pickDate: this.selectedDate,
                createDate: Utils.parseDate(),
                weight: this.selectedWeight
              }
            });
          } else if (data.results && data.results.code == "1006") {
            Utils.clearUser();
            this.submitOrder();
          } else {
            Toast({
              message: data.results.msg,
              position: "middle",
              duration: 2000
            });
          }
        })
        .catch(error => {
          Indicator.close();
          Indicator({
            message: error,
            position: "middle",
            duration: 2000
          });
        });
    },

    gotoBack: function() {
      Logger.log("CSSH5_Send_comfirm_010");
      history.go(-1);
    }
  }
};
</script>

<style scoped>
.content {
  padding-bottom: 30px;
}
.mint-popup {
  width: 100%;
}
.btn {
  margin-top: 16px;
}

textarea {
  padding: 0;
}

ul {
  background: #fff;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.17);
  border-radius: 4px;
  padding: 0 8px;
  margin-top: 10px;
}

ul:first-of-type {
  margin-top: 0;
}

li {
  display: flex;
  align-items: center;
  padding: 12px 0 10px 8px;
}

li .label {
  width: 80px;
}

li .input-wrap {
  flex: 1;
  padding-right: 30px;
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
}

li.remark ul {
  border: none;
  box-shadow: none;
  margin: 0;
  padding: 0;
  text-align: justify;
}

li.remark ul li {
  display: inline-block;
  border-radius: 3px;
  color: #666;
  border: 1px solid #979797;
  width: 80px;
  box-sizing: border-box;
  text-align: center;
  font-size: 12px;
  margin-bottom: 5px;
  padding: 6px 0;
  margin-right: 7px;
}

li.remark ul li.selected {
  background: #4a4c5b;
  color: #fff;
  border-color: #4a4c5b;
}

li.remark {
  align-items: flex-start;
}

li.remark .input-wrap {
  padding-right: 0;
}

.after-arrow::after {
  right: 5px;
}

.acc {
  margin-top: 20px;
  text-align: center;
  color: #bbb;
  font-size: 14px;
}
.acc a {
  color: red;
  text-decoration: none;
}
.mint-checkbox-input:checked + .mint-checkbox-core {
  background-color: #4a4c5b;
  border-color: #4a4c5b;
}
</style>
