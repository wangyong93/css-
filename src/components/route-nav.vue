<template>
    <div class="route-nav">
        <div class="arrow" @click="goBack()">
            <i class="mintui mintui-back"></i>
            <span >返回</span>
        </div>
        {{content}}
    </div>
</template>

<script>
export default {
  props: {
    content: "",
    other:"",
    showBack: {
      default: true,
      type: Boolean
    }
  },

  methods: {
    goBack: function() {
      if (this.$listeners.back) {
        this.$emit("back");
      } else if (this.$route.query.trans && this.$route.query.trans == "back") {
        this.$router.push("/");
      } else {
        history.go(-1);
      }
    }
  }
};
</script>


