import config from './config'
// import { detail, list } from './mock'
import * as Mock from './mock'

// 定义基本的请求属性
const DEFAULT_REQUEST_OPTIONS = {
  url: '',
  data: {},
  header: {
    'Content-Type': 'application/json'
  },
  method: 'GET',
  dataType: 'json'
}

// 封装请求
let util = {
  isDEV: config.isDev, // true
  log() {
    this.isDEV && console.log(...arguments);
  },
  alert(title = '提示', content = config.defaultAlertMsg) {
    if (typeof content === 'object') {
      content = this.isDEV && JSON.stringify(content) || config.defaultAlertMsg
    }
    wx.showModal({
      title,
      content
    })
  },
  setStorageData(key, value = '', cb) {
    wx.setStorage({
      key,
      data: value,
      success() {
        cb && cb()
      }
    })
  },
  getStorageData(key, cb) {
    let self = this
    wx.getStorage({
      key,
      success(res) {
        cb && cb(res)
      },
      fail(err) {
        let msg = err.errMsg || ''
        if (/getStorage:fail/.test(msg)) {
          self.setStorageData(key)
        }
      }
    })
  },
  request(opt) {
    let options = Object.assign({}, DEFAULT_REQUEST_OPTIONS, opt)
    let {url, data, header, method, dataType, mock = false} = options
    let self = this
    return new Promise((resolve, reject) => {
      if (mock) {
        let res = {
          statusCode: 200,
          data: Mock[url]
        }
        if (res && res.statusCode == 200 && res.data) {
          resolve(res.data)
        } else {
          self.alert('提示', res)
          reject(res)
        }
      } else {
        wx.request({
          url,
          data,
          header,
          method,
          dataType,
          success(res) {
            if (res && res.statusCode == 200 && res.data) {
              resolve(res.data)
            } else {
              self.alert('提示', res)
              reject(res)
            }
          },
          fail(err) {
            self.log(err)
            self.alert('提示', res)
            reject(err)
          }
        })
      }
    })
  }
}

export default util