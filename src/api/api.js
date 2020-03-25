import axios from './../common/utils/http'
import store from './../store'
// import qs from 'qs'

const baseUrl = store.getters.getConfig.baseUrl

const goods = {
  listPage (params) {
    return axios.get(baseUrl + '/goods/listPage', {params: params})
  },
  del (params) {
    return axios.get(baseUrl + '/goods-detail/del', {params: params})
  },
  save (params) {
    return axios.post(baseUrl + '/goods/save', JSON.stringify(params))
  }
}

const goodsDetail = {
  list (params) {
    return axios.get(baseUrl + '/goods-detail/list', {params: params})
  },
  update (params) {
    return axios.post(baseUrl + '/goods-detail/update', JSON.stringify(params))
  },
  updateList (params) {
    return axios.post(baseUrl + '/goods-detail/update-list', JSON.stringify(params))
  }
}

const brand = {
  add (params) {
    return axios.post(baseUrl + '/brand/add', JSON.stringify(params))
  },
  update (params) {
    return axios.post(baseUrl + '/brand/update', JSON.stringify(params))
  },
  listPage (params) {
    return axios.get(baseUrl + '/brand/listPage', {params: params})
  },
  list (params) {
    return axios.get(baseUrl + '/brand/list', {params: params})
  },
  del (params) {
    return axios.get(baseUrl + '/brand/del', {params: params})
  }
}

const category = {
  add (params) {
    return axios.post(baseUrl + '/category/add', JSON.stringify(params))
  },
  update (params) {
    return axios.post(baseUrl + '/category/update', JSON.stringify(params))
  },
  list (params) {
    return axios.get(baseUrl + '/category/list', {params: params})
  },
  del (params) {
    return axios.get(baseUrl + '/category/del', {params: params})
  }
}

const sku = {
  add (params) {
    return axios.post(baseUrl + '/sku/add', JSON.stringify(params))
  },
  list (params) {
    return axios.get(baseUrl + '/sku/list', {params: params})
  },
  del (params) {
    return axios.get(baseUrl + '/sku/del', {params: params})
  }
}

const user = {
  login (params) {
    return axios.get(baseUrl + '/user/mgmtLogin', {params: params})
  }
}

const file = {
  delFile (params) {
    return axios.get(baseUrl + '/file/del', {params: params})
  }
}

const guessLike = {
  list (params) {
    return axios.get(baseUrl + '/guess-like/list', {params: params})
  },
  add (params) {
    return axios.get(baseUrl + '/guess-like/add', {params: params})
  },
  del (params) {
    return axios.get(baseUrl + '/guess-like/del', {params: params})
  }
}

const source = {
  list (params) {
    return axios.get(baseUrl + '/source/list', {params: params})
  },
  save (params) {
    return axios.post(baseUrl + '/source/save', JSON.stringify(params))
  },
  del (params) {
    return axios.get(baseUrl + '/source/del', {params: params})
  },
  detail (params) {
    return axios.get(baseUrl + '/source/detail', {params: params})
  }
}

export default {
  goods,
  goodsDetail,
  brand,
  sku,
  user,
  file,
  guessLike,
  category,
  source
}
