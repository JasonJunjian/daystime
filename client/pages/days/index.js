var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')
// pages/days/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topEvent: null,
    events: [],
    logged: false,
    userInfo: null
  },
  // 用户登录
  login: function () {
    if (this.data.logged) { this.getDayEvent(); return; }
    util.showBusy('加载中...')
    var that = this
    // 调用登录接口
    qcloud.login({
      success(result) { 
        if (result) {
          //util.showSuccess('登录成功')
          that.setData({
            userInfo: result,
            logged: true
          })
          that.getDayEvent();
        } else {
          // 如果不是首次登录，不会返回用户信息，请求用户信息接口获取
          qcloud.request({
            url: config.service.requestUrl,
            login: true,
            success(result) {
              //util.showSuccess('登录成功')
              that.setData({
                userInfo: result.data.data,
                logged: true
              })
              that.getDayEvent();
            },
            fail(error) {
              util.showModel('请求失败', error)
              console.log('request fail', error)
            }
          })
        }
      },
      fail(error) {
        wx.showModal({
          title: '非常遗憾',
          content: '您拒绝了授权，获取您的公开信息失败，程序将不能正常运行，获取的信息不会涉及到您的任何隐私，请允许授权，非常感谢您的理解！',
          showCancel: true,
          success: function (res) {
            if (res.confirm) {
              wx.openSetting({
                success: (res) => {
                  if (res.authSetting['scope.userInfo']) {
                    that.login();
                  }
                }
              })
            }
          }
        })
        console.log('登录失败', error)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.login();
    //加载类别 getclassify
    var that = this;
    var classifys = wx.getStorageSync("classifys");
    if (classifys) {
      var hours = (Date.now() - classifys.time) / 1000 / 60 / 60;
      if (hours > 6) {//6小时过期时间 
        this.getClassifys();
      }
    } else {
      this.getClassifys();
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getDayEvent: function () { 
    var that = this;
    var days = wx.getStorageSync("days");
    if (days) {
      var hours = (Date.now() - days.time) / 1000 / 60 / 60;
      if (hours <= 1) {//一小时过期时间
        that.setDays(days.data);
        return;
      }
    } 
    qcloud.request({
      url: `${config.service.host}/weapp/demo`,
      login: true,
      success(result) {
        wx.hideToast();
        if (result.data.code == 0) {
          if (result.data.data.length == 0) {
            wx.showModal({
              title: '提示',
              content: "你还没有添加一个日子，先去添加一个吧！",
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../addDay/addDay',
                  })
                } else if (res.cancel) {
                }
              }
            })
            return;
          }
          wx.setStorage({
            key: 'days',
            data: { data: result.data.data, time: Date.now() }
          })
          that.setDays(result.data.data);
        }
      },
      fail(error) {
        util.showModel('请求失败', error);
        console.log('request fail', error);
      }
    })
  },
  addday: function () {
    if (!this.data.logged) return;
    wx.navigateTo({
      url: '../addDay/addDay',
    })
  },
  setDays: function (data) {
    wx.hideToast();
    var that = this;
    var temp = [];

    that.data.topEvent = null;
    for (var i in data) {
      var ev = data[i];
      if (ev.istop == 1 && that.data.topEvent == null) {
        that.setData({
          topEvent: ev
        })
      } else {
        temp.push(ev);
      }
    }
    if (that.data.topEvent == null) {
      that.setData({
        topEvent: temp[0],
        events: temp.slice(1, temp.length - 1)
      })
      return;
    }
    that.setData({
      events: temp
    })
  },
  editDay: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../dayView/dayView?id=' + id,
    })
  },
  getClassifys: function () {
    var that = this;
    qcloud.request({
      url: `${config.service.host}/weapp/getclassify`,
      login: false,
      success(result) {
        wx.setStorage({
          key: 'classifys',
          data: { time: Date.now(), data: result.data.data }
        })
      },
      fail(error) { 
        console.log('request fail', error);
      }
    })
  }
})