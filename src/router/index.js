import Table from './../views/table/table'
// import Form from './../views/form/form'
import Brand from './../views/brand'
import Category from './../views/category'
import Sku from './../views/sku'
import Goods from './../views/goods'
import GuessLike from './../views/guess.like'
import SourceAdd from './../views/source.add'
import SourceList from './../views/source.list'
// import ue from './../views/editor/editor'
import Index from './../index'
import Login from './../views/login/login'
import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const routes = [
  {
    path: '/',
    redirect: '/source-list',
    name: 'source-list',
    component: SourceList
  },
  {
    path: '/idx',
    redirect: '/table',
    component: Index,
    children: [
      // {path: '/index', component: Index, name: 'index', class: 'fa-line-chart'},
      // {path: '/table', component: Table, name: 'table', class: 'fa-table'},
      // {path: '/form', component: Form, name: 'form', class: 'fa-newspaper-o'},
      // {path: '/editor', component: ue, name: 'editor', class: 'fa-plug'},
      // {path: '/upload', component: Upload, name: 'upload', class: 'fa-plug'},
      // {path: '/qm', component: Qm, name: 'qm', class: 'fa-plug'},
      // {path: '/user', component: User, name: 'user', class: 'fa-plug'},
      // {path: '/card', component: Card, name: 'card', class: 'fa-plug'},
      // {path: '/sn', component: Sn, name: 'sn', class: 'fa-plug'}
      // {path: '/brand', component: Brand, name: '品牌', class: 'fa-plug'},
      // {path: '/category', component: Category, name: '分类', class: 'fa-plug'},
      // {path: '/sku', component: Sku, name: '规格', class: 'fa-plug'},
      // {path: '/goods', component: Goods, name: '商品', class: 'fa-plug'},
      {path: '/source-list', component: SourceList, name: '资源列表', class: 'fa-plug'},
      {path: '/source-add', component: SourceAdd, name: '新增资源', class: 'fa-plug'}
    ]
  }
]
const router = new Router({
  // 'mode': 'history', 去掉URL的#号，需要配置服务器http://router.vuejs.org/zh-cn/essentials/history-mode.html
  'linkActiveClass': 'active',
  routes
})

export default router
