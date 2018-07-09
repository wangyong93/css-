<template>
  <div>
    <mt-popup v-model="visible" position="right" :closeOnClickModal="false">
      <div class="content" @touchmove.prevent>
        <i class="icon-close" @click="visible = false;logClose()"></i>
        <section v-if="step === 1">
          <h1>手机号码验证</h1>
          <p class="tip">{{tip}}</p>
          <div class="input-wrap">
            <label ref="telInput">
              <input type="tel" v-model="telephone" placeholder="请输入11位手机号码" maxlength="11" autofocus="autofocus">
            </label>
          </div>
          <div class="btn">
            <mt-button @click="gotoNext()" :class="{'is-disabled': !isValidPhone}">下一步</mt-button>
          </div>
        </section>
        <section v-if="step === 2" class="step2">
          <h1>手机号码验证</h1>
          <p class="tip">验证码将发送至{{telephone | divideTel}}</p>
          <div class="btn" :class="{active: !timer}">
            <span @click="resendCode()">{{timerTip}}</span>
          </div>
          <label class="code-input">
            <div class="real"><input ref="input" type="tel" maxlength="6" v-model="code" @focus="isCodeActive = true" @blur="isCodeActive = false" autofocus='aotufocus'></div>
            <div class="fake">
              <span :class="{active: isCodeActive && code.length === 0}">{{code[0]}}</span>
              <span :class="{active: isCodeActive && code.length === 1}">{{code[1]}}</span>
              <span :class="{active: isCodeActive && code.length === 2}">{{code[2]}}</span>
              <span :class="{active: isCodeActive && code.length === 3}">{{code[3]}}</span>
              <span :class="{active: isCodeActive && code.length === 4}">{{code[4]}}</span>
              <span :class="{active: isCodeActive && (code.length === 5 || code.length ===6)}">{{code[5]}}</span>
            </div>
          </label>
        </section>
      </div>
    </mt-popup>
  </div>
</template>

<script>
import { Utils, Timer } from '../../utils.js';
import Logger from '../../logger.js';

export default {
  computed: {
    timerTip: function() {
      if (this.count === 0) {
        this.timer = null;
        this.count = 60;
        return '重新发送';
      } else {
        return this.count + '秒后重发';
      }
    },
    isValidPhone: function() {
      return Utils.validateTelephone(this.telephone);
    }
  },
  data: function() {
    return {
      telephone: '',
      code: '',
      step: 1,
      visible: false,
      nextCb: null,
      finishCb: null,
      timer: null,
      count: 60,
      isCodeActive: false,
      tip: '为了确保顺丰小哥能够联系到寄件人请您验证寄件人或您的手机号码'
    };
  },
  watch: {
    code: function(value) {
      if (value.length === 6) {
        this.finishInput();
      }
    }
  },
  methods: {
    getTel:function(){
        
    },
    logClose: function() {
      Logger.log('CSSH5_Login_window_007', {
        page_name: Logger.parsePageName()
      });
    },
    init: function(nextCb, finishCb, tip) {
      this.nextCb = nextCb;
      this.finishCb = finishCb;
      if (tip) {
        this.tip = tip;
      }
    },
    show: function() {
      this.visible = true;
    },
    close: function() {
      this.visible = false;
    },
    gotoNext: function() {
      if (!this.isValidPhone) {
        return;
      }
      this.nextCb && this.nextCb(this.telephone);
      this.createTimer();
      this.step = 2;
    },
    createTimer: function() {
      this.timer = null;
      this.timer = new Timer(this.count);
      this.timer.run(count => {
        this.count = count;
      });
    },
    finishInput: function() {
      this.isCodeActive = false;
      this.$refs.input.blur();
      this.finishCb && this.finishCb(this.telephone, this.code);
    },
    resendCode: function() {
      if (this.timer) {
        return;
      }
      this.createTimer();
      this.nextCb(this.telephone, true);
    }
  }
};
</script>

<style scoped>
.mint-popup {
  background: none;
  width: 100%;
}
.content {
  margin: 0 13%;
  background: #fff;
  border-radius: 8px;
  padding: 16px 12px 12px 12px;
  position: relative;
}

h1 {
  text-align: center;
  font-size: 18px;
}

.tip {
  margin-top: 13px;
  text-align: left;
  color: #bbb;
  font-size: 14px;
  line-height: 1.4;
}

.input-wrap {
  box-sizing: border-box;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 13px 15px;
  margin-top: 18px;
}

.input-wrap input {
  width: 100%;
  line-height: normal;
  border: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  padding: 0;
  outline: none;
  font-size: 15px;
}

.btn {
  margin-top: 14px;
}

.btn.active span {
  color: #fff;
  background: #4A4C5B;
  border: 0;
}

.btn span {
  display: inline-block;
  border: 1px solid #ddd;
  border-radius: 3px;
  padding: 6px 8px;
  color: #cacaca;
}

.icon-close {
  position: absolute;
  right: 10px;
  top: 8px;
}

.step2 {
  padding-bottom: 5px;
}

@media screen and (min-width: 340px) {
  .step2 {
    padding-left: 12px;
    padding-right: 12px;
  }
}

.step2 .tip {
  text-align: center;
}

.code-input {
  position: relative;
  display: block;
  height: 28px;
  margin-top: 12px;
  padding: 10px;
}

.code-input .real {
  position: absolute;
  z-index: 1;
  width: 1px;
  height: 1px;
  left: 0;
  overflow: hidden;
}

.code-input .real input {
  color: transparent;
  display: block;
  box-sizing: border-box;
  border: none;
  margin: 0;
  padding: 0;
  width: 1px;
  height: 1px;
}

.code-input .fake {
  position: absolute;
  left: 0;
  top: 0;
  background: #fff;
  z-index: 100;
  width: 100%;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;
}

.code-input .fake span {
  width: 40px;
  height: 40px;
  display: inline-block;
  margin: 0 2px;
  border-radius: 2px;
  border: 1px solid #ddd;
  text-align: center;
  line-height: 48px;
}

.code-input .fake span.active {
  border-color: #ff5c24;
}
</style>

