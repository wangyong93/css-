<template>
  <div>
    <div class="wrap" :class="{tipShow:isShow==true}">
      <div class="container">
        <div class="condition">
          <ul class="line-after">
            <li class="after-arrow from" @click="setFrom()">
              <div class="label">
                <i class="icon"></i>
              </div>
              <div class="content">
                <p v-if="from.name">{{from.name}}</p>
                <p v-else class="fake-placeholder">请选择发件地</p>
              </div>
            </li>
            <li class="after-arrow to line-before" @click="setTo()">
              <div class="label">
                <i class="icon"></i>
              </div>
              <div class="content">
                <p v-if="to.name">{{to.name}}</p>
                <p v-else class="fake-placeholder">请选择收件地</p>
              </div>
            </li>
            <li class="after-arrow line-before" @click="showDatePicker = true">
              <div class="label">
                <span>时间</span>
              </div>
              <div class="content">{{selectedDate}}</div>
            </li>
            <li class="after-arrow line-before" @click="isPopupWeight = true">
              <div class="label">
                <span>重量</span>
              </div>
              <div class="content">{{weight}}</div>
            </li>
          </ul>
          <div class="btn">
            <mt-button type="default" @click="searchPrice()" :class="{'is-disabled': !canSearch}">查询</mt-button>
          </div>
          <p class="tip">查询结果仅供参考，具体时效运费以实际为准</p>
        </div>
        <div class="result" v-if="result.length > 0">
          <h1>查询结果</h1>
          <ul>
            <li v-for="item in result" class="line-before">
              <div class="left">
                <p>{{item.productName}}</p>
              </div>
              <div class="right">
                <p>{{item.price}}元</p>
                <p class="grey">{{item.timePromsieStandard | estimateDate}}</p>
              </div>
            </li>
          </ul>
          <div class="line-before after-arrow more" @click="isPopupDesc = true">
            运费查询其他说明
          </div>
        </div>
        <div class="serve-tab">
          <div @click="gotoScope()">
            <i class="icon"></i>收寄范围
          </div>
          <div @click="gotoStandard()">
            <i class="icon"></i>收寄标准
          </div>
        </div>
        <enter logname="CSSH5_Other_aging_010"></enter>
      </div>
    </div>
    <mt-popup v-model="showDatePicker" position="bottom">
      <div @touchmove.prevent>
        <div class="line-after toolbar">
          <div class="left">
            <mt-button @click="showDatePicker = false">取消</mt-button>
          </div>
          <div class="middle">{{tmpSelectedDate}}</div>
          <div class="right">
            <mt-button @click="setSelectedDate()">确定</mt-button>
          </div>
        </div>
        <mt-picker :slots="dateSlots" @change="setTmpDate"></mt-picker>
      </div>
    </mt-popup>
    <mt-popup v-model="isPopupWeight" position="bottom">
      <div @touchmove.prevent>
        <div class="line-after toolbar">
          <div class="left">
            <mt-button @click="isPopupWeight = false">取消</mt-button>
          </div>
          <div class="middle">{{tmpWeight}}</div>
          <div class="right">
            <mt-button @click="setWeight()">确定</mt-button>
          </div>
        </div>
        <mt-picker :slots="weightSlots" defaultIndex=0 :visibleItemCount=3 @change="setTmpWeight"></mt-picker>
      </div>
    </mt-popup>
    <mt-popup v-model="isPopupCity" position="bottom">
      <city-select @finishSelect="setAddress" :autoLoc="autoLoc"></city-select>
    </mt-popup>
    <mt-popup v-model="isPopupDesc" popup-transition="popup-fade" class="desc" @touch.prevent>
      <h1>
        运费说明
        <i class="icon-close" @click="isPopupDesc = false"></i>
      </h1>
      <div class="content">
        <p>体积重量是一种反映包裹密度的计算方式。低密度的包裹，与实际重量比较，占用的空间通常较大。计算出来的体积重量与实际重量比较，取大者作为计费重量，用以计算运费。</p>
        <h3>一、中国大陆地区内业务</h3>
        <p>1. 同城、省内及经济区域内互寄：体积重量(KG)的计算方法为：长度(CM)x宽度(CM)x高度(CM)÷12000。</p>
        <p>2. 省外非经济区域内互寄，体积重量(KG)的计算方法为：【即日/次晨/标快】长度(CM)x宽度(CM)x高度(CM)÷6000；【特惠】长度(CM)x宽度(CM)x高度(CM)÷12000。</p>
        <p>备注：经济区域为：京津冀区域、江浙沪皖区域、黑吉辽区域、川渝区域。其他服务(产 品)体积重量计算方法详情请致电大陆客户服务热线95338。</p>
        <h3>二、港澳台及国际业务</h3>
        <p>1、始发地或目的地任一方为港澳台地区或其他海外国家，体积重量(KG)的计算方法为：长度(CM)x宽度(CM)x高度(CM)÷6000；</p>
        <p>2、台湾岛内件体积重量(KG)的计算方法为：长度(CM)x宽度(CM)x高度(CM)÷12000；港澳地区及海外国家的本地件体积重量(KG)的计算方法为：长度(CM)x宽度(CM)x高度(CM)÷6000；</p>
        <p>备注：体积重量的计算方法参考各地区及当地市场惯例, 当中可能略有差异。以上涉及的具体产品范围请致电95338或与当地收派员进行咨询。</p>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import CitySelect from "../../components/city-select.vue";
