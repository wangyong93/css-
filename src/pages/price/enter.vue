<template>
    <div class="enter">
        <div class="after-arrow" >
            <a @click="booking()">免费预约上门取件</a>
        </div>
    </div>
</template>

<script>
import { Utils } from '../../utils.js';
import Store from '../../store.js';
import Logger from '../../logger.js';

export default {
  props: {
    logname: ''
  },
  mounted:function () {
  },
  methods: {
    booking: function() {
      if (this.logname) {
        Logger.log(this.logname);
      }
      var user = Utils.getUser();
      if (user && Store.state.fromContactList.length > 0) {
        Store.commit('setFromContact', Store.state.fromContactList[0]);
        this.$router.push({ path: '/send/confirm' });
        return;
      }

      this.$router.push({
        path: '/send/addContact',
        query: {
          type: 'from'
        }
      });
    }
  }
};
</script>
<style scoped>
.enter {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  box-sizing: border-box;
  text-align: center;
  padding-top: 20px;
}

.enter > div {
  display: inline-block;
  color: #999;
  padding-right: 32px;
}
.enter > div::after {
  color: #999;
}
</style>


