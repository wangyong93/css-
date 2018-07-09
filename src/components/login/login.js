import Vue from 'vue';
import LoginVue from './login.vue';

var LoginConstructor = Vue.extend(LoginVue);

function Login(opts) {
  this.instance = null;
  this._nextCb = opts.nextCb || null;
  this._finishCb = opts.finishCb || null;
  this._tip = opts.tip || '';
}

Login.prototype = {
  constructor: Login,
  _init: function() {
    var instance = new LoginConstructor({
      el: document.createElement('div')
    });

    instance.init(this._nextCb, this._finishCb, this._tip);
    document.body.appendChild(instance.$el);
    this.instance = instance;
  },

  open: function() {
    if (!this.instance) {
      this._init();
    }

    Vue.nextTick(_ => {
      this.instance.show();
    });
  },
  close: function() {
    this.instance && this.instance.close();
  },

  distory: function() {
    this.instance && document.body.removeChild(this.instance.$el);
    this.instance = null;
  }
};

export default Login;
