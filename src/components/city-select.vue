<template>
  <div class="sf-city-select" @touchmove.prevent>
    <div class="toolbar line-after">
      <div class="left">
        <div>
          <mt-button @click="getGeoLoc()">定位</mt-button>
        </div>
      </div>
      <div class="middle">{{address.name}}</div>
      <div class="right">
        <div>
          <mt-button @click="selectValue()">确定</mt-button>
        </div>
      </div>
    </div>
    <mt-picker :slots="slots" value-key="name" @change="onValuesChange" ref="picker"></mt-picker>
  </div>
</template>
<script>
import City from "../assets/city.json";
import Api from "../service.js";
import { Utils } from "../utils.js";
import Logger from "../logger.js";
import { Toast } from "mint-ui";

function getAllCity(province) {
  var temp = [];
  for (var i = 0; i < City.length; i++) {
    if (City[i].name === province) {
      temp = City[i].sub;
      break;
    }
  }
  return temp;
}

function getAllDistricts(province, city) {
  var temp = [];
  for (var i = 0; i < City.length; i++) {
    if (City[i].name === province) {
      for (var j = 0; j < City[i].sub.length; j++) {
        if (City[i].sub[j].name === city) {
          temp = City[i].sub[j].sub;
        }
      }
      break;
    }
  }

  return temp;
}

var parseGeoLocation = {
  pIndex: 0,
  cIndex: 0,
  dIndex: 0,
  getProvinceIndex: function(province) {
    for (var i = 0; i < City.length; i++) {
      if (City[i].name === province) {
        this.pIndex = i;
        break;
      }
    }
    return this;
  },
  getCityIndex: function(city) {
    for (var i = 0; i < City[this.pIndex].sub.length; i++) {
      if (City[this.pIndex].sub[i].name === city) {
        this.cIndex = i;
        break;
      }
    }
    return this;
  },
  getDistrictIndex: function(district) {
    for (var i = 0; i < City[this.pIndex].sub[this.cIndex].sub.length; i++) {
      if (City[this.pIndex].sub[this.cIndex].sub[i].name === district) {
        this.dIndex = i;
        break;
      }
    }
    return this;
  },
  parse: function(provice, city, district) {
    this.getProvinceIndex(provice)
      .getCityIndex(city)
      .getDistrictIndex(district);
    return {
      pIndex: this.pIndex,
      cIndex: this.cIndex,
      dIndex: this.dIndex
    };
  }
};

export default {
  props: {
    autoLoc: {
      // 是否自动定位
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      slots: [
        {
          flex: 1,
          values: City, //省份数组
          defaultIndex: 0,
          value: City[0],
          className: "slot1",
          textAlign: "center"
        },
        {
          divider: true,
          content: "-",
          className: "slot2"
        },
        {
          flex: 1,
          values: City[0].sub,
          defaultIndex: 0,
          value: City[0].sub[0],
          className: "slot3",
          textAlign: "center"
        },
        {
          divider: true,
          content: "-",
          className: "slot4"
        },
        {
          flex: 1,
          values: City[0].sub[0].sub,
          defaultIndex: 0,
          value: City[0].sub[0].sub[0],
          className: "slot5",
          textAlign: "center"
        }
      ],

      address: {
        name: "",
        province: "",
        city: {
          name: "",
          deptCode: ""
        },
        district: {
          name: "",
          zoneCode: ""
        }
      },

      visible: false,
      locating: false
    };
  },
  mounted: function() {
    this.autoLocation();
  },
  methods: {
    // Set default geo location
    autoLocation: function() {
      if (!this.autoLoc) {
        return;
      }

      this.locating = true;
      this.getGeoLoc()
        .then(_ => {
          this.locating = false;
          this.$emit("finishSelect", JSON.parse(JSON.stringify(this.address)));
        })
        .catch(err => {
        	console.log(3333)
          this.locating = false;
          console.log(err);
        });
    },
    
    
    getGeoLoc: function() {
      return new Promise((resolve, reject) => {
        var user = Utils.getUser();
        var token = "";
        if (user) {
          token = user.token;
        }
        var temp = [];
        Utils.getLocation().then(pos => {
            Api.get("GISPositioning", 1, {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              token: token,
              operationEquipment: SfGather.device_id
            }).then(res => {
                if (res.results && res.results.code === "0000") {
                  temp = JSON.parse(res.results.data);
                  this.setAddress(
                    parseGeoLocation.parse(
                      temp.result.province,
                      temp.result.city,
                      temp.result.district
                    )
                  );
                  this.$nextTick(_ => {
                    this.$emit(
                      "finishSelect",
                      JSON.parse(JSON.stringify(this.address))
                    );
                  });

                  Logger.log("CSSH5_Send_addrinput_010", {
                    GPS: 1
                  });
                } else if (res.results && res.results.code === "1006") {
                  this.$login(
                    telephone => {
                      this.getGeoLoc();
                    },
                    failure => {},
                    {
                      tip: "请验证手机号以后方可继续使用定位功能"
                    }
                  );
                } else {
                	console.log(44444)
                }
              }).catch(err => {
              	
                Logger.log("CSSH5_Send_addrinput_010", {
                  GPS: 0
                });
//              MessageBox("定位失败，请稍后重试");
                Toast({
								  message: '无法获取GPS定位，请手动选择',
								  position: 'bottom',
								  duration: 2000,
								  className:'geoToast'
								});
                reject(err);
              });
          })
          .catch(err => {
            this.autoLoc = false;
//          MessageBox("请确认是否打开位置共享权限");
            Logger.log("CSSH5_Send_addrinput_010", {
              GPS: 2
            });
            reject(err);
          });
      });
    },
    // getGeoLoc1: function() {
    //   return new Promise((resolve, reject) => {
    //     Api.getGeoPosition()
    //       .then(res => {
    //         if (!this.locating) {
    //           // If auto locate canceled, don't change address & Ui
    //           return;
    //         }
    //         this.setAddress(
    //           parseGeoLocation.parse(res.province, res.city, res.district)
    //         );
    //         this.$nextTick(_ => {
    //           resolve();
    //         });
    //       })
    //       .catch(err => {
    //         // console.log(err);
    //         reject(err);
    //       });
    //   });
    // },
    /**
     *
     */
    setAddress: function({ pIndex, cIndex, dIndex }) {
      var picker = this.$refs.picker;
      if (!picker) {
        return;
      }

      picker.setSlotValue(0, City[pIndex]);
      picker.setSlotValue(1, City[pIndex].sub[cIndex]);
      picker.setSlotValue(2, City[pIndex].sub[cIndex].sub[dIndex]);
    },
    onValuesChange: function(picker, values) {
      var province = "";
      if (values[0] && values[0].name) {
        province = values[0].name;
      } else {
        province = City[0].name;
      }
      var cities = getAllCity(province);
      picker.setSlotValues(1, cities);
      var city = values[1].name;
      var districts = getAllDistricts(province, city);
      picker.setSlotValues(2, districts);

      this.address.name = province + values[1].name + values[2].name;
      this.address.province = province;
      this.address.city.name = values[1].name;
      this.address.city.deptCode = values[1].deptCode;
      this.address.district.name = values[2].name;
      this.address.district.zoneCode = values[2].zoneCode;
    },
    selectValue: function() {
      this.locating = false; // Cancel auto locate handly
      this.$emit("finishSelect", JSON.parse(JSON.stringify(this.address)));
      this.visible = false;
    }
  }
};
</script>
<style>
	.geoToast{
		width: 60%;
		z-index: 2100;
	}
	
</style>