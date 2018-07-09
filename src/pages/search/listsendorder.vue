<template>
    <div class="content" style="padding-top: 10px;" :class="{onlyShow:tipShow==true}">
      <div class="container">
        <div v-if="orders.length === 0" class="no-data">
          暂无数据
        </div>
        <ul v-infinite-scroll="getOrders" infinite-scroll-distance="50">
          <li class="info" v-for="(item,index) in orders" :key="item.guid" @click="gotoDetail(index)">
            <div class="order line-after"> 
              <div class="no">运单号：{{item.waybillNo |divideOrderNo}}</div>
              <div class="status"></div>
            </div>
            <div class="address line-after">
              <div class="site">
                <div class="from">
                  <p>{{item.srcCityName}}</p>
                  <p class="name"></p>
                </div>
                <div class="split"><img src="../../assets/arrow.png"></div>
                <div class="to">
                  <div>
                    <p>{{item.desCityName}}</p>
                    <p class="name"></p>
                  </div>
                </div>
              </div>
            </div>
            <div class="date">寄件时间：{{item.receTm | dateTransform}}</div>
          </li>
        </ul>
      </div>
    </div>
</template>

<script>
import Api from "../../service.js";
import { Utils } from "../../utils.js";
import { MessageBox, Indicator } from "mint-ui";
import Logger from "../../logger.js";
export default {
  props:{
  	tipShow:Boolean
  },
  data() {
    return {
      user: "",
      page: 1,
      pageSize: 0,
      totalSize: 0,
      orders: [],
      isLoading: false,
      stop: false,
      temp: []
    };
  },
  filters: {
    dateTransform: function(value) {
      if (!value) {
        return;
      }
      var str = value.replace("T", " ");
      return str.substring(0, 16);
    }
  },
  computed: {
    // totalPage: function() {
    //   if (this.totalSize == 0 || this.pageSize == 0) {
    //     return 0;
    //   } else {
    //     return Math.ceil(this.totalSize / this.pageSize);
    //   }
    // }
  },
  mounted: function() {
    this.user = Utils.getUser();
  },
  methods: {
    gotoDetail: function(index) {
      if (this.orders[index].BDOrder == true) {
        MessageBox("您的订单正在处理，请耐心等待");
        return;
      }
      var orderNo = this.orders[index].waybillNo;
      var query = this.$route.query;
      query.orderNo = orderNo;
      this.$router.push({
        path: "/search/detail",
        query: query
      });
    },
    getOrders: function() {
      // if (this.page > 1 && this.page >= this.totalPage) {
      //   return;
      // }
      var user = Utils.getUser();

      if (this.isLoading) {
        return;
      }
      // if (this.stop) {
      //   return;
      // }
      this.isLoading = true;
      if (!user || !user.telephone || !user.token) {
        Utils.clearUser();
        var query = this.$route.query;
        query.searchType = 2;
        this.$router.push({
          path: "/search/search",
          query: query
        });
        return;
      }
      Indicator.open();
      Api.get("searchWaybill", "1", {
        phoneNo: user.telephone,
        token: user.token,
        page: this.page,
        telType: 1
      })
        .then(response => {
          Indicator.close();
          this.isLoading = false;
          if (response.results && response.results.data && response.results.data.waybillList) {
            Logger.log("CSSH5_Check_mywaybills_002", {
              search_reult: 1
            });
            // if (response.results.data.length == 0) this.stop = true;

            this.orders = this.orders.concat(
              response.results.data.waybillList.map(element => {
                element.uuid = Utils.guid();
                return element;
              })
            );
            this.page++;
          } else if (response.results.code == "1006") {
            // Utils.clearUser();
            // var query = this.$route.query;
            // query.searchType = 2;
            // this.$router.push({
            //   path: "/search/search",
            //   query: query
            // });
            this.$login(
              telephone => {
                this.getOrders();
              },
              failure => {
                return;
              },
              { tip: "验证之后可以继续查询" }
            );
          } else {
          }
        })
        .catch(error => {
          Indicator.close();
          // this.stop = true;
          Logger.log("CSSH5_Check_mywaybills_002", {
            search_reult: 0
          });
          this.isLoading = true;
        });
    }
  }
};
</script>

<style scoped>
.content {
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}
.content.onlyShow{
	top: 140px;
}
.content .container {
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  position: absolute;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.info:first-of-type {
  margin-top: 0;
}
.info {
  background: #ffffff;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.17);
  border-radius: 4px;
  margin-top: 10px;
  padding: 0 15px;
  height: 200px;
}

.info .order {
  display: flex;
  padding: 15px 0 10px;
  color: #666;
}

.info .order::after {
  background: none;
  border-bottom: 1px dashed #979797;
  left: -10px;
  right: -10px;
}

.info .order .no {
  flex: 1;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
  letter-spacing: 0;
}

.info .order .status {
  width: 70px;
  color: #108ee8;
}

.info .address {
  display: flex;
  align-items: center;
  padding: 17px 0 18px;
  height: 78px;
  font-family: PingFangSC-Regular;
  font-size: 17px;
  color: #000000;
  letter-spacing: 0;
}

.info .address::after {
  left: -6px;
  right: -6px;
}

.info .address .site {
  flex: 1;
  display: flex;
  align-items: center;
  text-align: center;
}

.info .address .site .name {
  color: #666;
  font-size: 14px;
}

.info .address .site > div {
  flex: 1;
}

.info .address .site .split img {
  width: 100%;
}

.info .address .price {
  width: 70px;
}

.info .date {
  padding: 10px 0;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #666666;
  letter-spacing: 0;
}
</style>