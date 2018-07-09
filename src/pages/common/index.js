/**
 *  推送
 */

import Store from '../../store';
export default{
    data () {
        return {

        }
    },
    computed: {
        showNews () {

            return Store.state.isShowNews
        }
    },
    methods: {
        $_closeFooterPush () {

            Store.state.isShowNews = false;
        }
    }
}