import Enter from "./enter.vue";
import Api from "../../service.js";
import { Indicator, MessageBox } from "mint-ui";
import { Utils } from "../../utils.js";
import Logger from "../../logger.js";
import Store from '../../store';
//操作时间数据
function getTimeData(data) {
  if (data == "一小时内") {
    var nowDate = new Date().Format("yyyy-MM-dd hh:mm:ss");
    return nowDate;
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

var weightSlots = [
  {
    flex: 1,
    values: [
      "1kg",
      "1.5kg",
      "2kg",
      "2.5kg",
      "3kg",
      "3.5kg",
      "4kg",
      "4.5kg",
      "5kg",
      "5.5kg",
      "6kg",
      "6.5kg",
      "7kg",
      "7.5kg",
      "8kg",
      "8.5kg",
      "9kg",
      "9.5kg",
      "10kg",
      "10.5kg",
      "11kg",
      "11.5kg",
      "12kg",
      "12.5kg",
      "13kg",
      "13.5kg",
      "14kg",
      "14.5kg",
      "15kg",
      "15.5kg",
      "16kg",
      "16.5kg",
      "17kg",
      "17.5kg",
      "18kg",
      "18.5kg",
      "19kg",
      "19.5kg",
      "20kg",
      "30kg",
      "40kg",
      "50kg",
      "60kg",
      "70kg",
      "80kg",
      "90kg",
      "100kg"
    ],
    textAlign: "center",
    value: "1kg"
  }
];

var dateSlots = [
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
];

export default {
	props:{
		isShow:Boolean
	},
  components: {
    CitySelect,
    Enter
  },
  filters: {
    estimateDate: function(value) {
      if (!value) {
        return "已过最晚收件时间";
      } else {
        return value + "前到达";
      }
    }
  },
  computed: {
    canSearch: function() {
      return this.from && this.to;
    }
  },
  data: function() {
    return {
      from: "",
      to: "",
      addressType: "from",
      date: "",
      weight: "1kg",
      tmpWeight: "1kg",
      tmpSelectedDate: "",
      isPopupWeight: false,
      isPopupCity: false,
      showDatePicker: false,
      weightSlots: weightSlots,
      dateSlots: dateSlots,
      result: [],
      isPopupDesc: false,
      selectedDate: "",
      autoLoc: false
    };
  },
  mounted: function() {
    // var myurl = Utils.GetQueryString("type");
    // if (myurl != null && myurl.toString().length > 1) {
    //   alert(Utils.GetQueryString("type"));
    // }
    this.initDatePicker();
    Logger.log("CSSH5_Other_aging_001");
    this.setDefaultLocation();
    console.log(this.isShow)
  },
  watch: {
    showDatePicker: function(value) {
      if (value) {
        this.initDatePicker();
      }
    }
  },
  methods: {
    log: function(event) {
      Logger.log(event);
    },
    setFrom: function() {
      this.addressType = "from";
      this.isPopupCity = true;
    },
    setTo: function() {
      this.addressType = "to";
      this.isPopupCity = true;
    },
    setAddress: function(address) {
      if (this.addressType == "from") {
        this.from = JSON.parse(JSON.stringify(address));
        Logger.log("CSSH5_Other_aging_002");
      }
      if (this.addressType == "to") {
        this.to = JSON.parse(JSON.stringify(address));
        Logger.log("CSSH5_Other_aging_003");
      }
      this.isPopupCity = false;
    },
    setTmpWeight: function(picker, values) {
      this.tmpWeight = values[0];
    },
    setWeight: function() {
      Logger.log("CSSH5_Other_aging_005", {
        weight_status: this.weight === this.tmpWeight ? 0 : 1
      });
      this.weight = this.tmpWeight;
      this.isPopupWeight = false;
    },
    initDatePicker: function() {
      var date = new Date();
      var h = date.getHours();

      if (h >= 20) {
        this.dateSlots[0].defaultIndex = 1; // set datepicker to '明天'
      } else if (h >= 8) {
        var t1 = (h > 9 ? h : "0" + h) + ":00";
        var t2 = (h + 1 > 9 ? h + 1 : "0" + (h + 1)) + ":00";
        var slot = t1 + "~" + t2;

        this.dateSlots[1].values.forEach((e, i) => {
          if (e == slot) {
            this.dateSlots[1].defaultIndex = i;
          }
        });
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
      if (v0 === "今天") {
        if (h >= 20) {
          picker.setSlotValue(0, "明天");
        }
        if (h > v1.substring(0, 2)) {
          var t1 = (h > 9 ? h : "0" + h) + ":00";
          var t2 = (h + 1 > 9 ? h + 1 : "0" + (h + 1)) + ":00";
          picker.setSlotValue(1, t1 + "~" + t2);
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
    searchPrice: function() {
      if (!this.canSearch) {
        return;
      }
      Indicator.open();
      Api.get("freightTime", "1", {
        srcCityCode: this.from.city.deptCode,
        srcZoneCode: this.from.district.zoneCode,
        destCityCode: this.to.city.deptCode,
        destZoneCode: this.to.district.zoneCode,
        startTime: getTimeData(this.selectedDate),
        weight: this.weight.replace("kg", "")
      })
        .then(response => {
          if (response.results && response.results.code == "0000") {
            this.result = response.results.data;
            Logger.log("CSSH5_Other_aging_006", {
              agingsearch_suceess: 1
            });
          } else {
            MessageBox.alert(response.msg);
            Logger.log("CSSH5_Other_aging_006", {
              agingsearch_suceess: 0
            });
          }
          Indicator.close();
        })
        .catch(_ => {
          Indicator.close();
          Logger.log("CSSH5_Other_aging_006", {
            agingsearch_suceess: 0
          });
        });
    },

    setDefaultLocation: function() {
      // Api.getGeoPosition()
      //   .then(res => {})
      //   .catch(err => {
      //     console.log(err);
      //   });
    },

    gotoScope: function() {
      Logger.log("CSSH5_Other_aging_008");
      this.$router.push({
          path: '/serve/scope',
          query: {
              showPush: Store.state.isShowNews
          }
      });
    },

    gotoStandard: function() {
      var query = this.$route.query;

      //显示推送
      query.showPush = Store.state.isShowNews;
      Logger.log("CSSH5_Other_aging_009");
      this.$router.push({
        path: "/serve/standard",
        query: query
      });
    }
  }
};
</script>

<style scoped>
.mint-popup {
  width: 100%;
}

.wrap {
  position: absolute;
  top: 60px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  -webkit-overflow-scrolling: touch;
  overflow-y: auto;
}
.wrap.tipShow{
  top: 50px;	
}
.wrap .container {
  box-sizing: border-box;
  min-height: 100%;
  padding-bottom: 70px;
  position: relative;
}

.condition {
  background: #fff;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.17);
  border-radius: 4px;
  padding: 0 8px 18px;
}

.condition li {
  box-sizing: border-box;
  display: flex;
  padding: 10px 0;
  align-items: center;
}

.condition li:first-of-type::before {
  display: none;
}

.condition li .label {
  width: 44px;
  padding-left: 2px;
}

.condition li .label .icon {
  width: 30px;
  height: 30px;
}

.condition li .label span {
  display: inline-block;
  height: 33px;
  line-height: 33px;
  vertical-align: middle;
}

.condition .from .icon {
  background-image: url(../../assets/from.png);
}

.condition .to .icon {
  background-image: url(../../assets/to.png);
}

.condition .content {
  flex: 1;
  padding-left: 4px;
  padding-right: 14px;
}

.after-arrow::after {
  right: 8px;
}

.btn {
  margin-top: 20px;
}

.tip {
  margin-top: 15px;
}

.result {
  margin-top: 10px;
  background: #fff;
  box-shadow: 0px 2px 3px 0px rgba(0, 0, 0, 0.17);
}

.result h1 {
  height: 42px;
  line-height: 42px;
  color: #999;
  border-bottom: 1px solid #ddd;
  padding-left: 15px;
  font-size: 14px;
  font-weight: normal;
}

.result ul {
  padding: 0 8px;
}

.result li {
  display: flex;
  padding: 13px 8px 10px;
  align-items: center;
  position: relative;
}

.result li .grey {
  font-size: 14px;
  color: #999;
  margin-top: 4px;
}

.result li .left {
  width: 70px;
}

.result li .right {
  flex: 1;
  text-align: right;
}

.result li:first-of-type::before {
  display: none;
}

.result .more {
  height: 45px;
  line-height: 45px;
  padding: 0 13px;
}

.result .more::after {
  right: 13px;
}

.serve-tab {
  margin-top: 10px;
  display: flex;
  background: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.17);
  border-radius: 2px;
  padding: 12px 0;
}

.serve-tab > div {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
}

.serve-tab .icon {
  width: 23px;
  height: 23px;
  margin-right: 7px;
}

.serve-tab > div:first-of-type::after {
  position: absolute;
  width: 1px;
  content: " ";
  height: 100%;
  background: #ddd;
  right: 0;
  top: 0;
}

.serve-tab > div:first-of-type .icon {
  background-image: url("../../assets/ic-sc.png");
}

.serve-tab > div:last-of-type .icon {
  background-image: url("../../assets/ic-st.png");
}

.mint-popup.desc {
  width: 68%;
  height: 60%;
  border-radius: 6px;
  text-align: justify;
}

.mint-popup.desc h1 {
  position: relative;
  text-align: center;
  font-size: 18px;
  line-height: 40px;
}

.mint-popup.desc h1 i {
  position: absolute;
  right: 10px;
  top: 10px;
}

.mint-popup.desc .content {
  position: absolute;
  left: 10px;
  right: 10px;
  top: 40px;
  bottom: 10px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.mint-popup.desc p {
  line-height: 1.5;
  font-size: 13px;
}
.mint-popup.desc h3 {
  margin: 12px 0;
  font-size: 16px;
}
</style>
