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
    logged:false,
    userInfo:null
  },
  // 用户登录
  login: function () {
    if (this.data.logged) { this.getDayEvent(); return;} 
    //util.showBusy('正在登录')
    var that = this 
    // 调用登录接口
    qcloud.login({
      success(result) {
        console.log(result);
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
          title: '未授权',
          content: "很抱歉!未授权将无法正常使用！点击确定重新授权",
          showCancel: false,
          success: function (res) {
            if (res.confirm) { 
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
    if(days){
      var hours =  (Date.now() - days.time)/1000/60/60; 
      if(hours<=1){//一小时过期时间
        that.setDays(days.data);
        return;
      } 
    }
    util.showBusy('获取中...') 
    qcloud.request({
      url: `${config.service.host}/weapp/demo`,
      login: true,
      success(result) {
        util.showSuccess('获取完成')
        if (result.data.code == 0) {
          if(result.data.data.length == 0){
            wx.showModal({
              title:'提示',
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
            data: { data: result.data.data,time : Date.now()}
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
  addday:function(){
    if(!this.data.logged) return;
    wx.navigateTo({
      url: '../addDay/addDay',
    })
  }, 
  setDays:function(data){
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
  editDay:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../addDay/addDay?id='+id,
    })
  }
})