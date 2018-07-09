<template>
  <div class="page">
    <route-nav content="查询结果" @back="gotoBack()" ></route-nav>
     <!--<route-nav content="订单详情" @back="gotoBack()" v-else></route-nav>--> 
     <div class='orderdetail' @click="log('CSSH5_Check_waybillsdetails_002');getDetail()">详情</div>     
    <div class="content">
      <div class="container">
        <div class="order-no line-after">
          <div class="logo icon"></div>
          <p>顺丰快递</p>
          <p class="no">{{orderNo | divideOrderNo}}</p>
        </div>
        <!-- <div class="order-status">{{orderStatus | orderStatus}}</div> -->
        <div class="trace-container">
          <div class="order-info" v-if="records.length > 0">
            <i></i>
            <ul>
              <li v-for="item in records" :key="item.barScanTm">
                <p>【{{item.distName}}】{{item.remark}}</p>
                <p class="date">
                  {{item.barScanTm | timestamp}}
                </p>
              </li>
            </ul>
          </div>
          <div v-else class="no-data">
            暂无快递信息
          </div>
          
        </div>
        <div class="handle">
          <div>
            <div class="btn other" @click="sheetVisible = true">
              <mt-button>其他操作</mt-button>
            </div>
          </div>
          <div>
            <div class="btn urge">
              <mt-button @click="urge()" :class="{'is-disabled': !canUrge}">催一下</mt-button>
            </div>
          </div>
        </div>
      </div>
      
    </div>
    <mt-popup v-model="sheetVisible" position="bottom">
      <div class="actionsheet" @touch.prevent>
        <ul class="mint-actionsheet-list" style="margin-bottom: 5px;">
          <li class="mint-actionsheet-listitem title">选择对单号<span>{{this.orderNo | divideOrderNo}}</span>的操作</li>
          <!-- <li class="mint-actionsheet-listitem" @click="gotoAss()">快件退回</li> -->
          <li class="mint-actionsheet-listitem" >
           <!--  <a href="tel:95338" @click="logTel()" style="width: 100%;display:block;">在线客服</a> -->
            <a href="http://ocs2-idp.sf-express.com/dt_chat/index.action?channelId=61&clientType=2" style="width: 100%;display:block;">在线客服</a>
          </li>
        </ul>
        <a class="mint-actionsheet-button" @click="sheetVisible = false">取消</a>
      </div>
    </mt-popup>
    <mt-popup v-model="showorderdetail" popup-transition="popup-fade">
      <div class="order-popup" @touch.prevent>
        <div class='order-content' >
          <div class='content-header'>运单详情
            <i class='icon-close' @click='showorderdetail=false'></i>
          </div>
          <div class='order-table'>
            <div class='first'>
              <div class="order-img">
                  <img src="../../assets/shunfeng.png" />
              </div>
              <div class="order-jsbarcode">
                  <img id="jsbarcode" ref="jsbarcode"/>
              </div>
            </div>
            <div class="second">
              <div class="order-sendInfo">
                <div>
                  寄方信息：
                </div>
                <div>
                 {{consignorAddr}}
                 {{consignorContName}}
                 {{consignorPhone}}
                </div>
              </div>
              <div class="order-sendCity">
                  原寄地：
              	<div>
                 {{sourceZoneCode}}
              	</div>
              </div>
            </div>
            <div class="third">
              <div class="order-receiveInfo">
                <div>
                  收方信息：
                </div>
                <div>
                 {{addresseeAddr}}
                 {{addresseeContName}}
                 {{addresseePhone}}                 
                </div>
              </div>
              <div class="order-receiveCity">
                  目的地：
              	<div>
                 {{destZoneCode}}
              	</div>                  
              </div>
            </div>
            <div class="forth">
              <div class="order-thingInfo">
                托寄物信息：
                <div style='text-align:center'>{{mailingInformation}}</div>
              </div>
              <div class="order-deliverType">
                产品类型：<br/>
                {{prodName}}
              </div>
            </div>
            <div class="five">
              <div class="five-table">
                  件数
              </div>
              <div class="five-table">
                实际重量
              </div>
              <div class="five-table">
                  计费重量
              </div>
              <div class="five-table">
                运费
              </div>
              <div class="five-table">
                合计费用
              </div>
            </div>
            <div class="six">
              <div class="six-table">
                {{quantity}}
              </div>
              <div class="six-table">
								{{realWeightQty}}
              </div>
              <div class="six-table">
								{{meterageWeightQty}}
              </div>
              <div class="six-table">
									{{freight}}
              </div>
              <div class="six-table">
                 {{totalCost}}
              </div>
            </div>
            <div class="seven">
              <div class='seven-payType'>
                付款方式:
                <div>
                 {{paymentType}}
              	</div>
              </div>
              <div class='seven-deliverAndTime'>
              	<div class='deliver'>收件员：
                	<div>{{consigneeEmpCode}}</div>
                </div>
              	<div class='deliveTime'>寄件日期:<br />{{consignedStrTm}}</div>                
              </div>
            </div>
            <div class="eight">
              <div class='eight-table1'>
               <div>附加服务:</div> 
               <br />
                <div>
                 	声明价值：{{consValue}} 
              	</div> 
              	
              	<div>
                 	保价费用：{{premium}}
              	</div> 
              	
              	<div>
                 	燃油附加费：{{fuelSurcharge}}
              	</div>              	
              </div>
              <div class='eight-table2'>
                <div class='eight-table2-row1'>
                  <div class='eight-table2-box1'>
                   收方签名：<br/>
                  </div>
                  <div class='eight-table2-box2'>
                   派件员：<br/>
                   {{deliverEmpCode}}
                  </div>
                </div>
                <div class='eight-table2-row2'>
                  派件日期：
                <div>
                 	{{signinTm}}
              	</div> 
                 
                </div>
                <div class='eight-table2-row3'>
                  备注栏：
                  <div>
                  	{{waybillRemark}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { Indicator, Toast } from "mint-ui";
import RouteNav from "../../components/route-nav.vue";
import Api from "../../service.js";
import Logger from "../../logger.js";
import { Utils } from "../../utils.js";
import "jsbarcode";
export default {
  components: {
    RouteNav: RouteNav
  },
  filters: {
    timestamp: function(value) {
      if (!value) {
        return;
      }

      var dt = new Date(Number(value));
      var y = dt.getFullYear();
      var m = dt.getMonth() + 1;
      m = m > 9 ? m : "0" + m;
      var d = dt.getDate();
      d = d > 9 ? d : "0" + d;
      var hh = dt.getHours();
      hh = hh > 9 ? hh : "0" + hh;
      var mm = dt.getMinutes();
      mm = mm > 9 ? mm : "0" + mm;

      return y + "-" + m + "-" + d + " " + hh + ":" + mm;
    },

    splitStr: function(str) {}
  },

  computed: {
    canUrge: function() {
      var s = this.orderStatus;
      return s != "60" && s != "110" && s != "120" && s != "50"; // Constants for detail
    }
  },

  data() {
    return {
      orderNo: "", // It's waybillNo
      user: "",
      orders: [],
      // realOrderNo: '',
      page: 1,
      records: [],
      orderStatus: "",
      sheetVisible: false,
      showorderdetail: false,
      consignorAddr:'',
      consignorContName:'',
      consignorPhone:'',
      addresseeAddr:'',
      addresseeContName:'',
      addresseePhone:'',
      sourceZoneCode:'',
      destZoneCode:'',
      mailingInformation:'',
      prodName:'',
      quantity:'',
      realWeightQty:'',
      meterageWeightQty:'',
      freight:'',
      paymentType:'',
      consigneeEmpCode:'',
      deliverEmpCode:'',
      consignedStrTm:'',
      signinTm:'',
      consValue:'',
      premium:'',
      fuelSurcharge:'',
      waybillRemark:'',
      totalCost:''
    };
  },

  mounted() {
    var _token = this.$route.query.token;
    if(_token){
        var _telephone = this.$route.query.telephone;
        if(_telephone){
        	 Utils.setUser({"telephone":_telephone,"token":_token});
        }
    }
    this.user = Utils.getUser();
    this.orderNo = this.$route.query.orderNo;
    JsBarcode(this.$refs.jsbarcode, this.orderNo, {
      height: 35,
      width: 1.5,
      margin: 4,
      displayValue: true,
      fontSize: 14,
      font: "ArialMT"
    });
    this.checkOrder()
      .then(status => {
        Logger.log("CSSH5_Check_waybillsdetails_001", {
          waybill_status: status
        });
      })
      .catch();
  },

  methods: {
  	getDetail:function(){
      let detailToken = Utils.getUser();
  		Api.getDetailInfo(detailToken.telephone,this.orderNo, detailToken.token)
  		.then(response=>{
  					var code=response.data.results.code
  					var flag=response.data.results.flag
  					var results=response.data.results.data;
			if (code == "0000" && flag == true) {
						this.showorderdetail=true
  				  this.consignorAddr=results.waybillConsignor.consignorAddr!=undefined?results.waybillConsignor.consignorAddr:"";
		  			this.consignorContName=results.waybillConsignor.consignorContName!=undefined?results.waybillConsignor.consignorContName:"";
		  			this.consignorPhone=results.waybillConsignor.consignorPhone!=undefined?results.waybillConsignor.consignorPhone:"";
		  			this.addresseeAddr=results.waybillAddressee.addresseeAddr!=undefined?results.waybillAddressee.addresseeAddr:"";
		  			this.addresseeContName=results.waybillAddressee.addresseeContName!=undefined?results.waybillAddressee.addresseeContName:"";
		  			this.addresseePhone=results.waybillAddressee.addresseePhone!=undefined?results.waybillAddressee.addresseePhone:"";
		  			this.sourceZoneCode=results.waybillInfo.sourceZoneCode!=undefined?results.waybillInfo.sourceZoneCode:"";
		  			this.destZoneCode=results.waybillInfo.destZoneCode!=undefined?results.waybillInfo.destZoneCode:"";
		  			this.mailingInformation=results.mailingInformation!=undefined?results.mailingInformation:"";
		  			this.prodName=results.waybillInfo.prodName!=undefined?results.waybillInfo.prodName:"";
		  			this.quantity=results.waybillInfo.quantity!=undefined?results.waybillInfo.quantity:"";
		  			this.realWeightQty=results.waybillInfo.realWeightQty!=undefined?results.waybillInfo.realWeightQty:"";
		  			this.meterageWeightQty=results.waybillInfo.meterageWeightQty!=undefined?results.waybillInfo.meterageWeightQty:"";
		  			this.freight=results.freight!=undefined?results.freight:"";
		  			var paymentTypeCode=results.paymentTypeCode!=undefined?results.paymentTypeCode:""
		  			if(paymentTypeCode==1){
		  				this.paymentType='寄付'
		  			}
		  			else if(paymentTypeCode==2){
		  				this.paymentType='到付'
		  			}
		  			else if(paymentTypeCode==3){
		  				this.paymentType='第三方'
		  			}

		  			this.consigneeEmpCode=results.waybillInfo.consigneeEmpCode!=undefined?results.waybillInfo.consigneeEmpCode:"";
		  			this.deliverEmpCode=results.waybillInfo.deliverEmpCode!=undefined?results.waybillInfo.deliverEmpCode:"";
		  			this.consignedStrTm=results.waybillInfo.consignedStrTm!=undefined?results.waybillInfo.consignedStrTm:"";
		  			var signTime=Number(results.waybillInfo.signinTm!=undefined?results.waybillInfo.signinTm:"");				
						this.signinTm=this.unixTimeTotime(signTime);
		  			
		  			this.consValue=results.waybillInfo.consValue!=undefined?results.waybillInfo.consValue:"";
		  			this.premium=results.premium!=undefined?results.premium:"";
		  			this.fuelSurcharge=results.fuelSurcharge!=undefined?results.fuelSurcharge:"";
		  			this.waybillRemark=results.waybillInfo.waybillRemark!=undefined?results.waybillInfo.waybillRemark:"";
		  			this.totalCost=results.totalCost!=undefined?results.totalCost:"";
		  			
			}
			else if(code == "1006" && flag == false ){
				this.$login(
	        telephone => {
	          this.checkOrder();
	        },
	        failure => {},
	        {
	          tip: "验证之后可以继续查询运单路由信息"
	        }
	      );
			}
			else if(code == "9999" && flag == false){
				this.showorderdetail=false
				this.toast(results)
			}

  		})
  	},
  	unixTimeTotime:function(oTime){	
			if(oTime){
				var d=new Date(oTime);			
			}else{
				
				var d=new Date();
			}
			
			var oYear=d.getFullYear();		
			var oMonth=d.getMonth()+1;    		
			var oDay=d.getDate();						
			var oHours=d.getHours();
			var oMin=d.getMinutes();		
			var oSec=d.getSeconds();
				
			var str=oYear+'-'+oMonth+'-'+oDay+" "+this.formatDate(oHours)+':'+this.formatDate(oMin)+':'+this.formatDate(oSec)

			return str;
		},
		formatDate:function(num){			
			if(num<10){				
				return '0'+num;
			}
			return num;	
		},
  	toast:function(val){
    	Toast({
			  message: val,
			  position: 'bottom',
			  duration: 2000,
			  className:'geoToast'
			});
    },
    log: function(event) {
      Logger.log(event);
    },
    logTel: function() {
      Logger.log("CSSH5_Check_waybillsdetails_004", {
        waybill_status: this.orderStatus,
        adnormalcode: ""
      });
    },
    getOrders: function() {
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
        waybillNo: this.orderNo,
        // phoneNo: this.user.telephone,
        token: this.user.token,
        page: 1
      })
        .then(response => {
          Indicator.close();
          if (response.results.code == "1006") {
            Utils.clearUser();
            var query = this.$route.query;
            query.searchType = 2;
            this.$router.push({
              path: "/search/search",
              query: query
            });
          } else if (response.results && response.results.data) {
            this.orders = this.orders.concat(
              response.results.data.waybillList.map(element => {
                element.uuid = Utils.guid();
                return element;
              })
            );
          }
        })
        .catch(error => {
          Indicator.close();
        });
    },
    checkOrder: function() {
      return new Promise((resolve, reject) => {
        if (!this.orderNo) {
          history.go(-1);
          return;
        }
        var user = Utils.getUser();
        var token = "";
        if (user) {
          token = user.token;
        }
        Indicator.open();
        Api.get("searchTrace", "1", {
          waybillNo: this.orderNo,
          token: token,
          operationEquipment: SfGather.device_id
        })
          .then(response => {
            Indicator.close();
            
            if (response.results.code == "0000") {
              response.results.data.barRecords.forEach(element => {
                this.records.unshift(element);
              });
              // this.orderStatus =
              //   response.results.data.waybillInfo.waybillStatus;
              // this.realOrderNo = response.results.data.waybillInfo.orderNo;
              resolve(this.orderStatus);
            } else if (response.results.code == "1006") {
              this.$login(
                telephone => {
                  this.checkOrder();
                },
                failure => {},
                {
                  tip: "验证之后可以继续查询运单路由信息"
                }
              );
            } else {
            }
          })
          .catch(_ => {
            Indicator.close();
          });
      });
    },
    urge: function() {
      if (!this.canUrge) {
        return;
      }
      Indicator.open();
      if (Utils.getCookie(this.orderNo)) {
        setTimeout(() => {
          Indicator.close();
          Toast("已为您催促，请稍后再试");
        }, 350);
        return;
      }
      setTimeout(() => {
        Indicator.close();
        Utils.setCookie(this.orderNo, 1, 1 / 24);
        Toast("催促成功！顺丰小哥将会为您尽快送到");
      }, 350);
      // Api.get('hasten', '2', {
      //   waybillNo: this.orderNo,
      orderNo: this.realOrderNo;
      // })
      //   .then(response => {
      //     Indicator.close();
      //   })
      //   .catch(error => {
      //     Indicator.close();
      //   });
    },
    gotoAss: function() {
      document.location.href = "http://www.baidu.com";
    },
    gotoBack: function() {
      Logger.log("CSSH5_Other_aging_006");
      history.go(-1);
    }
  }
};
</script>

