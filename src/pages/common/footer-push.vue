<template>
    <footer class="wechat-push">
        <div class="wechat-push-content">
            <div class="wechat-push-left">
                <img src="../../assets/common/ic_wechat_close.svg" @click="closePushNews();log('CSSH5_WXcolumn_001')" class="close-icon" alt=""/>

                <img src="../../assets/common/ic_wechat_logo.svg" class="logo-icon" alt=""/>

                <div class="wechat-push-desc">
                    <p class="wechat-push-title">关注顺丰微信公众号</p>
                    <p class="wechat-push-sub-title">便捷的顺丰自助服务平台</p>
                </div>
            </div>
            <div class="wechat-push-right" @click="setJumpUrl();log('CSSH5_WXcolumn_002')">
                立即关注
            </div>
        </div>
    </footer>
</template>

<script>
    /**
     * 微信推送模块
     */
import Logger from "../../logger.js";

export default {
    props: {
      isShowNews: {
          type: Boolean,
          'default': false
      }
    },

    methods: {
    	log:function(event){
	        Logger.log(event);
	    },
        setJumpUrl () {

            //立即关注跳转地址
            window.location.href = 'https://mp.weixin.qq.com/s?__biz=MjM5Njc2NDEwMA==&mid=100000100&idx=1&sn=1697145b03f62dde513a5acc23328063#rd';
        },

        closePushNews () {
            this.$emit('click')
        }
    },
}

</script>

<style scoped>
    .wechat-push{
        height: 45px;
        position: fixed;
        bottom: 0;
        width: 100%;
    }

    .wechat-push-content{
        display: flex;
        width: 100%;
        height: 100%;
    }

    .wechat-push-left{
        flex: 1;
        background-color: #242424;
        align-items: center;
        display: flex;
        padding-left: 4%;
    }

    .wechat-push-right{
        width: 120px;
        background-color: #cf2525;
    }

    .close-icon{
        width: 15px;
    }

    .logo-icon{
        width: 34px;
        margin-left: 6%;
    }

    .wechat-push-desc{
        padding-left: 2.3%;
        width: 100%;
    }

    .wechat-push-title{
        font-size: 12px;
        color: #fff;
        padding-bottom: 2px;
    }

    .wechat-push-sub-title{
        font-size: 8px;
        color: #7f7f7f;
    }

    .wechat-push-right{
        color: #fff;
        font-size: 14px;
        text-align: center;
        line-height: 45px;
    }
</style>