<template>
  <div class="search-index">
    <div class="bg">
      <img src="../../assets/bg-top.png">
      <!-- <div class="img"></div> -->
      <ul>
        <li>快递单号查询</li>
        <li @click="gotoSearch(2);log('CSSH5_CSSH5_Check_home_004')">手机号查询</li>
      </ul>
    </div>
    <div @click="gotoSearch(1);log('CSSH5_CSSH5_Check_home_002')" class="search">
      <search-input class="search-input" :readonly="true" v-model="orderNo"></search-input>
    </div>
  </div>
</template>

<script>
import SearchInput from "../../components/search-input.vue";
import Logger from "../../logger.js";
import { Utils } from "../../utils.js";
export default {
  components: {
    SearchInput
  },
  data: function() {
    return {
      orderNo: ""
    };
  },
  mounted: function() {
    this.log("CSSH5_Check_home_001");
  },
  methods: {
    log: function(event) {
      Logger.log(event);
    },
    gotoSearch: function(type) {
      let query = this.$route.query;
      query.searchType = type;
      query.orderNo = this.orderNo;

      //手机不需要推送微信
      query.showPush = false;
      if (this.$route.query.RouteType && this.$route.query.RouteType == 2) {
        query.RouteType = 2;
      }
      this.$router.push({
        path: "/search/search",
        query: query
      });
    }
  }
};
</script>

<style scoped>
.search-index {
  position: absolute;
  left: 0;
  right: 0;
  top: 50px;
}
.bg {
  position: relative;
}

.bg img {
  display: block;
  width: 100%;
}
.bg ul {
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
}

.bg ul li {
  flex: 1;
  color: #fff;
  text-align: center;
  padding-bottom: 16px;
  position: relative;
}

.bg ul li:first-of-type::after {
  content: " ";
  display: block;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 10px solid #efefef;
  position: absolute;
  left: 50%;
  bottom: 0;
  margin-left: -10px;
}

.bg ul li:last-of-type {
  opacity: 0.5;
}

.search {
  padding: 0 10px 10px 10px;
}
.search-input {
  margin-top: 16px;
}
</style>