<style scoped>
.route-nav {
  background: #343640;
  color: #fff;
  position: relative;
}

.route-nav::after {
  content: " ";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -110px;
  background: #343640;
  top: 50px;
}

.orderdetail {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 100;
  font-family: "PingFangSC-Regular", serif;
  font-size: 15px;
  color: #ffffff;
  letter-spacing: 0px;
  top: 15px;
  right: 5%;
}

.content {
  position: absolute;
  top: 50px;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 101;
}

.container {
  background: #ffffff;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.17);
  border-radius: 4px 4px 0 0;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 10px;
  right: 10px;
  overflow: hidden;
}

.container .trace-container {
  position: absolute;
  bottom: 60px;
  left: 0;
  right: 0;
  top: 196px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.order-no {
  text-align: center;
  padding: 16px 0;
}

.order-no .no {
  color: #999;
  font-size: 13px;
  margin-top: 4px;
}

.order-no .logo {
  width: 60px;
  height: 60px;
  background-image: url("../../assets/logo.png");
  margin-bottom: 6px;
}

.order-status {
  color: #00aa24;
  font-size: 14px;
  text-align: center;
  padding: 15px 0;
}

.order-info {
  border-left: 1px solid #e9e9e9;
  margin: 0 20px;
  position: relative;
}
.order-info > i {
  position: absolute;
  display: inline-block;
  width: 15px;
  height: 15px;
  content: " ";
  background: #108ee8;
  top: 0;
  left: -8px;
  border-radius: 50%;
}

.order-info > i::after {
  border: 1px solid #fff;
  border-left: 0;
  border-top: 0;
  content: " ";
  top: 2px;
  left: 6px;
  position: absolute;
  width: 3px;
  height: 8px;
  display: block;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}

.order-info li {
  color: #666;
  font-size: 13px;
  padding: 0 0 20px 20px;
  position: relative;
}

.order-info li::before {
  position: absolute;
  content: " ";
  width: 9px;
  height: 9px;
  border-radius: 50%;
  left: -5px;
  background: #e9e9e9;
  top: 4px;
}

.order-info li:first-of-type::before {
  display: none;
}

.order-info li .date {
  color: #999;
  font-size: 12px;
  line-height: 1.6;
}

.handle {
  position: absolute;
  bottom: 10px;
  left: 10px;
  right: 10px;
  display: flex;
}

.handle > div {
  flex: 1;
}

.btn {
  margin-top: 0;
}
.btn.other {
  margin-right: 5px;
}
.btn.other button {
  background: #fff;
  color: #4a4c5b;
  box-shadow: 0 0 1px #4a4c5b;
}
.btn.urge {
  margin-left: 5px;
}

.mint-popup {
  width: 100%;
}

.actionsheet {
  background: #e0e0e0;
  width: 100%;
  text-align: center;
}

.mint-actionsheet-listitem,
.mint-actionsheet-button,
.mint-actionsheet-listitem a {
  color: #000;
}

.mint-actionsheet-listitem.title {
  font-size: 15px;
  color: #999;
}
.mint-actionsheet-listitem.title span {
  color: rgb(35, 137, 168);
}
.order-popup {
  position: absolute;
  left: 10px;
  right: 10px;
  top: -280px;
  z-index: 102;
  text-align: center;
}

.order-content {
	height: 500px;
  transform: scale(0.8);
  overflow: hidden;
  overflow-y: auto;
  background: #fff;
  border-radius: 7px;
  padding-bottom: 20px;
}
.content-header {
  padding-top: 10px;
  padding-bottom: 10px;
  font-family: PingFangSC-Regular;
  font-size: 18px;
  color: #000000;
  letter-spacing: 0;
  line-height: 21px;
  position: relative;
}
.icon-close {
  position: absolute;
  top: 10px;
  right: 15px;
}
.order-table {
  margin: 0 13px;
  border: 1px solid #000;
  border-bottom: none;
}
.first {
  display: flex;
  padding: 0px;
  margin: 0;
}
.order-img {
  display: inline-block;
  flex: 1.5;
  height: 60px;
  border-bottom: 1px solid #000;
  border-right: 1px solid #000;
  /* float:left; */
}
.order-img img {
  margin-top: 5px;
  width: 80%;
  height: 80%;
}
.order-jsbarcode {
  flex: 2;
  display: inline-block;
  height: 60px;
  border-bottom: 1px solid #000;
}
.second,
.third {
  text-align: left;
  display: flex;
  min-height: 80px;
  border-bottom: 1px solid #000;
}
.order-sendInfo,
.order-receiveInfo,
.order-thingInfo {
  flex: 2.5;
  border-right: 1px solid #000;
}
.order-sendCity,
.order-receiveCity,
.order-deliverType {
  flex: 1.5;
}
.order-sendCity div{
	text-align: center;
	font-size: 28px;
}
.order-receiveCity div{
	text-align: center;
	font-size: 28px;
}
.forth {
  display: flex;
  text-align: left;
  min-height: 35px;
  border-bottom: 1px solid #000;
}
.five,
.six {
  display: flex;
  min-height: 25px;
  line-height: 25px;
  border-bottom: 1px solid #000;
}
.five-table,
.six-table {
  border-right: 1px solid #000;
  flex: 1;
}
.five div:last-child,
.six div:last-child {
  border: none;
}
.seven,
.eight {
  text-align: left;
  display: flex;
  min-height: 90px;
  border-bottom: 1px solid #000;
}
.seven-payType,
.eight-table1 {
  flex: 1;
  border-right: 1px solid #000;
}
.seven-deliverAndTime{
	display: flex;
	flex-direction: column;
}
.seven-deliverAndTime,
.eight-table2 {
  flex: 1;
}
.seven-deliverAndTime .deliver {
  flex: 2;
  border-bottom: 1px solid #000;	
}
.seven-deliverAndTime .deliveTime {
	flex: 1;
}
.eight-table2{
	display: flex;
	flex-direction: column;
}
.eight-table2-row1 {
  display: flex;
  min-height: 35px;
  flex: 1;
  border-bottom: 1px solid #000;
}
.eight-table2-row1 .eight-table2-box1,
.eight-table2-row1 .eight-table2-box2 {
  flex: 1;
}
.eight-table2-row1 .eight-table2-box1 {
  border-right: 1px solid #000;
}
.eight-table2-row2 {
	flex: 1;
  border-bottom: 1px solid #000;
}
.eight-table2-row3 {
	flex: 1;
	min-height: 20px;
}
.geoToast{
	width: 80%;
}
</style>

