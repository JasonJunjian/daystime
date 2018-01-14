//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')
var bgUrl = 'http://qcloudtest-1255501801.cn-south.myqcloud.com/1514950916080-rk2ZbCY7f.jpg';
App({
  onLaunch: function () {
    qcloud.setLoginUrl(config.service.loginUrl);
    var app_version = wx.getStorageSync('app_version');
    if (app_version == '' || app_version != config.appVersion) {
      wx.clearStorage();
      wx.setStorage({
        key: 'app_version',
        data: config.appVersion,
      })
      wx.showModal({
        title: '升级提示',
        content: '为了大家的个性化需要，向右滑动可以设置背景图片及模糊程度了，快快体验吧！',
        showCancel:false
      })
    }
    console.log(app_version);
    this.getStyles(function(){});
  },
  getStyles: function (callback) {
    var that = this;
    var styles = wx.getStorageSync("styles");
    if (styles != '') {
      var hours = (Date.now() - styles.time) / 1000 / 60 / 60;
      if (hours < 24) {//24小时过期时间 
        callback(styles.data);
        return;
      }
    }

    qcloud.request({
      url: `${config.service.host}/weapp/getstyle`,
      login: false,
      success(result) {
        wx.setStorage({
          key: 'styles',
          data: { time: Date.now(), data: result.data.data }
        })

        callback(result.data.data);
      },
      fail(error) {
        console.log('request fail', error);
      }
    })
  },
  getBgUrl:function(){
    var url = wx.getStorageSync('appBgUrl');
    return url == '' ? bgUrl : url;
  },
  setBgUrl:function(url){ 
    wx.setStorage({
      key: 'appBgUrl',
      data: url,
    })
  },
  getUserStyles:function(){
    var that = this;
    var styles = wx.getStorageSync("user_styles");
    if (styles != '') {
       return styles;
    }else{
      return [];
    }
  },
  addUserStyles:function(url){
    var that = this;
    var styles = wx.getStorageSync("user_styles");
    if (styles != '') {
      styles.splice(0,0,{ url: url, filter:0});
    }else{
      styles = [{ url: url, filter: 0 }]; 
    }
    wx.setStorage({
      key: 'user_styles',
      data: styles,
    })
  },
  getFilter: function () {
    var filter = wx.getStorageSync('appFilter');
    return filter == '' ? 0 : filter;
  },
  setFilter: function (filter) {
    wx.setStorage({
      key: 'appFilter',
      data: filter,
    })
  },
})