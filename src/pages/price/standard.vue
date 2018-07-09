<template>
    <div class="page" ref="page">
        <route-nav content="收寄标准" @back="goback"></route-nav>
        <div class="content" v-infinite-scroll="getStandards" infinite-scroll-distance="50">
            <div class="container">
                <div class="condition">
                    <ul>
                        <li class="list after-arrow" @click="showTypesPicker = true;log('CSSH5_Other_goods_002')">
                            <div class="label">寄递流向</div>
                            <div class="input-wrap">
                                {{currentType.text}}
                            </div>
                        </li>
                        <li class="list after-arrow line-before" v-if='currentType.text=="进出口（含港/澳/台）"' @click='showsrcCountry=true'>
                            <div class="label">始发地</div>
                            <div class="input-wrap">
                                {{currentType.srcCountry}}
                            </div>
                        </li>
                         <li class="list after-arrow line-before" v-if='currentType.text=="进出口（含港/澳/台）"' @click='showdesCountry=true'>
                            <div class="label">目的地</div>
                            <div class="input-wrap">
                                {{currentType.desCountry}}
                            </div>
                        </li>
                        <li class="list line-before">
                            <div class="label">
                                物品类型
                            </div>
                            <div class="input-wrap">
                                <input type="text" placeholder="请输入物品类型" maxlength="20" v-model="key" @blur="log('CSSH5_Other_goods_003')">
                            </div>
                        </li>
                    </ul>
                    <div class="line-before btn-wrap">
                        <div class="btn">
                            <mt-button @click="search()" :class="{'is-disabled': !key}">查询</mt-button>
                        </div>
                    </div>
                    <p class="tip">查询结果仅供参考</p>
                </div>
                <div class="result" id="results" v-if="items.length > 0"  >
                    <p class="line-after title">
                        查询结果
                    </p>
                    <div class="tables"  v-if='this.currentType.value !=5 '>
                        <div class="head">
                            <table width="100%">
                                <tr>
                                    <th width="35%">物品</th>
                                    <th width="20%">陆运</th>
                                    <th width="20%">航空</th>
                                    <th with="25%">客户须知</th>
                                </tr>
                            </table>
                        </div>
                        <div class="body">
                            <table width="100%" v-for="(item,index) in items">
                                <tr :class="{expanded: item.expand}">
                                    <td width="35%">
                                        <p class="cate">{{item.goodsName}}</p>
                                        <p class="spec">{{item.goodsType}}</p>
                                    </td>
                                    <td width="20%" :class="{red: item.landTransport === '不可收寄'}">
                                        {{item.landTransport}}
                                    </td>
                                    <td width="20%" :class="{red: item.flightTransport === '不可收寄'}">
                                        {{item.flightTransport}}
                                    </td>
                                    <td v-if="item.remark" with="25%" @click="toggleDetail(index)">
                                        <div class="more" :class="{active: item.expand}">
                                            查看详情
                                        </div>
                                    </td>
                                    <td v-else style="text-align: center;">
                                        --
                                    </td>
                                </tr>
                                <tr v-show="item.expand">
                                    <td colspan="4">{{item.remark}}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="tables"  v-else>
                        <div class="head">
                            <table width="100%">
                                <tr>
                                    <th width="45%">托寄物</th>
                                    <th width="25%">收寄要求</th>
                                    <th with="30%">客户须知</th>
                                </tr>
                            </table>
                        </div>
                        <div class="body">
                            <table width="100%" v-for="(item,index) in items">
                                <tr :class="{expanded: item.expand}">
                                    <td width="45%">
                                        <p class="cate">{{item.goodsName}}</p>
                                        <p class="spec">{{item.goodsBigType}}</p>
                                    </td>
                                    <td width="25%" v-if='item.receiptType == 3'>
                                        限制收寄
                                    </td>
                                     <td width="25%" :class="{red: item.receiptType == 2}" v-if='item.receiptType == 2'>
                                        禁止收寄
                                    </td>
                                    <td v-if="item.remark" with="30%" @click="toggleDetail(index)">
                                        <div class="more" :class="{active: item.expand}">
                                            查看详情
                                        </div>
                                    </td>
                                    <td v-else style="text-align: center;">
                                        --
                                    </td>
                                </tr>
                                <tr v-show="item.expand">
                                    <td colspan="4">{{item.remark}}</td>
                                </tr>
                            </table>
                        </div>
                    </div>
                </div>
                <enter logname="CSSH5_Other_goods_005"></enter>
            </div>
        </div>
        <mt-popup v-model="showTypesPicker" position="bottom" @touch.prevent>
            <div class="toolbar line-after">
                <div class="left">
                    <mt-button @click="showTypesPicker = false">取消</mt-button>
                </div>
                <div class="middle">{{tempType.text}}</div>
                <div class="right">
                    <mt-button @click.native="setCurrentType()">确定</mt-button>
                </div>
            </div>
            <mt-picker :slots="slots" value-key="text" @change="onValuesChange"></mt-picker>
        </mt-popup>
        <mt-popup v-model="showsrcCountry" position="bottom" @touch.prevent>
            <div class="toolbar line-after">
                <div class="left">
                    <mt-button @click="showsrcCountry = false">取消</mt-button>
                </div>
                <div class="middle">{{tempType.srcCountry}}</div>
                <div class="right">
                    <mt-button @click.native="setCurrentType()">确定</mt-button>
                </div>
            </div>
            <mt-picker :slots="srcSlots" value-key="name" @change="onValuesChangeSrcCountry"></mt-picker>
        </mt-popup>
        <mt-popup v-model="showdesCountry" position="bottom" @touch.prevent>
            <div class="toolbar line-after">
                <div class="left">
                    <mt-button @click="showdesCountry = false">取消</mt-button>
                </div>
                <div class="middle">{{tempType.desCountry}}</div>
                <div class="right">
                    <mt-button @click.native="setCurrentType()">确定</mt-button>
                </div>
            </div>
            <mt-picker :slots="desSlots" value-key="name" @change="onValuesChangeDesCountry"></mt-picker>
        </mt-popup>

        <footer-push v-if="showNews" @click="$_closeFooterPush"></footer-push>
    </div>
