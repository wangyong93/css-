<template>
  <div class="page">
    <route-nav content="电子运单契约条款"></route-nav>
    <div class="content">
      <h2>《电子运单契约条款》</h2>
      <p>1、 特别声明：寄件人寄递价值超过1000元的物品的，应当在寄件时向本公司如实声明。寄件人未声明的，本公司有权按照不超过1000元的物品处理。如寄件人认为本条款关于赔偿的约定不足以补偿其损失，本公司建议对价值超过1000元的物品选择保价服务。</p>
      <p>2、 为保证托寄物安全送达，寄件人寄件时应履行以下义务：</p>
      <p>2.1如实申报托寄物内容和价值，并准确、清楚地填写寄件人、收件人的名称、地址、联系电话等资料。</p>
      <p>2.2根据托寄物的性质（尤其是易碎品、液体、气体），提供充分的防破损、防漏、防爆措施，保障托寄物安全派送。</p>
      <p>2.3本公司有权依法对托寄物进行验视，如发现禁止寄递或者限制寄递的物品，有权移交相关部门处理，并配合相关部门追究寄件人违法寄递的法律责任。</p>
      <p>3、 关于费用和发票的约定：</p>
      <p>3.1已经收寄的到付快件，如收件人尚未付费，寄件人要求更改为寄件人付费的，应向本公司支付附加服务费。该服务费标准以本公司在官方网站上公布的价格为准。</p>
      <p>3.2寄件人指示在物流中心、保税区等需要支付出/入仓费或其他额外费用的特殊地址收取或派送快件时，寄件人或其指定付款人应当偿还本公司垫付的上述出/入仓费等额外费用，并向本公司支付附加服务费。该服务费标准以本公司在官方网站上公布的价格为准。</p>
      <p>3.3无法派送的托寄物，若寄件人要求退回，则双程费用均由寄件人承担。</p>
      <p>3.4快件费用按照本公司在官方网站上公布或双方书面协议约定的计算标准收取，一方提出快件费用计算错误要求校正的，另一方应当积极配合校正。</p>
      <p>3.5 本公司在向月结客户收取月结款时提供发票；有发票需求的非月结客户，请在付款后1个月内持运单原件向本公司索取发票。</p>
      <p>4、 关于赔偿的约定：若因本公司原因造成托寄物丢失、破损、短少、延误的，本公司将免除本次运费。</p>
      <p>4.1未保价快件理赔：寄件人未选择保价的，本公司对月结客户在九倍运费的限额内，对非月结客户在七倍运费的限额内赔偿托寄物的实际损失。</p>
      <p>4.2保价快件理赔：寄件人选择保价且支付保价费用的，托寄物丢失、破损或短少的，本公司按照投保金额和损失的比例赔偿，最高不超过托寄物的实际损失金额。</p>
      <p>4.3托寄物残值由本公司和寄件人双方协商处理；如折归寄件人，本公司在核定赔偿金额时将扣减残值。</p>
      <p>5、 对于签单返还服务，若因本公司原因导致签收回单毁损、丢失的，本公司承担的责任仅限于免费提供一次签单返还服务作为赔偿。</p>
      <p>6、 本契约条款未作约定的，或本契约条款与国家相关法律法规及标准相冲突的，按照相关规定执行。</p>
    </div>

  </div>
</template>
<script>
import RouteNav from '../../components/route-nav.vue';
export default {
  components: {
    RouteNav: RouteNav
  }
};
</script>

<style scoped>
.content {
  padding: 70px 15px 20px;
}
.content > h2 {
  margin-bottom: 10px;
}
.content > p {
  text-align: justify;
  line-height: 1.5;
  font-size: 12px;
}
</style>


