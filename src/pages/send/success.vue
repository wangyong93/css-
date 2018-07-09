<template>
  <div class="page">
    <route-nav content="下单成功" :show-back="false"></route-nav>
    <div class="content">
      <div class="success-tip">
        <p>
          <i class="icon"></i>
        </p>
        <p>您已成功下单</p>
        <p class="tip">
          <span>小哥将于</span>
          <span class="red">{{order.pickDate.replace(' ', '')}}</span>
          <span>上门收件</span>
        </p>
        <p class="tip">请您注意安排好时间</p>
      </div>
      <div class="info">
        <div class="order line-after">
          <!-- <div class="no">订单号：{{order.orderNo}}</div> -->
          <div class="no">运单号：
            <span>暂未生成</span>
          </div>
          <div class="status">待取件</div>
        </div>
        <div class="address">
          <div class="site">
            <div class="from">
              <p>{{fromContact.address.city.name}}</p>
              <p class="name">{{fromContact.name}}</p>
            </div>
            <div class="split"><img src="../../assets/arrow.png"></div>
            <div class="to">
              <div v-if="toContact.name">
                <p>{{toContact.address.city.name}}</p>
                <p class="name">{{toContact.name}}</p>
              </div>
              <div v-else class="wait">
                <p>待填写</p>
              </div>
            </div>
          </div>
          <div class="price">
            <p v-if="price">￥
              <span>{{price}}</span>
            </p>
            <p v-else class="wait">￥
              <span>待定</span>
            </p>

          </div>
        </div>
        <div class="date line-before">下单时间：{{order.createDate}}</div>
      </div>
      <p class="tip">小哥收件后，您可以点击“查快递”追踪您的快件信息<br>若对订单有疑问，您可通过
      <a href="http://ocs2-idp.sf-express.com/dt_chat/index.action?channelId=61&clientType=2">在线客服</a>
      进行咨询
      </p>
      <div class="btn">
        <mt-button @click="gotoIndex()">返回首页</mt-button>
      </div>
    </div>
  </div>
</template>

<script>
import RouteNav from '../../components/route-nav.vue';
import { Utils } from '../../utils.js';
import Store from '../../store.js';
import Logger from '../../logger.js';
import { Indicator } from 'mint-ui';
import Api from '../../service.js';

export default {
  components: {
    RouteNav: RouteNav
  },
  data: function() {
    return {
      price: ''
    };
  },
  computed: {
    fromContact: function() {
      return Store.state.fromContact;
    },
    toContact: function() {
      return Store.state.toContact;
    },
    order: function() {
      return {
        orderNo: this.$route.query.orderNo,
        pickDate: this.$route.query.pickDate,
        createDate: this.$route.query.createDate,
        weight: this.$route.query.weight
      };
    }
  },
  mounted: function() {
    Logger.log('CSSH5_Send_success_001', {
      page_type: this.toContact && this.toContact.name ? 1 : 0
    });

    // get price
    this.getPrice();
  },
  methods: {
    getPrice: function() {
      if (!this.toContact || !this.toContact.name) {
        return;
      }

      Indicator.open();
      Api.get('freightTime', '1', {
        srcCityCode: this.fromContact.address.city.deptCode,
        srcZoneCode: this.fromContact.address.district.zoneCode,
        destCityCode: this.toContact.address.city.deptCode,
        destZoneCode: this.toContact.address.district.zoneCode,
        weight: Utils.getMaxWeight(this.order.weight)
      })
        .then(response => {
          if (response.results && response.results.code == '0000') {
            this.price = this.findPrice(response.results.data);
          }
          Indicator.close();
        })
        .catch(_ => {
          Indicator.close();
        });
    },
    // 查找第一个顺丰标快价格
    findPrice: function(items) {
      var price = '';
      for (var i = 0; i < items.length; i++) {
        if (items[i].productType === 'T4') {
          price = items[i].price;
          break;
        }
      }
      return price;
    },
    gotoIndex: function() {
      Logger.log('CSSH5_Send_success_002');
      this.$router.replace('/');
      Store.commit('setToContact', null);
    }
  }
};
</script>

<style>
.success-tip {
  background: #ffffff;
  box-shadow: 0px 2px 2px 0px rgba(0, 0, 0, 0.17);
  border-radius: 3px;
  text-align: center;
  padding: 16px 0 36px;
}

.success-tip .icon {
  width: 84px;
  height: 84px;
  background-image: url('../../assets/success.png');
}

.success-tip p:first-child {
  font-size: 17px;
  color: #333;
  margin: 10px 0 5px;
}

.success-tip .tip {
  line-height: 1.5;
  font-size: 13px;
}

.success-tip .tip .red {
  color: #ff5c24;
}

.info {
  background: #ffffff;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.17);
  border-radius: 4px;
  margin-top: 10px;
  padding: 0 15px;
}

.info .order {
  display: flex;
  padding: 15px 0 10px;
}

.info .order::after {
  border-bottom: 1px dashed #979797;
  background: none;
}

.info .order .no {
  flex: 1;
}

.info .order .no span {
  color: #999;
}

.info .order .status {
  width: 70px;
  color: #108ee8;
}

.info .address {
  display: flex;
  align-items: center;
  padding: 17px 0 18px;
}

.info .address .site {
  flex: 1;
  display: flex;
  align-items: center;
  text-align: center;
}

.info .address .wait {
  color: #999;
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
  color: #666;
}

.content > .tip {
  margin-top: 16px;
  line-height: 1.4;
}

.content > .btn {
  margin-top: 16px;
}
</style>