</template>

<script>
import { Indicator } from "mint-ui";
import RouteNav from "../../components/route-nav.vue";
import Enter from "./enter.vue";
import { Utils } from "../../utils.js";
import Store from "../../store.js";
import Api from "../../service.js";
import Logger from "../../logger.js";
import SrcCountry from "../../assets/srcCountry.json";
import DesCountry from "../../assets/desCountry.json";
import { MessageBox } from "mint-ui";
import FooterPush from '../common/footer-push.vue';
import pushMixins from '../common/index';

export default {
  mixins: [pushMixins],
  components: {
    RouteNav,
    Enter,
    FooterPush
  },
  data: function() {
    return {
      key: "",
      showTypesPicker: false,
      showsrcCountry: false,
      showdesCountry: false,
      srcCountryCode: "",
      desCountryCode: "",
      currentType: {
        text: "大陆互寄",
        value: "1",
        srcCountry: "",
        desCountry: "",
        srcCountryCode: "",
        desCountryCode: ""
      },
      tempType: {
        text: "",
        value: "",
        srcCountry: "",
        desCountry: "",
        srcCountryCode: "",
        desCountryCode: ""
      },
      lockQuery: {
        type: "",
        key: ""
      }, // keep search condition consistend when load more
      slots: [
        {
          flex: 1,
          values: [
            {
              text: "澳门同城",
              value: "4"
            },
            {
              text: "香港同城",
              value: "2"
            },
            {
              text: "大陆互寄",
              value: "1"
            },
            {
              text: "台湾同城",
              value: "3"
            },
            {
              text: "进出口（含港/澳/台）",
              value: "5"
            }
          ], // 省份数组
          className: "slot1",
          textAlign: "center",
          defaultIndex: 3,
          value: { text: "大陆互寄", value: "1" }
        }
      ],
      srcSlots: [
        {
          flex: 1,
          values: SrcCountry,
          className: "srcSlots1",
          textAlign: "center",
          defaultIndex: 0,
          value: SrcCountry[0]
        }
      ],
      desSlots: [
        {
          flex: 1,
          values: DesCountry,
          className: "srcSlots1",
          textAlign: "center",
          defaultIndex: 0,
          value: DesCountry[0]
        }
      ],
      items: [], // query results
      pagination: {
        current: 1,
        totalPage: 0
      },
      isLoading: false
    };
  },
  computed: {},
  mounted: function() {
    let channel = this.$route.query.channel;
    if (channel) {
      Utils.setChannel(channel);
    }
    this.setCurrentType();
    Logger.log("CSSH5_Other_goods_001");
  },
  methods: {
    log: function(event) {
      Logger.log(event);
    },
    goback: function() {
      Logger.log("CSSH5_Other_goods_006");
      history.go(-1);
    },
    onValuesChange: function(picker, values) {
      if (values[0]) {
        this.tempType.text = values[0].text;
        this.tempType.value = values[0].value;
        // this.items=[];
      }
    },
    onValuesChangeSrcCountry: function(picker, values) {
      if (values[0]) {
        this.tempType.srcCountry = values[0].name;
        this.tempType.srcCountryCode = values[0].countryCode;
      }
    },
    onValuesChangeDesCountry: function(picker, values) {
      if (values[0]) {
        this.tempType.desCountry = values[0].name;
        this.tempType.desCountryCode = values[0].countryCode;
      }
    },
    search: function() {
      if (!this.key) {
        return;
      }
      this.lockQuery.type = JSON.parse(JSON.stringify(this.currentType));
      this.lockQuery.key = this.key;
      this.pagination.current = 1;
      this.pagination.totalPage = 0;
      this.items = [];
      this.getStandards();
    },

    setCurrentType: function() {
      this.showTypesPicker = false;
      this.showsrcCountry = false;
      this.showdesCountry = false;
      this.currentType.text = this.tempType.text;
      this.currentType.value = this.tempType.value;
      this.currentType.srcCountry = this.tempType.srcCountry;
      this.currentType.desCountry = this.tempType.desCountry;
      this.currentType.srcCountryCode = this.tempType.srcCountryCode;
      this.currentType.desCountryCode = this.tempType.desCountryCode;
      this.items = [];
    },
    getStandards: function() {
      if (!this.lockQuery.type || !this.lockQuery.key) {
        return;
      }

      if (
        this.pagination.current > 1 &&
        this.pagination.current > this.pagination.totalPage
      ) {
        return;
      }
      if (this.isLoading) {
        return;
      }
      this.isLoading = true;
      var opration =
        this.currentType.value == 5 ? "foreignServiceRange" : "sendThings";
      var body =
        this.currentType.value == 5
          ? {
              srcCountryCode: this.lockQuery.type.srcCountryCode,
              desCountryCode: this.lockQuery.type.desCountryCode,
              language: "Sc",
              goodsName: this.lockQuery.key,
              currentPage: this.pagination.current,
              pageSize: 5
            }
          : {
              areaType: this.lockQuery.type.value,
              goodsName: this.lockQuery.key,
              currentPage: this.pagination.current
            };

      Indicator.open();
      Api.get(opration, "1", body)
        .then(res => {
          Indicator.close();
          this.isLoading = false;
          if (
            opration === "sendThings" &&
            res.results &&
            res.results.code === "0000" &&
            res.results.data.expressStandards
          ) {
            this.pagination.current++;
            this.pagination.totalPage = res.results.data.totalPage;
            res.results.data.expressStandards.forEach(e => {
              if (e.remark) {
                e.expand = false;
              }
              this.items.push(e);
            });
          } else if (
            opration === "foreignServiceRange" &&
            res.results &&
            res.results.code === "0000" &&
            res.results.data.entityList
          ) {
            this.pagination.current++;
            this.pagination.totalPage = res.results.data.page.totalPage;
            res.results.data.entityList.forEach(e => {
              if (e.remark) {
                e.expand = false;
              }
              this.items.push(e);
            });
          } else {
            this.items = [];
            MessageBox("暂无该物品信息");
          }
          Logger.log("CSSH5_Other_goods_004", {
            goods_direction: this.lockQuery.type.value,
            goods_name: this.lockQuery.key,
            inquiry_result: res.results.code == "0000" ? 1 : 0
          });
        })
        .catch(err => {
          Indicator.close();
          this.isLoading = false;
          Logger.log("CSSH5_Other_goods_004", {
            goods_direction: this.lockQuery.type.value,
            goods_name: this.lockQuery.key,
            inquiry_result: 0
          });
        });
    },
    toggleDetail: function(index) {
      this.items[index].expand = !this.items[index].expand;
    }
  }
};
</script>

