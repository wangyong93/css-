<template>
    <ul class="cmpt-contact">
        <li class="after-arrow from" @click="actionFrom()">
            <div class="icon-wrap">
                <i class="icon"></i>
            </div>
            <div class="content">
                <div v-if="hasFrom">
                    <p>{{from.name}}<span class="tel">{{from.telephone | divideTel}}</span></p>
                    <p class="detail">{{from.address.name}}{{from.addressDetail}}</p>
                </div>
                <div v-else class="disable">
                    添加寄件人信息
                </div>
            </div>
        </li>
        <li class="after-arrow to line-before" @click="actionTo()">
            <div class="icon-wrap">
              <i class="icon"></i>
            </div>
            <div v-if="hasTo">
                <p>{{to.name}}<span class="tel">{{to.telephone | divideTel}}</span></p>
                <p class="detail">{{to.address.name}}{{to.addressDetail}}</p>
            </div>
            <div v-else class="disable">
                添加收件人信息(选填)
            </div>
        </li>
    </ul>
</template>

<script>
export default {
  props: {
    from: {
      type: Object
    },

    to: {
      type: Object
    },

    fromAction: {
      type: Function
    },

    toAction: {
      type: Function
    }
  },

  computed: {
    hasFrom: function() {
      return this.from && this.from.name
    },

    hasTo: function() {
      return this.to && this.to.name
    }
  },
  methods: {
    actionFrom: function() {
      this.fromAction && this.fromAction()
    },
    actionTo: function() {
      this.toAction && this.toAction()
    }
  }
};
</script>

<style>
.cmpt-contact {
  box-sizing: border-box;
  padding: 0 11px;
  background: #fff;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.17);
  border-radius: 4px;
}

.cmpt-contact li {
  position: relative;
  display: flex;
  padding: 10px 0;
  align-items: center;
}

.cmpt-contact  li .icon-wrap {
  width: 48px;
}

.cmpt-contact li .icon  {
  width: 30px;
  height: 30px;
}

.cmpt-contact li .tel {
  margin-left: 10px;
}

.cmpt-contact li .detail {
  color: #999;
  font-size: 13px;
  margin-top: 5px;
}

.cmpt-contact li.from .icon {
  background-image: url("../assets/from.png")
}

.cmpt-contact li.to .icon {
  background-image: url("../assets/to.png");
}

.cmpt-contact li .content {
  flex: 1;
  padding-right: 12px;
}
.cmpt-contact .disable {
  color: #bbb;
}
.cmpt-contact .after-arrow::after {
  right: 0;
}
.cmpt-contact .line-before::before {
  left: -3px;
  right: -3px;
}
</style>

