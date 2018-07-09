import Vue from 'vue';
import VueRouter from 'vue-router';

import VoidComponent from './components/void.vue';

import Index from './pages/index/index.vue';

import Confirm from './pages/send/confirm.vue';
import ContactList from './pages/send/contact-list.vue';
import Contact from './pages/send/contact.vue';
import Success from './pages/send/success.vue';
import Agreement from './pages/send/agreement.vue';

import List from './pages/search/list.vue';
import Detail from './pages/search/detail.vue';
import Search from './pages/search/search.vue';

import Scope from './pages/price/scope.vue';
import Standard from './pages/price/standard.vue';
const routes = [
  {
    path: '/',
    component: Index,
    meta: {
      alias: '首页'
    }
  },
  {
    path: '/send',
    component: VoidComponent,
    children: [
      {
        path: 'confirm',
        component: Confirm,
        meta: {
          alias: '确认寄件信息'
        }
      },
      {
        path: 'contactList',
        component: ContactList,
        meta: {
          alias: '地址管理'
        }
      },
      {
        path: 'addContact',
        name: 'addContact',
        component: Contact,
        meta: {
          alias: '添加地址'
        }
      },
      {
        path: 'editContact',
        name: 'editContact',
        component: Contact,
        meta: {
          alias: '编辑地址'
        }
      },
      {
        path: 'success',
        component: Success,
        meta: {
          alias: '下单成功'
        }
      },
      {
        path: 'agreement',
        component: Agreement,
        meta: {
          alias: '快递协议'
        }
      }
    ]
  },
  {
    path: '/search',
    component: VoidComponent,
    children: [
      {
        path: 'list',
        component: List,
        meta: {
          alias: '快递列表'
        }
      },
      {
        path: 'detail',
        component: Detail,
        meta: {
          alias: '查询结果'
        }
      },
      {
        path: 'search',
        component: Search,
        meta: {
          alias: '快递查询'
        }
      }
    ]
  },
  {
    path: '/serve',
    component: VoidComponent,
    children: [
      {
        path: 'scope',
        component: Scope,
        name: 'serveSc'
      },
      {
        path: 'standard',
        component: Standard,
        name: 'serveSt'
      }
    ]
  }
];

Vue.use(VueRouter);

const Router = new VueRouter({
  routes: routes
});

export default Router;
