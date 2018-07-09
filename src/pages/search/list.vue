<template>
  <div class="page">
    <route-nav content="快递列表" @back="gotoIndex()"></route-nav>
    <div class="tab">
      <ul class='tabul'>
        <li @click="switchTab(1);log('CSSH5_Check_mywaybills_003')" :class="{active: tabIndex == 1}">我寄的</li>
        <li @click="switchTab(2);log('CSSH5_Check_mywaybills_004')" :class="{active: tabIndex == 2}">我收的</li>
      </ul>
      <div class="onlyHandle" v-if="tipShow">
	      	<span class="context">
	      		仅支持查询最近30天内寄出的快件
	      	</span>
	      	<i class='ic_close' @click='closeTips()'></i>
	    </div>
    </div>
    <div>
      <keep-alive>
        <list-send-order v-if='tabIndex == 1' :tipShow='tipShow'></list-send-order>
        <list-receive-order v-else :tipShow='tipShow'></list-receive-order>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import { Indicator } from "mint-ui";
import RouteNav from "../../components/route-nav.vue";
import { Utils } from "../../utils.js";
import Api from "../../service.js";
import Logger from "../../logger.js";
import ListReceiveOrder from "./listreceiveorder.vue";
import ListSendOrder from "./listsendorder.vue";
export default {
  filters: {
    dateTransform: function(value) {
      if (!value) {
        return;
      }

      var str = value.replace("T", " ");
      return str.substring(0, 16);
    }
  },
  components: {
    RouteNav: RouteNav,
    ListReceiveOrder: ListReceiveOrder,
    ListSendOrder: ListSendOrder
  },
  computed: {
    totalPage: function() {
      if (this.totalSize == 0 || this.pageSize == 0) {
        return 0;
      } else {
        return Math.ceil(this.totalSize / this.pageSize);
      }
    }
  },
  data: function() {
    return {
      user: "",
      page: 1,
      pageSize: 0,
      totalSize: 0,
      orders: [],
      isLoading: false,
      tabIndex: 1,
      tipShow:true
    };
  },
  mounted: function() {
    this.user = Utils.getUser();   
    this.tabIndex = 1;
    Logger.log("CSSH5_Check_mywaybills_001");
  },
  methods: {
  	closeTips:function(){
	  	this.tipShow=false;
	  },
    log:function(event){
        Logger.log(event);
    },
    switchTab: function(index) {
      this.tabIndex = index;
    },
       getOrders: function() {
         if (this.page > 1 && this.page >= this.totalPage) {
           return;
         }
         if (this.isLoading) {
           return;
         }
         this.isLoading = true;
         if (!this.user || !this.user.telephone || !this.user.token) {
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
           phoneNo: this.user.telephone,
           token: this.user.token,
           page: this.page
         })
           .then(response => {
             Indicator.close();
             this.isLoading = false;
             if (response.results.code == "1006") {
               Utils.clearUser();
               var query = this.$route.query;
               query.searchType = 2;
               this.$router.push({
                 path: "/search/search",
                 query: query
               });
             } else if (response.results && response.results.data) {
               Logger.log("CSSH5_Check_mywaybills_001", {
                 search_reult: 1
               });
               this.orders = this.orders.concat(
                 response.results.data.waybillList.map(element => {
                   element.uuid = Utils.guid();
                   return element;
                 })
               );
               this.pageSize = response.results.data.pageSize;
               this.totalSize = response.results.data.totalSize;
               this.page++;
             }
           })
           .catch(error => {
             Indicator.close();
             Logger.log("CSSH5_Check_mywaybills_001", {
               search_reult: 0
             });
             this.isLoading = false;
           });
       },
    gotoDetail: function(index) {
      var orderNo = this.orders[index].waybillNo;
      var query = this.$route.query;
      query.orderNo = orderNo;
      this.$router.push({
        path: "/search/detail",
        query: query
      });
    },
    gotoIndex: function() {
      Logger.log("CSSH5_Check_mywaybills_005");
      var query = this.$route.query;
      query.activeTab = 1;
      this.$router.push({
        path: "/",
        query: query
      });
    }
  }

};
</script>

<style scoped>
.title {
  margin-bottom: 10px;
  padding-left: 10px;
  font-size: 13px;
  color: #666;
  text-align: center;
}
.tab {
  /* display: block; */
  position: relative;
  top: 50px;
  z-index: 101;
  width: 100%;
  border:1px solid #eee;
  
}
.tab .tabul {
  border-radius: 4px;
  display: flex;
  width: 100%;
  height: 50px;
  align-items: center;
  /* background: #4a4c5b; */
  background:#fff;
}

.tab .tabul li {
  flex: 1;
  text-align: center;
  /* color: rgba(255, 255, 255, 0.5); */
  color:#666;
  position: relative;
  height: 50px;
  line-height: 50px;
}

.tab ul li.active {
  color: #FF5C24;
}

.tab ul li.active::after {
  content: "";
  display: block;
  height:2px;
  position: absolute;
  left:36.5%; 
  right:35%;
  bottom: -1px;
  background:#FF5C24;
}

.content {
  position: absolute;
  top: 100px;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
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
  height: 164px;
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
  height: 44px;
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
.onlyHandle{
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	height: 40px;
	background: #FFF3DE;
	line-height: 40px;
	padding-left:24.5px;
	padding-right:10px;
	box-sizing: border-box;
}
.context{
	font-family: PingFangSC-Regular;
	font-size: 14px;
	color: #FF8B16;
	letter-spacing: 0;
}
.ic_close{
	transform: scale(0.6);
	display: block;
	width: 52.3px;
	height: 52.3px;
	border-radius: 6px;
  background: url(../../assets/ic_close.svg) center no-repeat;
}
</style>


