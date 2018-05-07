import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)
// in development env not use Lazy Loading,because Lazy Loading too many pages will cause webpack hot update too slow.so only in production use Lazy Loading

/* layout */
import Layout from '../views/layout/Layout'

Vue.use(Router)

/**
 * icon : the icon show in the sidebar
 * hidden : if `hidden:true` will not show in the sidebar
 * redirect : if `redirect:noredirect` will not redirct in the levelbar
 * noDropdown : if `noDropdown:true` will not has submenu in the sidebar
 * meta : `{ role: ['admin'] }`  will control the page role
 **/
export const constantRouterMap = [
  { path: '/login', component: _import('login/index'), hidden: true },
  { path: '/404', component: _import('404'), hidden: true },
  {
    path: '',
    icon: 'table',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    noDropdown: true,
    children: [{ path: 'dashboard', name: '首页', meta: { title: '首页', role: ['admin'] }, component: _import('dashboard/index') }]
  },
  {
    path: '/goods',
    component: Layout,
    icon: 'table',
    noDropdown: true,
    children: [{ path: 'goodsManage', name: '商品管理', meta: { title: '商品管理', role: ['admin'] }, component: _import('goods/GoodsManage') }]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/account',
    icon: 'table',
    component: Layout,
    noDropdown: true,
    children: [{ path: 'accountManage', name: '账户管理', meta: { title: '用户管理', role: ['superAdmin'] }, component: _import('account/AccountManage') }]
  },
  {
    path: '/bill',
    icon: 'table',
    component: Layout,
    name: '利润',
    children: [
      { path: 'costManage', name: '成本管控', meta: { title: '成本管控', role: ['superAdmin'] }, component: _import('bill/CostManage') },
      { path: 'orderManage', name: '订单管理', meta: { title: '订单管理', role: ['superAdmin'] }, component: _import('bill/OrderManage') }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]