<style scoped>
.page > .content {
  position: absolute;
  top: 60px;
  padding-top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.container {
  min-height: 100%;
  padding-bottom: 70px;
  box-sizing: border-box;
  position: relative;
}

.condition {
  background: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.17);
  border-radius: 2px;
  padding: 0 8px 18px;
}

.condition .after-arrow::after {
  right: 10px;
}

.condition .city {
  display: flex;
  align-items: center;
  padding: 8px 11px;
}

.condition .city .label {
  width: 48px;
}

.condition .city .label .icon {
  width: 30px;
  height: 30px;
  background-image: url("../../assets/ic-loc.png");
}

.condition .city .body {
  flex: 1;
}

.condition .btn-wrap {
  padding-top: 15px;
}

.condition .tip {
  margin-top: 11px;
}

.result {
  margin-top: 10px;
}

.result .title {
  color: #999;
  background: #fff;
  padding: 10px 15px 11px;
}

table {
  border-spacing: 0;
}

.tables th,
.tables td {
  color: #666;
  font-weight: normal;
  text-align: left;
}

.tables table {
  width: 100%;
  border-collapse: collapse;
}

.tables .head {
  padding: 8px;
}

.tables .head tr th:first-of-type {
  padding-left: 8px;
}

.tables .head tr th:last-of-type {
  text-align: right;
  padding-right: 16px;
}

