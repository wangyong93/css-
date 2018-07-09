<template>
    <div class="page">
        <route-nav content="收寄范围" @back="goback"></route-nav>
        <div class="content">
            <div class="container">
                <div class="condition">
                    <div class="after-arrow city">
                        <div class="label">
                            <i class="icon"></i>
                        </div>
                        <div class="body" @click="showCitySelect = true;">
                            <p v-if="address">{{address.city.name}}-{{address.district.name}}</p>
                            <p v-else class="fake-placeholder">请选择省市区</p>
                        </div>
                    </div>
                    <div class="line-before btn-wrap">
                        <div class="btn">
                            <mt-button @click="search()" :class="{'is-disabled': !address}">查询</mt-button>
                        </div>
                    </div>

                    <p class="tip">查询结果仅供参考</p>
                </div>
                <ul class="result" v-if="result">
                    <li class="line-after title">
                        查询结果
                    </li>
                    <li class="item line-after">
                        <p class="head">{{searchArea}}</p>
                        <p class="type">{{result.rangeType}}</p>
                    </li>
                    <li class="item" v-if="result.noServiceArea && result.noServiceArea.length > 0">
                        <p class="head red">不服务地区</p>
                        <ul class="clearfix">
                            <li v-for="area in result.noServiceArea">
                                <div>{{area}}</div>
                            </li>
                        </ul>
                    </li>
                    <li class="item line-before" v-if="result.normalServiceArea && result.normalServiceArea.length > 0">
                        <p class="head">可收寄地区</p>
                        <ul class="clearfix">
                            <li v-for="area in result.normalServiceArea">
                                <div>{{area}}</div>
                            </li>
                        </ul>
                    </li>
                    <li class="item line-before" v-if="result.remoteAreas && result.remoteAreas.length > 0">
                        <p class="head">偏远地区/特别收送地区</p>
                        <ul class="clearfix">
                            <li v-for="area in result.remoteAreas">
                                <div>{{area}}</div>
                            </li>
                        </ul>
                    </li>
                </ul>
                <enter logname="CSSH5_Other_goods_005"></enter>
            </div>
        </div>
        <mt-popup v-model="showCitySelect" position="bottom">
            <city-select @finishSelect="setAddress" :autoLoc="autoLoc"></city-select>
        </mt-popup>

        <footer-push v-if="showNews" @click="$_closeFooterPush"></footer-push>
    </div>
</template>

<script>
import { Indicator } from "mint-ui";
import RouteNav from "../../components/route-nav.vue";
import CitySelect from "../../components/city-select.vue";
import Enter from "./enter.vue";
import { Utils } from "../../utils.js";
import Api from "../../service.js";
import Logger from "../../logger.js";
import FooterPush from '../common/footer-push.vue';
import pushMixins from '../common/index';

function dayOff(end, start) {
  return (
    (new Date(end).getTime() - new Date(start).getTime()) / (24 * 3600 * 1000)
  );
}
export default {
    mixins: [pushMixins],
  components: {
    RouteNav,
    CitySelect,
    Enter,
      FooterPush
  },
  data: function() {
    return {
      showCitySelect: false,
      address: "", // Detail see city-select.vue
      result: "",
      searchArea: "",
      autoLoc: false
    };
  },
  mounted: function() {
    let channel = this.$route.query.channel;
    if(channel){
      Utils.setChannel(channel);
    };
    Logger.log("CSSH5_Other_region_001");
  },
  methods: {
    log: function(event) {
      Logger.log(event);
    },
    setAddress: function(address) {
      this.showCitySelect = false;
      this.address = address;
      Logger.log("CSSH5_Other_region_002");
    },
    search: function() {
        let vm = this;
      if (!this.address) {
        return;
      }


      Indicator.open();
      Api.get("serviceRange", "1", {
        cityCode: this.address.city.deptCode,
        countyName: this.address.district.name
      })
        .then(res => {
          Indicator.close();
          if (res.results.code == "0000" && res.results.data) {
            this.result = res.results.data;
            this.searchArea =
              this.address.city.name + "-" + this.address.district.name;
          } else {
            this.result = "";
          }
          Logger.log("CSSH5_Other_region_005", {
            region:
              this.address.province +
              this.address.city.name +
              this.address.district.name,
            inquiry_result: res.results.code == "0000" ? 1 : 0
          });
        })
        .catch(err => {
          Indicator.close();
          vm.result = "";


          Logger.log("CSSH5_Other_region_005", {
            region:
              this.address.province +
              this.address.city.name +
              this.address.district.name,
            inquiry_result: 0
          });
        });
    },
    goback: function() {
      Logger.log("CSSH5_Other_region_006");
      history.go(-1);
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
  background: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.17);
}

.result .title {
  font-size: 14px;
  color: #999;
  padding: 10px 0 11px 15px;
}

.result .item {
  padding: 13px 15px 11px 15px;
}

.result .item::after {
  left: 8px;
  right: 8px;
}

.result .item .head.red {
  color: #fe6464;
}

.result .item .type {
  color: #999;
  font-size: 14px;
  margin-top: 3px;
}

.result .item ul {
  margin-top: 8px;
}

.result .item li {
  padding: 4px;
  font-size: 12px;
  color: #666;
  width: 33.333%;
  box-sizing: border-box;
  float: left;
  text-align: center;
}

.result .item li:nth-child(3n + 1) {
  padding-left: 0;
}

.result .item li:nth-child(3n) {
  padding-right: 0;
}

.result .item li > div {
  border: 1px solid #979797;
  padding: 5px 0;
  border-radius: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mint-popup {
  width: 100%;
}
</style>


