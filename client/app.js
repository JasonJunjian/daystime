//app.js
var qcloud = require('./vendor/wafer2-client-sdk/index')
var config = require('./config')

App({
    onLaunch: function () {
        qcloud.setLoginUrl(config.service.loginUrl);
        var app_version = wx.getStorageSync('app_version');
        if (app_version == '' || app_version != '1.1.9'){
          wx.clearStorage();
          wx.setStorage({
            key: 'app_version',
            data: '1.1.9',
          })
        } 
        console.log(app_version);
    }
})