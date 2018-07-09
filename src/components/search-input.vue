<template>
    <div class="search-input">
        <div class="i-wrap">
            <i class="mintui mintui-search"></i>
        </div>
        <div class="input-wrap">
            <input ref="input" type="tel" :value="value" :readonly="readonly" 
            :maxlength="length" placeholder="请输入12位快递单号" @input="updateValue($event.target.value)" 
            @keydown.enter="search()" @blur="search()" v-focus="autofocus">
        </div>
    </div>
</template>

<script>
export default {
  props: {
    length: {
      default: 12,
      type: Number
    },
    value: {
      default: '',
      type: String
    },
    readonly: {
      default: false,
      type: Boolean
    },
    autofocus: {
      default: false,
      type: Boolean
    }
  },
  data: function() {
    return {};
  },
  mounted: function() {},
  methods: {
    search: function() {
      this.$emit('search');
    },
    updateValue: function(value) {
      this.$emit('input', value);
    }
  }
};
</script>

<style scoped>
.search-input {
  padding: 13px;
  background: #ffffff;
  border: 1px solid #dddddd;
  border-radius: 2px;
  display: flex;
  align-items: center;
}

.search-input .i-wrap {
  width: 24px;
}

.search-input i {
  color: rgba(178, 178, 178, 0.9);
  font-size: 14px;
}

.search-input .input-wrap {
  flex: 1;
}

.search-input input {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  border-radius: 0;
  border: 0;
  -webkit-box-flex: 1;
  -ms-flex: 1;
  flex: 1;
  outline: 0;
  line-height: 1.6;
  font-size: inherit;
  width: 100%;
  padding: 0;
}
</style>