.tables .body {
  background: #fff;
  padding: 0 8px;
}

.tables .body .red {
  color: #ff6b6b;
}

.tables .body table:not(:last-of-type),
.tables .body table:not(:last-of-type) tr:first-of-type,
.tables .body table:last-of-type tr.expanded {
  border-bottom: 1px solid #ddd;
}

.tables .body .more {
  position: relative;
  padding-right: 16px;
  text-align: right;
}

.tables .body .more::after {
  border: 2px solid #c7c7cc;
  border-bottom-width: 0;
  border-left-width: 0;
  content: " ";
  top: 50%;
  margin-top: -2px;
  right: 0;
  position: absolute;
  width: 8px;
  height: 8px;
  -webkit-transform: translateY(-50%) rotate(135deg);
  transform: translateY(-50%) rotate(135deg);
}

.tables .body .more.active::after {
  -webkit-transform: translateY(-50%) rotate(-45deg);
  transform: translateY(-50%) rotate(-45deg);
  margin-top: 0;
}

.tables .body td {
  padding: 10px 0 12px 0;
}

.tables .body tr td:first-of-type {
  padding-left: 8px;
}

.tables .body .cate {
  color: #333;
  line-height: 1.4;
}
.tables .body .spec {
  font-size: 12px;
  color: #999;
}

.mint-popup {
  width: 100%;
}
</style>


